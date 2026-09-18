<?php

namespace App\Providers;

use App\Contracts\AcademicVerificationContract;
use App\Contracts\PaymentServiceContract;
use App\Contracts\SmsServiceContract;
use Illuminate\Support\ServiceProvider;

class IntegrationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PaymentServiceContract::class, function () {
            $driver = config('integrations.payment.driver');
            $class = config("integrations.payment.providers.{$driver}");

            return new $class;
        });

        $this->app->singleton(SmsServiceContract::class, function () {
            $driver = config('integrations.sms.driver');
            $class = config("integrations.sms.providers.{$driver}");

            return new $class;
        });

        $this->app->singleton(AcademicVerificationContract::class, function () {
            $driver = config('integrations.verification.driver');
            $class = config("integrations.verification.providers.{$driver}");

            return new $class;
        });
    }

    public function boot(): void
    {
        //
    }
}