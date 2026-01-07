<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->foreignId('certificate_template_id')->nullable()->constrained('certificate_templates')->onDelete('set null');
            $table->json('attendance_open_config')->nullable();
            $table->string('zoom_meeting_id')->nullable();
            $table->string('zoom_meeting_url')->nullable();
            $table->string('zoom_passcode')->nullable();
            $table->string('zoom_start_url')->nullable();
            $table->string('material_path')->nullable();
            $table->string('material_original_name')->nullable();
            $table->enum('status', ['draft', 'published', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
