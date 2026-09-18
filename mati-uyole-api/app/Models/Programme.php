<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programme extends Model
{
    protected $fillable = [
        'academic_year_id',
        'name',
        'nta_level',
        'description',
        'capacity',
        'status',
        'entry_requirements_text',
    ];

    protected $attributes = [
        'status' => 'open',
    ];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}