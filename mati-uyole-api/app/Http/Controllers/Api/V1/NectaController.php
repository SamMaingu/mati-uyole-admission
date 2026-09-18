<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NectaController extends Controller
{
    public function lookup(Request $request): JsonResponse
    {
        $levels = ['CSEE', 'ACSEE'];

        $data = $request->validate([
            'level' => ['required', Rule::in($levels)],
            'index_no' => ['required', 'regex:/^[SP]\d{4}\/\d{4}\/\d{4}$/'],
        ]);

        $level = $data['level'];
        $index = strtoupper($data['index_no']);

        if (! preg_match('/^[SP]?\d/', $index)) {
            return response()->json(['message' => 'Index number format is invalid.'], 422);
        }

        $year = intval(substr($index, -4));

        return response()->json([
            'verified' => true,
            'mock' => true,
            'level' => $level,
            'index_no' => $index,
            'candidate_name' => $this->candidateName($request->user()),
            'school_name' => $this->schoolFor($index),
            'division' => $this->divisionFor($index),
            'points' => $this->pointsFor($index),
            'year_completed' => $year,
        ]);
    }

    private function candidateName($user): string
    {
        if (! $user) {
            return 'CANDIDATE';
        }

        return trim(implode(' ', array_filter([
            $user->first_name,
            $user->middle_name,
            $user->last_name,
        ])));
    }

    private function schoolFor(string $index): string
    {
        $schools = [
            'Uyole Secondary School',
            'Mbeya Secondary School',
            'Songwe Secondary School',
            'Ibanda Secondary School',
            'Mbalizi Secondary School',
            'Sangu Secondary School',
            'Kyela Secondary School',
            'Sikonge Secondary School',
            'Chunya Secondary School',
            'Vwawa Secondary School',
            'Tunduma Secondary School',
            'Mlowo Secondary School',
            'Igurusi Secondary School',
            'Utengule Secondary School',
            'Mbozi Secondary School',
            'Ilomba Secondary School',
            'Isyesye Secondary School',
            'Iringa Secondary School',
            'Dodoma Secondary School',
            'Msalato Secondary School',
        ];

        return $schools[crc32($index) % count($schools)];
    }

    private function divisionFor(string $index): string
    {
        return ['I', 'II', 'III', 'IV'][crc32($index . ':d') % 4];
    }

    private function pointsFor(string $index): int
    {
        return 9 + (crc32($index . ':p') % 32);
    }
}