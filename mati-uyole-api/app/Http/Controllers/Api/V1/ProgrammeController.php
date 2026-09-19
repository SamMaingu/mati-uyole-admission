<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Programme;
use App\Services\EligibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProgrammeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nta_level' => ['nullable', 'integer', Rule::in([4, 5, 6])],
        ]);

        $year = AcademicYear::where('is_active', true)->first();

        $programmes = Programme::when($year, fn ($q) => $q->where('academic_year_id', $year->id))
            ->when(isset($data['nta_level']), fn ($q) => $q->where('nta_level', $data['nta_level']))
            ->orderBy('nta_level')
            ->orderBy('name')
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