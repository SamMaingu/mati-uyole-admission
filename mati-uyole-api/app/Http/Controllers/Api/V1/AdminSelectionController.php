<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AuditLog;
use App\Models\Programme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSelectionController extends Controller
{
    public function run(Request $request): JsonResponse
    {
        $data = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'programme_id' => ['required', 'exists:programmes,id'],
        ]);

        $programme = Programme::findOrFail($data['programme_id']);

        $pool = Application::where('academic_year_id', $data['academic_year_id'])
            ->where('programme_id', $data['programme_id'])
            ->where('status', Application::STATUS_ELIGIBLE)
            ->orderBy('created_at')
            ->get();

        $capacity = $programme->capacity ?? $pool->count();

        $selected = $pool->take($capacity)->each->update(['status' => Application::STATUS_SELECTED]);

        $waitlisted = $pool->skip($capacity)->each->update(['status' => Application::STATUS_WAITLISTED]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'selection.run',
            'subject_type' => Programme::class,
            'subject_id' => $programme->id,
            'meta' => [
                'selected' => $selected->count(),
                'waitlisted' => $waitlisted->count(),
            ],
        ]);

        return response()->json([
            'message' => 'Selection run completed (final approval pending)',
            'selected' => $selected->count(),
            'waitlisted' => $waitlisted->count(),
        ]);
    }

    public function approve(Request $request): JsonResponse
    {
        $data = $request->validate([
            'application_ids' => ['required', 'array'],
            'application_ids.*' => ['exists:applications,id'],
        ]);

        $count = Application::whereIn('id', $data['application_ids'])
            ->where('status', Application::STATUS_SELECTED)
            ->count();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'selection.approved',
            'meta' => ['count' => $count],
        ]);

        return response()->json(['message' => "Selection approved for {$count} applicants"]);
    }
}