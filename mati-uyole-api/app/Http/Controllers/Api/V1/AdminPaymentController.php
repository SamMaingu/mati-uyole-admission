<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\SmsServiceContract;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AuditLog;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::with('application.user', 'application.programme')
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 20));

        return response()->json($payments);
    }

    public function verify(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'receipt_reference' => ['nullable', 'string', 'max:255'],
        ]);

        $payment = Payment::findOrFail($id);

        if ($payment->status === Payment::STATUS_PAID) {
            return response()->json(['message' => 'Payment already verified.'], 422);
        }

        $payment->update([
            'status' => Payment::STATUS_PAID,
            'receipt_reference' => $data['receipt_reference'] ?? $payment->receipt_reference,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        $application = $payment->application;
        $application->update(['status' => Application::STATUS_PAID]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'payment.verified',
            'subject_type' => Payment::class,
            'subject_id' => $payment->id,
            'meta' => ['application_id' => $application->id],
        ]);

        app(SmsServiceContract::class)->send($application->user->phone, 'payment.confirmed', [
            'application_number' => $application->user->application_number,
        ]);

        return response()->json(['message' => 'Payment verified', 'payment' => $payment->fresh()]);
    }
}