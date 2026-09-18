<?php

namespace App\Services;

use App\Contracts\PaymentServiceContract;
use App\Models\Application;

class ManualPaymentService implements PaymentServiceContract
{
    public const SHARED_CONTROL_NUMBER = '997400027916';

    public function generateControlNumber(Application $application): string
    {
        return self::SHARED_CONTROL_NUMBER;
    }

    public function checkStatus(string $controlNumber): string
    {
        return 'pending';
    }
}