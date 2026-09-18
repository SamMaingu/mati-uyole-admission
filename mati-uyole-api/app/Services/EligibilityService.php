<?php

namespace App\Services;

use App\Models\ApplicantProfile;
use App\Models\Programme;

class EligibilityService
{
    public function eligibleLevels(?ApplicantProfile $profile): array
    {
        $levels = [];

        foreach ([4, 5, 6] as $level) {
            if ($this->fitsLevel($profile, $level)) {
                $levels[] = $level;
            }
        }

        return $levels;
    }

    public function assess(?Programme $programme, ?ApplicantProfile $profile): array
    {
        $fits = $programme !== null && $this->fitsLevel($profile, $programme->nta_level);

        return [
            'eligible' => $fits,
            'reason' => $fits
                ? 'You meet the basic requirements for this programme.'
                : 'Based on the information provided, you do not meet the basic entry requirements.',
        ];
    }

    private function fitsLevel(?ApplicantProfile $profile, ?int $level): bool
    {
        $quals = $profile?->academicQualifications;
        if (! $quals || $quals->isEmpty()) {
            return false;
        }

        $rank = fn ($division) => match ($division) {
            'I' => 1, 'II' => 2, 'III' => 3, 'IV' => 4, '0' => 5, default => 99,
        };

        $best = $quals
            ->filter(fn ($q) => $q->division !== null)
            ->sortBy(fn ($q) => $rank($q->division))
            ->first();

        $has = fn ($l) => $quals->contains('level', $l);

        return match ($level) {
            4 => $best !== null,
            5 => $has('CSEE') || $has('NVA_III'),
            6 => $has('NTA_DIPLOMA') || ($best !== null && in_array($best->division, ['I', 'II', 'III'])),
            default => false,
        };
    }
}