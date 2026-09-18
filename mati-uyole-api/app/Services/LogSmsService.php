<?php

namespace App\Services;

use App\Contracts\SmsServiceContract;
use App\Models\SmsLog;
use Illuminate\Support\Facades\Log;

class LogSmsService implements SmsServiceContract
{
    public function send(string $phone, string $templateKey, array $data): void
    {
        SmsLog::create([
            'channel' => 'sms',
            'template_key' => $templateKey,
            'payload' => $data + ['phone' => $phone],
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        Log::info('SMS would be sent', [
            'phone' => $phone,
            'template_key' => $templateKey,
            'data' => $data,
        ]);
    }
}