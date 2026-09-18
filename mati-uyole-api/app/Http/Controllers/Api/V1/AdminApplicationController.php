<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\SmsServiceContract;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminApplicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $applications = Application::query()
            ->with('user', 'programme', 'academicYear', 'payment')
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('programme_id'), fn ($q, $s) => $q->where('programme_id', $s))
            ->when($request->query('payment_status'), fn ($q, $s) => $q->whereHas('payment', fn ($p) => $p->where('status', $s)))
            ->when($request->query('region'), fn ($q, $s) => $q->whereHas('user.applicantProfile', fn ($p) => $p->where('region', $s)))
            ->when($request->query('district'), fn ($q, $s) => $q->whereHas('user.applicantProfile', fn ($p) => $p->where('district', $s)))
            ->when($request->query('gender'), fn ($q, $s) => $q->whereHas('user.applicantProfile', fn ($p) => $p->where('gender', $s)))
            ->when($request->query('search'), fn ($q, $s) => $q->where(function ($sub) use ($s) {
                $sub->whereHas('user', fn ($u) => $u->where('first_name', 'like', "%{$s}%")
                    ->orWhere('last_name', 'like', "%{$s}%")
                    ->orWhere('phone', 'like', "%{$s}%")
                    ->orWhere('application_number', 'like', "%{$s}%"));
            }))
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 20));

        return response()->json($applications);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $application = Application::with('user.applicantProfile.nextOfKin', 'user.applicantProfile.academicRecord', 'programme', 'academicYear', 'payment', 'documents', 'heslbLoanProofs')
            ->findOrFail($id);

        return response()->json(['application' => $application]);
    }

    public function changeStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string'],
        ]);

        $application = Application::findOrFail($id);
        $newStatus = $data['status'];

        if (! in_array($newStatus, Application::ALLOWED_TRANSITIONS[$application->status] ?? [], true)) {
            return response()->json([
                'message' => "Transition from {$application->status} to {$newStatus} is not allowed.",
            ], 422);
        }

        $oldStatus = $application->status;
        $application->update(['status' => $newStatus]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'application.status_changed',
            'subject_type' => Application::class,
            'subject_id' => $application->id,
            'meta' => ['from' => $oldStatus, 'to' => $newStatus],
        ]);

        app(SmsServiceContract::class)->send($application->user->phone, 'application.status', [
            'application_number' => $application->user->application_number,
            'status' => $newStatus,
        ]);

        return response()->json(['message' => 'Status updated', 'application' => $application->fresh()]);
    }

    public function requestInfo(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $application = Application::findOrFail($id);

        if (! $application->canTransitionTo(Application::STATUS_ADDITIONAL_INFO_REQUIRED)) {
            return response()->json(['message' => 'Current status does not allow requesting more info.'], 422);
        }

        $application->update(['status' => Application::STATUS_ADDITIONAL_INFO_REQUIRED]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'application.info_requested',
            'subject_type' => Application::class,
            'subject_id' => $application->id,
            'meta' => ['message' => $data['message']],
        ]);

        app(SmsServiceContract::class)->send($application->user->phone, 'application.info_requested', [
            'message' => $data['message'],
        ]);

        return response()->json(['message' => 'Additional information requested']);
    }
}