<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function applications(Request $request): JsonResponse
    {
        $rows = Application::query()
            ->with('user.applicantProfile', 'programme', 'academicYear', 'payment')
            ->when($request->query('academic_year_id'), fn ($q, $s) => $q->where('academic_year_id', $s))
            ->when($request->query('programme_id'), fn ($q, $s) => $q->where('programme_id', $s))
            ->get()
            ->map(fn ($a) => [
                'application_number' => $a->user?->application_number,
                'name' => $a->user?->full_name,
                'phone' => $a->user?->phone,
                'gender' => $a->user?->applicantProfile?->gender,
                'region' => $a->user?->applicantProfile?->region,
                'district' => $a->user?->applicantProfile?->district,
                'programme' => $a->programme?->name,
                'nta_level' => $a->programme?->nta_level,
                'status' => $a->status,
                'eligibility' => $a->eligibility_result,
                'payment' => $a->payment?->status,
            ]);

        return $this->respond($request, 'applications', $rows);
    }

    public function payments(Request $request): JsonResponse
    {
        $rows = Payment::query()
            ->with('application.user', 'application.programme')
            ->get()
            ->map(fn ($p) => [
                'application_number' => $p->application?->user?->application_number,
                'name' => $p->application?->user?->full_name,
                'programme' => $p->application?->programme?->name,
                'control_number' => $p->control_number,
                'amount' => $p->amount,
                'status' => $p->status,
                'verified_at' => $p->verified_at,
            ]);

        return $this->respond($request, 'payments', $rows);
    }

    private function respond(Request $request, string $name, $rows): JsonResponse
    {
        $format = $request->query('format', 'json');

        if ($format === 'csv') {
            $csv = $this->toCsv($rows);

            return response($csv)->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', "attachment; filename={$name}.csv");
        }

        return response()->json([$name => $rows]);
    }

    private function toCsv($rows): string
    {
        $output = fopen('php://temp', 'r+');

        if ($rows->isEmpty()) {
            return '';
        }

        fputcsv($output, array_keys($rows->first()));
        foreach ($rows as $row) {
            fputcsv($output, array_map(fn ($v) => is_string($v) ? mb_convert_encoding($v, 'UTF-8', 'UTF-8') : $v, $row));
        }

        rewind($output);

        return stream_get_contents($output);
    }
}