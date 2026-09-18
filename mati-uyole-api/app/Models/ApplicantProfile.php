<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ApplicantProfile extends Model
{
    protected $fillable = [
        'user_id',
        'gender',
        'date_of_birth',
        'place_of_birth',
        'marital_status',
        'citizenship',
        'citizenship_other',
        'region',
        'district',
        'city_town',
        'present_address',
        'postal_box',
        'has_disability',
        'disability_details',
        'passport_photo_path',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'has_disability' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function nextOfKin(): HasOne
    {
        return $this->hasOne(NextOfKin::class);
    }

    public function academicRecord(): HasOne
    {
        return $this->hasOne(AcademicRecord::class);
    }

    public function academicQualifications(): HasMany
    {
        return $this->hasMany(AcademicQualification::class);
    }
}