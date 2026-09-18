<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PAYMENT_PENDING = 'payment_pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_UNDER_REVIEW = 'under_review';
    public const STATUS_ADDITIONAL_INFO_REQUIRED = 'additional_info_required';
    public const STATUS_ELIGIBLE = 'eligible';
    public const STATUS_NOT_ELIGIBLE = 'not_eligible';
    public const STATUS_SELECTED = 'selected';
    public const STATUS_WAITLISTED = 'waitlisted';
    public const STATUS_NOT_SELECTED = 'not_selected';
    public const STATUS_ADMISSION_COMPLETED = 'admission_completed';

    public const ALLOWED_TRANSITIONS = [
        self::STATUS_DRAFT => [
            self::STATUS_PAYMENT_PENDING,
            self::STATUS_SUBMITTED,
        ],
        self::STATUS_PAYMENT_PENDING => [
            self::STATUS_PAID,
            self::STATUS_PAYMENT_PENDING,
        ],
        self::STATUS_PAID => [
            self::STATUS_SUBMITTED,
            self::STATUS_PAYMENT_PENDING,
        ],
        self::STATUS_SUBMITTED => [
            self::STATUS_UNDER_REVIEW,
        ],
        self::STATUS_UNDER_REVIEW => [
            self::STATUS_ADDITIONAL_INFO_REQUIRED,
            self::STATUS_ELIGIBLE,
            self::STATUS_NOT_ELIGIBLE,
            self::STATUS_SELECTED,
            self::STATUS_WAITLISTED,
            self::STATUS_NOT_SELECTED,
        ],
        self::STATUS_ADDITIONAL_INFO_REQUIRED => [
            self::STATUS_UNDER_REVIEW,
            self::STATUS_SUBMITTED,
        ],
        self::STATUS_ELIGIBLE => [
            self::STATUS_SELECTED,
            self::STATUS_WAITLISTED,
            self::STATUS_NOT_SELECTED,
        ],
        self::STATUS_NOT_ELIGIBLE => [
            self::STATUS_UNDER_REVIEW,
        ],
        self::STATUS_SELECTED => [
            self::STATUS_ADMISSION_COMPLETED,
            self::STATUS_NOT_SELECTED,
        ],
        self::STATUS_WAITLISTED => [
            self::STATUS_SELECTED,
            self::STATUS_NOT_SELECTED,
        ],
        self::STATUS_NOT_SELECTED => [],
        self::STATUS_ADMISSION_COMPLETED => [],
    ];

    protected $fillable = [
        'user_id',
        'programme_id',
        'academic_year_id',
        'status',
        'eligibility_result',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function heslbLoanProofs(): HasMany
    {
        return $this->hasMany(HeslbLoanProof::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::ALLOWED_TRANSITIONS[$this->status] ?? [], true);
    }
}