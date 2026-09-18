<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Programme;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(TanzaniaDataSeeder::class);
        $year = AcademicYear::firstOrCreate(
            ['label' => '2026/2027'],
            [
                'is_active' => true,
                'application_window_start' => '2026-10-01',
                'application_window_end' => '2027-03-31',
            ],
        );

        $programmes = [
            ['name' => 'Basic Technician Certificate in Agriculture Production', 'nta_level' => 4],
            ['name' => 'Technician Certificate in Agriculture Production', 'nta_level' => 5],
            ['name' => 'Ordinary Diploma in Agriculture Production', 'nta_level' => 6],
        ];

        foreach ($programmes as $i => $p) {
            Programme::firstOrCreate(
                ['academic_year_id' => $year->id, 'name' => $p['name']],
                array_merge($p, [
                    'description' => null,
                    'capacity' => 60,
                    'status' => 'open',
                    'entry_requirements_text' => $this->requirementText($p['nta_level']),
                ]),
            );
        }

        User::firstOrCreate(
            ['phone' => '0754000001'],
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => 'password',
                'role' => User::ROLE_SUPER_ADMIN,
            ],
        );

        User::firstOrCreate(
            ['phone' => '0754000002'],
            [
                'first_name' => 'Admission',
                'last_name' => 'Officer',
                'password' => 'password',
                'role' => User::ROLE_ADMISSION_OFFICER,
            ],
        );

        User::firstOrCreate(
            ['phone' => '0754000003'],
            [
                'first_name' => 'Finance',
                'last_name' => 'Officer',
                'password' => 'password',
                'role' => User::ROLE_FINANCE_OFFICER,
            ],
        );

        User::firstOrCreate(
            ['phone' => '0754000004'],
            [
                'first_name' => 'Approving',
                'last_name' => 'Authority',
                'password' => 'password',
                'role' => User::ROLE_APPROVING_AUTHORITY,
            ],
        );
    }

    private function requirementText(int $level): string
    {
        return match ($level) {
            4 => 'CSEE with at least 4 passes of D, two of which are science subjects, and two passes in non-religious subjects. OR NVA Level III (or equivalent) in an agriculture course with at least 2 D passes in CSEE.',
            5 => 'NTA Level 4 in Agriculture Production, OR ACSEE with Agriculture Science as a principal pass and at least one other subsidiary pass.',
            6 => 'NTA Level 5 in Agriculture Production, plus NTA Level 5 in General Agriculture (two separate certificates) OR equivalent.',
            default => '',
        };
    }
}