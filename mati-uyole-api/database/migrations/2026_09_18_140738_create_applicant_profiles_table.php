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
        Schema::create('applicant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth');
            $table->string('place_of_birth')->nullable();
            $table->enum('marital_status', ['single', 'married', 'other'])->default('single');
            $table->string('citizenship')->default('Tanzanian');
            $table->string('citizenship_other')->nullable();
            $table->string('region')->nullable();
            $table->string('district')->nullable();
            $table->string('city_town')->nullable();
            $table->string('present_address')->nullable();
            $table->string('postal_box')->nullable();
            $table->boolean('has_disability')->default(false);
            $table->text('disability_details')->nullable();
            $table->string('passport_photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_profiles');
    }
};
