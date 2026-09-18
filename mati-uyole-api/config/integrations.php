<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Integration Drivers
    |--------------------------------------------------------------------------
    |
    | Swap an underlying implementation by changing the driver here.
    | Each contract has a set of named driver implementations.
    |
    |   'payment' => 'manual' | 'gepg'            (PaymentServiceContract)
    |   'sms'     => 'log'    | '<provider>'      (SmsServiceContract)
    |   'verification' => 'manual' | 'nactvet'    (AcademicVerificationContract)
    |
    */

    'payment' => [
        'driver' => env('PAYMENT_DRIVER', 'manual'),
        'providers' => [
            'manual' => App\Services\ManualPaymentService::class,
            'gepg' => App\Services\ManualPaymentService::class,
        ],
    ],

    'sms' => [
        'driver' => env('SMS_DRIVER', 'log'),
        'providers' => [
            'log' => App\Services\LogSmsService::class,
        ],
    ],

    'verification' => [
        'driver' => env('VERIFICATION_DRIVER', 'manual'),
        'providers' => [
            'manual' => App\Services\ManualAcademicVerificationService::class,
            'nactvet' => App\Services\ManualAcademicVerificationService::class,
        ],
    ],

];