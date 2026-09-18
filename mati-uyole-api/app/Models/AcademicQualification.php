<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicQualification extends Model
{
    protected $fillable = [
        'applicant_profile_id',
        'level',
        'index_no',
        'candidate_name',
        'school_name',
        'division',
        'points',
        'year_completed',
        'avn_number',
        'confirmed',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'year_completed' => 'integer',
            'confirmed' => 'boolean',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}