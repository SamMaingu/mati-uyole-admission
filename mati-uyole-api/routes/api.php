<?php

use App\Http\Controllers\Api\V1\AdminApplicationController;
use App\Http\Controllers\Api\V1\AdminPaymentController;
use App\Http\Controllers\Api\V1\AdminProgrammeController;
use App\Http\Controllers\Api\V1\AdminReportController;
use App\Http\Controllers\Api\V1\AdminSelectionController;
use App\Http\Controllers\Api\V1\ApplicantApplicationController;
use App\Http\Controllers\Api\V1\ApplicantDocumentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\V1\NectaController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProgrammeController;
use App\Http\Controllers\Api\V1\RegionController;
use Illuminate\Support\Facades\Route;

Route::any('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

Route::prefix('v1')->group(function () {

Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{region}/districts', [RegionController::class, 'districts']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/otp/request', [AuthController::class, 'requestOtp']);
    Route::post('/otp/verify', [AuthController::class, 'verifyOtp']);

    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'show']);
    Route::put('/me/personal-info', [MeController::class, 'updatePersonalInfo']);
    Route::put('/me/next-of-kin', [MeController::class, 'updateNextOfKin']);
    Route::put('/me/academic-info', [MeController::class, 'updateAcademicInfo']);
    Route::post('/me/academic/qualifications', [MeController::class, 'addAcademicQualification']);
    Route::put('/me/academic/qualifications/{id}', [MeController::class, 'updateAcademicQualification']);
    Route::delete('/me/academic/qualifications/{id}', [MeController::class, 'deleteAcademicQualification']);
    Route::post('/academic/lookup', [NectaController::class, 'lookup']);

    Route::get('/programmes', [ProgrammeController::class, 'index']);
    Route::get('/programmes/matching', [ProgrammeController::class, 'matching']);
    Route::get('/programmes/{id}', [ProgrammeController::class, 'show']);

    Route::post('/applications', [ApplicantApplicationController::class, 'store']);
    Route::get('/applications/{id}', [ApplicantApplicationController::class, 'show']);
    Route::post('/applications/{id}/programme', [ApplicantApplicationController::class, 'selectProgramme']);
    Route::post('/applications/{id}/eligibility-check', [ApplicantApplicationController::class, 'eligibilityCheck']);
    Route::post('/applications/{id}/submit', [ApplicantApplicationController::class, 'submit']);
    Route::get('/applications/{id}/status', [ApplicantApplicationController::class, 'status']);

    Route::post('/payments/{application_id}/initiate', [PaymentController::class, 'initiate']);
    Route::post('/payments/{application_id}/mark-paid', [PaymentController::class, 'markAsPaid']);
    Route::get('/payments/{application_id}', [PaymentController::class, 'show']);

    Route::get('/documents', [ApplicantDocumentController::class, 'index']);
    Route::post('/documents', [ApplicantDocumentController::class, 'store']);
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/applications', [AdminApplicationController::class, 'index']);
    Route::get('/applications/{id}', [AdminApplicationController::class, 'show']);
    Route::patch('/applications/{id}', [AdminApplicationController::class, 'update']);
    Route::post('/applications/{id}/status', [AdminApplicationController::class, 'changeStatus']);
    Route::post('/applications/{id}/request-info', [AdminApplicationController::class, 'requestInfo']);

    Route::get('/payments', [AdminPaymentController::class, 'index']);
    Route::post('/payments/{id}/verify', [AdminPaymentController::class, 'verify']);

    Route::get('/programmes', [AdminProgrammeController::class, 'index']);
    Route::post('/programmes', [AdminProgrammeController::class, 'store']);
    Route::get('/programmes/{id}', [AdminProgrammeController::class, 'show']);
    Route::put('/programmes/{id}', [AdminProgrammeController::class, 'update']);
    Route::delete('/programmes/{id}', [AdminProgrammeController::class, 'destroy']);

    Route::post('/selection/run', [AdminSelectionController::class, 'run']);
    Route::post('/selection/approve', [AdminSelectionController::class, 'approve']);

    Route::get('/reports/applications', [AdminReportController::class, 'applications']);
    Route::get('/reports/payments', [AdminReportController::class, 'payments']);
});
});