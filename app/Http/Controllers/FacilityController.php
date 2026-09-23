<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\FacilityCategory;
use App\Models\FacilityLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Facility::with(['category', 'location']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('facility_code', 'like', "%{$search}%")
                    ->orWhere('brand_model', 'like', "%{$search}%");
            });
        }

        $facilities = $query->paginate(12)->withQueryString();
        $categories = FacilityCategory::where('is_active', true)->get();
        $locations = FacilityLocation::all();

        return Inertia::render('Facilities/Index', [
            'facilities' => $facilities,
            'categories' => $categories,
            'locations' => $locations,
            'filters' => $request->only(['category_id', 'status', 'search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:facility_categories,id'],
            'location_id' => ['required', 'exists:facility_locations,id'],
            'facility_code' => ['required', 'string', 'max:50', 'unique:facilities,facility_code'],
            'name' => ['required', 'string', 'max:150'],
            'brand_model' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:operational,damaged,maintenance,retired'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        Facility::create($validated);

        return redirect()->back()->with('success', 'Fasilitas baru berhasil didaftarkan.');
    }

    public function update(Request $request, Facility $facility): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:facility_categories,id'],
            'location_id' => ['required', 'exists:facility_locations,id'],
            'facility_code' => ['required', 'string', 'max:50', 'unique:facilities,facility_code,' . $facility->id],
            'name' => ['required', 'string', 'max:150'],
            'brand_model' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:operational,damaged,maintenance,retired'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $facility->update($validated);

        return redirect()->back()->with('success', 'Data fasilitas berhasil diperbarui.');
    }

    public function destroy(Facility $facility): RedirectResponse
    {
        $facility->delete();

        return redirect()->back()->with('success', 'Fasilitas telah diarsipkan (soft delete).');
    }
}