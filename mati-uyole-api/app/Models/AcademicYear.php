<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicYear extends Model
{
    protected $fillable = [
        'label',
        'is_active',
        'application_window_start',
        'application_window_end',
        'round',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'application_window_start' => 'date',
            'application_window_end' => 'date',
        ];
    }

    public function programmes(): HasMany
    {
        return $this->hasMany(Programme::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}