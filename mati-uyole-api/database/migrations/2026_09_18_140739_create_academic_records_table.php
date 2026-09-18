<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('qualification_type', ['CSEE', 'NVA_III', 'NTA_DIPLOMA', 'OTHER'])->default('CSEE');
            $table->string('index_no_primary');
            $table->string('index_no_secondary')->nullable();
            $table->string('division')->nullable();
            $table->unsignedSmallInteger('points')->nullable();
            $table->year('year_completed')->nullable();
            $table->string('secondary_school_name')->nullable();
            $table->string('country')->default('Tanzania');
            $table->string('primary_school_name')->nullable();
            $table->string('primary_school_district')->nullable();
            $table->string('primary_school_region')->nullable();
            $table->string('avn_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_records');
    }
};
