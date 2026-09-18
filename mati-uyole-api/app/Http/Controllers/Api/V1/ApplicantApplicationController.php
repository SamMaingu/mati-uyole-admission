<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\SmsServiceContract;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Application;
use App\Models\Payment;
use App\Models\Programme;
use App\Services\EligibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicantApplicationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $academicYear = AcademicYear::where('is_active', true)->first();
        abort_if(! $academicYear, 422, 'No active academic year.');

        $application = Application::firstOrCreate(
            ['user_id' => $user->id, 'academic_year_id' => $academicYear->id],
            ['status' => Application::STATUS_DRAFT],
        );

        Payment::firstOrCreate(
            ['application_id' => $application->id],
            ['status' => Payment::STATUS_UNPAID],
        );

        return response()->json([
            'message' => $application->wasRecentlyCreated
                ? 'Application started. Please pay the application fee.'
                : 'Application already exists. Continue from where you left off.',
            'application' => $application->load('payment', 'programme'),
        ], $application->wasRecentlyCreated ? 201 : 200);
    }

    public function selectProgramme(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'programme_id' => ['required', 'exists:programmes,id'],
        ]);

        $application = $request->user()->applications()->with('payment', 'programme')->findOrFail($id);

        abort_if($application->payment?->status !== Payment::STATUS_PAID, 422, 'Application fee must be paid before selecting a programme.');

        $programme = Programme::findOrFail($data['programme_id']);

        abort_if($programme->status !== 'open', 422, 'This programme is not open for applications.');

        $application->update(['programme_id' => $programme->id]);

        return response()->json([
            'message' => 'Programme selected successfully',
            'application' => $application->fresh('programme', 'payment'),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $application = $request->user()->applications()
            ->with('programme', 'academicYear', 'payment', 'documents')
            ->findOrFail($id);

        return response()->json(['application' => $application]);
    }

    public function eligibilityCheck(Request $request, int $id): JsonResponse
    {
        $application = $request->user()->applications()->with('programme')->findOrFail($id);

        $programme = $application->programme;
        $profile = $request->user()->applicantProfile;

        $service = app(EligibilityService::class);
        $result = $service->assess($programme, $profile);

        $application->update([
            'eligibility_result' => $result['eligible'] ? 'eligible' : 'not_eligible',
        ]);

        return response()->json(['result' => $result]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $application = $request->user()->applications()->findOrFail($id);

        abort_if($application->status !== Application::STATUS_PAID && $application->payment?->status !== Payment::STATUS_PAID, 422, 'Application fee must be paid before submitting.');

        abort_if(! $application->canTransitionTo(Application::STATUS_SUBMITTED), 422, 'Current status does not allow submission.');

        $application->update([
            'status' => Application::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);

        app(SmsServiceContract::class)->send(
            $request->user()->phone,
            'application.submitted',
            ['application_number' => $request->user()->application_number],
        );

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application,
        ]);
    }

    public function status(Request $request, int $id): JsonResponse
    {
        $application = $request->user()->applications()->with('payment')->findOrFail($id);

        return response()->json([
            'status' => $application->status,
            'eligibility' => $application->eligibility_result,
            'payment' => $application->payment?->status,
        ]);
    }
}