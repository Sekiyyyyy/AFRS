<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilityLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'building',
        'floor',
        'room_name',
        'description',
    ];

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class, 'location_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'location_id');
    }

    public function getFullLocationAttribute(): string
    {
        return "{$this->building} - {$this->floor} ({$this->room_name})";
    }
}
