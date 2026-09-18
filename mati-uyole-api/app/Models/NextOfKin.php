<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NextOfKin extends Model
{
    protected $table = 'next_of_kins';

    protected $fillable = [
        'applicant_profile_id',
        'full_name',
        'relationship',
        'phone',
        'present_address',
        'postal_box',
        'city_town',
        'email',
    ];

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}