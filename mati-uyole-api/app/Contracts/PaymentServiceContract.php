<?php

namespace App\Contracts;

use App\Models\Application;

interface PaymentServiceContract
{
    public function generateControlNumber(Application $application): string;

    public function checkStatus(string $controlNumber): string;
}