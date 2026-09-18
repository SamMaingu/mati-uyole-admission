<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\PaymentServiceContract;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function initiate(Request $request, int $applicationId, PaymentServiceContract $payments): JsonResponse
    {
        $application = $request->user()->applications()->findOrFail($applicationId);

        $payment = Payment::firstOrCreate(
            ['application_id' => $application->id],
            [
                'amount' => 20000,
                'status' => Payment::STATUS_PENDING,
            ],
        );

        $controlNumber = $payments->generateControlNumber($application);

        $payment->update([
            'control_number' => $controlNumber,
            'status' => Payment::STATUS_PENDING,
        ]);

        if ($application->status === Application::STATUS_DRAFT) {
            $application->update(['status' => Application::STATUS_PAYMENT_PENDING]);
        }

        return response()->json([
            'message' => 'Control number generated. Pay via NMB/GePG and provide receipt for verification.',
            'payment' => $payment,
        ]);
    }

    public function show(Request $request, int $applicationId): JsonResponse
    {
        $application = $request->user()->applications()->findOrFail($applicationId);

        return response()->json(['payment' => $application->payment]);
    }

    public function markAsPaid(Request $request, int $applicationId): JsonResponse
    {
        $application = $request->user()->applications()->findOrFail($applicationId);

        $payment = Payment::updateOrCreate(
            ['application_id' => $application->id],
            [
                'amount' => 20000,
                'status' => Payment::STATUS_PAID,
                'receipt_reference' => 'TEST-' . strtoupper(substr(md5($application->user_id . $application->id . now()), 0, 8)),
                'paid_at' => now(),
            ],
        );

        if (in_array($application->status, [Application::STATUS_DRAFT, Application::STATUS_PAYMENT_PENDING])) {
            $application->update(['status' => Application::STATUS_PAID]);
        }

        return response()->json([
            'message' => 'Payment marked as paid (test mode).',
            'payment' => $payment,
        ]);
    }
}