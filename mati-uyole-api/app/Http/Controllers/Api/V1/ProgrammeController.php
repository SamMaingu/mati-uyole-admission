<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Programme;
use App\Services\EligibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $year = AcademicYear::where('is_active', true)->first();

        $programmes = Programme::when($year, fn ($q) => $q->where('academic_year_id', $year->id))
            ->orderBy('nta_level')
            ->get();

        return response()->json(['programmes' => $programmes]);
    }

    public function matching(Request $request): JsonResponse
    {
        $year = AcademicYear::where('is_active', true)->first();

        $service = app(EligibilityService::class);
        $levels = $service->eligibleLevels($request->user()->applicantProfile);

        $programmes = Programme::when($year, fn ($q) => $q->where('academic_year_id', $year->id))
            ->whereIn('nta_level', $levels)
            ->orderBy('nta_level')
            ->get();

        return response()->json(['levels' => $levels, 'programmes' => $programmes]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json(['programme' => Programme::findOrFail($id)]);
    }
}