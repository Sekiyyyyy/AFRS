<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isTechnician()) {
            return $report->assignments()->where('technician_id', $user->id)->exists();
        }

        return $report->reporter_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $report->reporter_id === $user->id && $report->status === 'submitted';
    }

    /**
     * Determine whether the user can assign technicians to the report.
     */
    public function assign(User $user, Report $report): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update report status.
     */
    public function updateStatus(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isTechnician()) {
            return $report->assignments()->where('technician_id', $user->id)->where('status', 'active')->exists();
        }

        // Pelapor can only confirm/close when resolved
        if ($user->id === $report->reporter_id && $report->status === 'resolved') {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can participate in live chat for this report.
     */
    public function chat(User $user, Report $report): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->id === $report->reporter_id) {
            return true;
        }

        if ($user->isTechnician()) {
            return $report->assignments()->where('technician_id', $user->id)->exists();
        }

        return false;
    }
}