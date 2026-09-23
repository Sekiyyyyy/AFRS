<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Department;
use App\Models\Facility;
use App\Models\FacilityCategory;
use App\Models\FacilityLocation;
use App\Models\Message;
use App\Models\Report;
use App\Models\ReportAssignment;
use App\Models\ReportAttachment;
use App\Models\ReportStatusHistory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Report::query()->with([
            'reporter.department',
            'category',
            'location',
            'facility',
            'activeAssignment.technician',
        ]);

        // Role-based scoping
        if ($user->role === 'employee') {
            $query->where('reporter_id', $user->id);
        } elseif ($user->role === 'technician') {
            $query->whereHas('assignments', function ($q) use ($user) {
                $q->where('technician_id', $user->id);
            });
        }

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $reports = $query->latest()->paginate(10)->withQueryString();

        $categories = FacilityCategory::where('is_active', true)->get(['id', 'name']);
        $locations = FacilityLocation::all(['id', 'building', 'floor', 'room_name']);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'priority', 'category_id', 'search']),
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    public function create(Request $request): Response
    {
        $categories = FacilityCategory::where('is_active', true)->get();
        $locations = FacilityLocation::all();
        $facilities = Facility::where('status', 'operational')->get(['id', 'facility_code', 'name', 'category_id', 'location_id']);

        return Inertia::render('Reports/Create', [
            'categories' => $categories,
            'locations' => $locations,
            'facilities' => $facilities,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'min:10'],
            'category_id' => ['required', 'exists:facility_categories,id'],
            'location_id' => ['required', 'exists:facility_locations,id'],
            'facility_id' => ['nullable', 'exists:facilities,id'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'attachments.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // Max 5MB
        ]);

        $report = DB::transaction(function () use ($validated, $user, $request) {
            $ticketNumber = Report::generateTicketNumber();

            $report = Report::create([
                'ticket_number' => $ticketNumber,
                'reporter_id' => $user->id,
                'department_id' => $user->department_id ?? Department::first()->id,
                'category_id' => $validated['category_id'],
                'location_id' => $validated['location_id'],
                'facility_id' => $validated['facility_id'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'priority' => $validated['priority'],
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // Status history
            ReportStatusHistory::create([
                'report_id' => $report->id,
                'user_id' => $user->id,
                'from_status' => null,
                'to_status' => 'submitted',
                'action_note' => 'Laporan dibuat oleh pelapor.',
                'created_at' => now(),
            ]);

            // Attachments
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('reports/attachments', 'public');
                    ReportAttachment::create([
                        'report_id' => $report->id,
                        'user_id' => $user->id,
                        'type' => 'initial_evidence',
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            // Create 1-to-1 conversation
            Conversation::create([
                'report_id' => $report->id,
                'is_locked' => false,
                'last_message_at' => null,
            ]);

            return $report;
        });

        return redirect()->route('reports.show', $report->id)
            ->with('success', 'Laporan berhasil diajukan dengan nomor tiket ' . $report->ticket_number . '!');
    }

    public function show(Report $report, Request $request): Response
    {
        $user = $request->user();

        // Check view access
        if ($user->role === 'employee' && $report->reporter_id !== $user->id) {
            abort(403, 'Anda tidak berhak melihat laporan ini.');
        }

        $report->load([
            'reporter.department',
            'department',
            'category',
            'location',
            'facility',
            'statusHistories.user',
            'assignments.technician.department',
            'assignments.assignedBy',
            'activeAssignment.technician',
            'attachments.user',
            'conversation.messages.sender',
        ]);

        $technicians = [];
        if (in_array($user->role, ['admin'])) {
            $technicians = User::where('role', 'technician')
                ->where('is_active', true)
                ->with('department')
                ->get(['id', 'name', 'username', 'department_id', 'phone']);
        }

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'technicians' => $technicians,
        ]);
    }

    public function assign(Report $report, Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! in_array($user->role, ['admin'])) {
            abort(403, 'Hanya admin yang dapat menugaskan teknisi.');
        }

        $validated = $request->validate([
            'technician_id' => ['required', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $technician = User::findOrFail($validated['technician_id']);

        DB::transaction(function () use ($report, $technician, $user, $validated) {
            // Deactivate previous active assignment if any
            $report->assignments()->where('status', 'active')->update([
                'status' => 'reassigned',
                'completed_at' => now(),
            ]);

            // Create new assignment
            ReportAssignment::create([
                'report_id' => $report->id,
                'technician_id' => $technician->id,
                'assigned_by' => $user->id,
                'status' => 'active',
                'notes' => $validated['notes'] ?? null,
                'assigned_at' => now(),
            ]);

            $previousStatus = $report->status;
            $report->update(['status' => 'assigned']);

            ReportStatusHistory::create([
                'report_id' => $report->id,
                'user_id' => $user->id,
                'from_status' => $previousStatus,
                'to_status' => 'assigned',
                'action_note' => "Ditugaskan kepada {$technician->name}." . ($validated['notes'] ? " Catatan: {$validated['notes']}" : ''),
                'created_at' => now(),
            ]);
        });

        return redirect()->back()->with('success', "Laporan berhasil ditugaskan kepada teknisi {$technician->name}.");
    }

    public function updateStatus(Report $report, Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'status' => ['required', 'in:submitted,under_review,assigned,in_progress,waiting_information,on_hold,resolved,closed,rejected'],
            'action_note' => ['nullable', 'string', 'max:1000'],
            'resolution_notes' => ['nullable', 'string', 'max:2000'],
            'rejection_reason' => ['nullable', 'string', 'max:255'],
            'evidence.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $toStatus = $validated['status'];
        $fromStatus = $report->status;

        // Permissions check for status
        if ($user->role === 'employee' && ! in_array($toStatus, ['closed'])) {
            abort(403, 'Pelapor hanya dapat menutup laporan yang telah selesai.');
        }

        DB::transaction(function () use ($report, $user, $validated, $fromStatus, $toStatus, $request) {
            $updateData = ['status' => $toStatus];

            if ($toStatus === 'resolved') {
                $updateData['resolved_at'] = now();
                $updateData['resolution_notes'] = $validated['resolution_notes'] ?? $validated['action_note'] ?? 'Penanganan perbaikan fasilitas selesai.';
            }

            if ($toStatus === 'closed') {
                $updateData['closed_at'] = now();
            }

            if ($toStatus === 'rejected') {
                $updateData['rejection_reason'] = $validated['rejection_reason'] ?? $validated['action_note'] ?? 'Laporan ditolak oleh administrator.';
            }

            $report->update($updateData);

            // Record status history
            ReportStatusHistory::create([
                'report_id' => $report->id,
                'user_id' => $user->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'action_note' => $validated['action_note'] ?? null,
                'created_at' => now(),
            ]);

            // If evidence photos uploaded
            if ($request->hasFile('evidence')) {
                foreach ($request->file('evidence') as $file) {
                    $path = $file->store('reports/evidence', 'public');
                    ReportAttachment::create([
                        'report_id' => $report->id,
                        'user_id' => $user->id,
                        'type' => $toStatus === 'resolved' ? 'completion_evidence' : 'progress_evidence',
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            // Lock conversation if closed or rejected
            if (in_array($toStatus, ['closed', 'rejected'])) {
                $report->conversation()->update(['is_locked' => true]);
            }
        });

        return redirect()->back()->with('success', "Status laporan berhasil diperbarui menjadi {$toStatus}.");
    }

    public function sendMessage(Report $report, Request $request): RedirectResponse
    {
        $user = $request->user();

        // Check if report chat is accessible by user
        if ($user->role === 'employee' && $report->reporter_id !== $user->id) {
            abort(403, 'Akses percakapan ditolak.');
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $conversation = $report->conversation()->firstOrCreate([
            'report_id' => $report->id,
        ]);

        if ($conversation->is_locked) {
            return redirect()->back()->with('error', 'Percakapan telah dikunci karena tiket telah ditutup.');
        }

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        $conversation->update([
            'last_message_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pesan terkirim.');
    }
}