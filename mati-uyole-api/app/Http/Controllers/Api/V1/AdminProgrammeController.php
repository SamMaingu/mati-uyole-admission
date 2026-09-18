<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Programme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProgrammeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'programmes' => Programme::with('academicYear')
                ->orderBy('nta_level')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'name' => ['required', 'string', 'max:255'],
            'nta_level' => ['required', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:open,closed'],
            'entry_requirements_text' => ['nullable', 'string'],
        ]);

        $programme = Programme::create($data);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'programme.created',
            'subject_type' => Programme::class,
            'subject_id' => $programme->id,
        ]);

        return response()->json(['programme' => $programme], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json(['programme' => Programme::findOrFail($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $programme = Programme::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'nta_level' => ['sometimes', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable', 'string'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:open,closed'],
            'entry_requirements_text' => ['nullable', 'string'],
        ]);

        $programme->update($data);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'programme.updated',
            'subject_type' => Programme::class,
            'subject_id' => $programme->id,
        ]);

        return response()->json(['programme' => $programme]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $programme = Programme::findOrFail($id);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'programme.deleted',
            'subject_type' => Programme::class,
            'subject_id' => $programme->id,
        ]);

        $programme->delete();

        return response()->json(['message' => 'Programme deleted']);
    }
}