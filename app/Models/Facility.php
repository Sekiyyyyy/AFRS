<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facility extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'location_id',
        'facility_code',
        'name',
        'brand_model',
        'serial_number',
        'status',
        'notes',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(FacilityCategory::class, 'category_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(FacilityLocation::class, 'location_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
