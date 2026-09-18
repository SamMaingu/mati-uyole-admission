<?php

namespace App\Services;

use App\Contracts\AcademicVerificationContract;

class ManualAcademicVerificationService implements AcademicVerificationContract
{
    public function verifyIndexNumber(string $indexNo): string
    {
        return 'unverified';
    }
}