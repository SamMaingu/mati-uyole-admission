<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicQualification;
use App\Models\AcademicRecord;
use App\Models\ApplicantProfile;
use App\Models\NextOfKin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MeController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'applicantProfile.nextOfKin',
            'applicantProfile.academicRecord',
            'applicantProfile.academicQualifications' => fn ($q) => $q->orderBy('id'),
            'applications.programme',
            'applications.payment',
        ]);

        return response()->json(['user' => $user]);
    }

    public function updatePersonalInfo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'marital_status' => ['required', 'in:single,married,other'],
            'citizenship' => ['required', 'string', 'max:255'],
            'citizenship_other' => ['nullable', 'string', 'max:255'],
            'region' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'city_town' => ['nullable', 'string', 'max:255'],
            'present_address' => ['required', 'string', 'max:255'],
            'postal_box' => ['nullable', 'string', 'max:255'],
            'has_disability' => ['sometimes', 'boolean'],
            'disability_details' => ['nullable', 'string', 'max:1000'],
        ]);

        $profile = ApplicantProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data,
        );

        return response()->json([
            'message' => 'Personal information saved',
            'profile' => $profile,
        ]);
    }

    public function updateNextOfKin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^0\d{9}$|^(\+?255)\d{9}$/'],
            'present_address' => ['nullable', 'string', 'max:255'],
            'postal_box' => ['nullable', 'string', 'max:255'],
            'city_town' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $profile = $user->applicantProfile ?? ApplicantProfile::create(['user_id' => $user->id]);

        $nextOfKin = NextOfKin::updateOrCreate(
            ['applicant_profile_id' => $profile->id],
            $data,
        );

        return response()->json([
            'message' => 'Next of kin saved',
            'next_of_kin' => $nextOfKin,
        ]);
    }

    public function updateAcademicInfo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'country' => ['nullable', 'string', 'max:255'],
            'primary_school_name' => ['nullable', 'string', 'max:255'],
            'primary_school_district' => ['nullable', 'string', 'max:255'],
            'primary_school_region' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $profile = $user->applicantProfile ?? ApplicantProfile::create(['user_id' => $user->id]);

        $record = AcademicRecord::updateOrCreate(
            ['applicant_profile_id' => $profile->id],
            $data,
        );

        return response()->json([
            'message' => 'Academic information saved',
            'academic_record' => $record,
        ]);
    }

    public function addAcademicQualification(Request $request): JsonResponse
    {
        $data = $request->validate($this->qualificationRules());

        $user = $request->user();
        $profile = $user->applicantProfile ?? ApplicantProfile::create(['user_id' => $user->id]);

        $qualification = $profile->academicQualifications()->create($data);

        return response()->json([
            'message' => 'Qualification added',
            'academic_qualification' => $qualification,
        ], 201);
    }

    public function updateAcademicQualification(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->qualificationRules());

        $profile = $request->user()->applicantProfile;
        abort_if(! $profile, 404, 'No profile found.');

        $qualification = $profile->academicQualifications()->findOrFail($id);
        $qualification->update($data);

        return response()->json([
            'message' => 'Qualification updated',
            'academic_qualification' => $qualification,
        ]);
    }

    public function deleteAcademicQualification(Request $request, int $id): JsonResponse
    {
        $profile = $request->user()->applicantProfile;
        abort_if(! $profile, 404, 'No profile found.');

        $qualification = $profile->academicQualifications()->findOrFail($id);
        $qualification->delete();

        return response()->json(['message' => 'Qualification removed']);
    }

    private function qualificationRules(): array
    {
        return [
            'level' => ['required', Rule::in(['CSEE', 'ACSEE', 'NVA_III', 'NTA_DIPLOMA', 'OTHER'])],
            'index_no' => ['nullable', 'regex:/^[SP]\d{4}\/\d{4}\/\d{4}$/'],
            'candidate_name' => ['nullable', 'string', 'max:255'],
            'school_name' => ['nullable', 'string', 'max:255'],
            'division' => ['nullable', 'in:I,II,III,IV,0'],
            'points' => ['nullable', 'integer', 'min:0', 'max:100'],
            'year_completed' => ['nullable', 'integer', 'min:1990', 'max:' . now()->year],
            'avn_number' => ['nullable', 'regex:/^\d{2}[A-Z]{2}\d+[A-Z]{2}$/'],
            'confirmed' => ['nullable', 'boolean'],
        ];
    }
}