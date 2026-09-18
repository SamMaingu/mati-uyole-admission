<?php

namespace App\Contracts;

interface AcademicVerificationContract
{
    public function verifyIndexNumber(string $indexNo): string;
}