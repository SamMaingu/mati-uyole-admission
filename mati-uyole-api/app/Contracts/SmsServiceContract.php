<?php

namespace App\Contracts;

interface SmsServiceContract
{
    public function send(string $phone, string $templateKey, array $data): void;
}