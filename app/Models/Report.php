<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ticket_number',
        'reporter_id',
        'department_id',
        'category_id',
        'location_id',
        'facility_id',
        'title',
        'description',
        'priority',
        'status',
        'resolution_notes',
        'rejection_reason',
        'submitted_at',
        'resolved_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FacilityCategory::class, 'category_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(FacilityLocation::class, 'location_id');
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ReportStatusHistory::class)->orderBy('created_at', 'asc');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ReportAssignment::class)->orderBy('created_at', 'desc');
    }

    public function activeAssignment(): HasOne
    {
        return $this->hasOne(ReportAssignment::class)->where('status', 'active')->latestOfMany();
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ReportAttachment::class);
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }

    public static function generateTicketNumber(): string
    {
        $prefix = 'REP-' . date('Ymd');
        $lastReport = self::withTrashed()
            ->where('ticket_number', 'like', $prefix . '-%')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastReport) {
            $parts = explode('-', $lastReport->ticket_number);
            $lastSequence = (int) end($parts);
            $newSequence = str_pad((string) ($lastSequence + 1), 4, '0', STR_PAD_LEFT);
        } else {
            $newSequence = '0001';
        }

        return "{$prefix}-{$newSequence}";
    }
}
