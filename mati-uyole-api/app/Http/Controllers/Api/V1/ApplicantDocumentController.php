<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicantDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $application = $request->user()->applications()->findOrFail($request->query('application_id'));

        return response()->json(['documents' => $application->documents]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'application_id' => ['required', 'exists:applications,id'],
            'type' => ['required', 'in:birth_certificate,academic_certificate,passport_photo,other'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,png,jpeg', 'max:5120'],
        ]);

        $application = $request->user()->applications()->findOrFail($data['application_id']);

        abort_if($application->status !== Application::STATUS_SELECTED, 422, 'Documents can only be uploaded after selection.');

        $path = $request->file('file')->store('documents/'.$application->id, 'public');

        $document = Document::create([
            'application_id' => $application->id,
            'type' => $data['type'],
            'file_path' => $path,
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'Document uploaded',
            'document' => $document,
        ], 201);
    }
}