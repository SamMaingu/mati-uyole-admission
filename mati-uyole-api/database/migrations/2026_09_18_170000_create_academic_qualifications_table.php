<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->cascadeOnDelete();
            $table->enum('level', ['CSEE', 'ACSEE', 'NVA_III', 'NTA_DIPLOMA', 'OTHER'])->default('CSEE');
            $table->string('index_no')->nullable();
            $table->string('candidate_name')->nullable();
            $table->string('school_name')->nullable();
            $table->string('division')->nullable();
            $table->unsignedSmallInteger('points')->nullable();
            $table->unsignedSmallInteger('year_completed')->nullable();
            $table->string('avn_number')->nullable();
            $table->boolean('confirmed')->default(false);
            $table->timestamps();
        });

        $rows = DB::table('academic_records')->get();

        foreach ($rows as $row) {
            if (! empty($row->index_no_primary)) {
                DB::table('academic_qualifications')->insert([
                    'applicant_profile_id' => $row->applicant_profile_id,
                    'level' => $row->qualification_type,
                    'index_no' => $row->index_no_primary,
                    'school_name' => $row->secondary_school_name,
                    'division' => $row->division,
                    'points' => $row->points,
                    'year_completed' => $row->year_completed,
                    'avn_number' => $row->avn_number,
                    'confirmed' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if (! empty($row->index_no_secondary)) {
                DB::table('academic_qualifications')->insert([
                    'applicant_profile_id' => $row->applicant_profile_id,
                    'level' => 'ACSEE',
                    'index_no' => $row->index_no_secondary,
                    'school_name' => $row->secondary_school_name,
                    'division' => $row->division,
                    'points' => $row->points,
                    'year_completed' => $row->year_completed,
                    'confirmed' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_qualifications');
    }
};