<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->string('vb_background')->nullable()->after('material_path'); // Virtual Background image
            $table->integer('jumlah_jp')->nullable()->after('vb_background'); // Jam Pelajaran (Learning Hours)
        });
    }

    public function down(): void
    {
        Schema::table('trainings', function (Blueprint $table) {
            $table->dropColumn(['vb_background', 'jumlah_jp']);
        });
    }
};
