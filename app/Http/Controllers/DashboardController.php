<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Facility;
use App\Models\FacilityCategory;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->loadMissing('department');

        $stats = [];
        $recentReports = [];
        $chartData = [];

        if ($user->role === 'employee') {
            // Pegawai / User
            $query = Report::where('reporter_id', $user->id);

            $stats = [
                'total' => (clone $query)->count(),
                'submitted' => (clone $query)->whereIn('status', ['submitted', 'under_review'])->count(),
                'in_progress' => (clone $query)->whereIn('status', ['assigned', 'in_progress', 'waiting_information', 'on_hold'])->count(),
                'resolved' => (clone $query)->whereIn('status', ['resolved', 'closed'])->count(),
            ];

            $recentReports = (clone $query)
                ->with(['category', 'location', 'facility', 'activeAssignment.technician'])
                ->latest()
                ->take(5)
                ->get();
        } elseif ($user->role === 'technician') {
            // Support / Teknik
            $assignedReportIds = $user->assignments()
                ->where('status', 'active')
                ->pluck('report_id');

            $query = Report::whereIn('id', $assignedReportIds);

            $stats = [];
            $stats = [
                'total_assigned' => (clone $query)->count(),
                'in_progress' => (clone $query)->where('status', 'in_progress')->count(),
                'waiting_action' => (clone $query)->whereIn('status', ['assigned', 'waiting_information', 'on_hold'])->count(),
                'urgent' => (clone $query)->whereIn('priority', ['high', 'urgent'])->count(),
            ];

            $recentReports = (clone $query)
                ->with(['reporter', 'category', 'location', 'facility'])
                ->latest()
                ->take(6)
                ->get();
        } else {
            // Administrator Sistem AFRS
            $stats = [
                'total_users' => User::count(),
                'total_reports' => Report::count(),
                'incoming' => Report::whereIn('status', ['submitted', 'under_review'])->count(),
                'in_progress' => Report::whereIn('status', ['assigned', 'in_progress', 'on_hold', 'waiting_information'])->count(),
                'resolved' => Report::whereIn('status', ['resolved', 'closed'])->count(),
                'total_facilities' => Facility::count(),
                'total_departments' => Department::count(),
            ];

            $recentReports = Report::with(['reporter', 'category', 'location', 'activeAssignment.technician'])
                ->latest()
                ->take(8)
                ->get();

            $chartData = FacilityCategory::withCount('reports')
                ->get()
                ->map(fn ($cat) => [
                    'name' => $cat->name,
                    'reports_count' => $cat->reports_count,
                ]);
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'chartData' => $chartData,
        ]);
    }
}
