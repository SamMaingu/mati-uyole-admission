<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicRecord extends Model
{
    protected $fillable = [
        'applicant_profile_id',
        'qualification_type',
        'index_no_primary',
        'index_no_secondary',
        'division',
        'points',
        'year_completed',
        'secondary_school_name',
        'country',
        'primary_school_name',
        'primary_school_district',
        'primary_school_region',
        'avn_number',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'year_completed' => 'integer',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}