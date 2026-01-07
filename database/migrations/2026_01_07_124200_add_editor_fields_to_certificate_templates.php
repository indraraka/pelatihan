<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificate_templates', function (Blueprint $table) {
            $table->enum('template_type', ['html', 'image'])->default('html')->after('name');
            $table->json('text_elements')->nullable()->after('html_template');
            $table->json('editor_config')->nullable()->after('text_elements');
        });
    }

    public function down(): void
    {
        Schema::table('certificate_templates', function (Blueprint $table) {
            $table->dropColumn(['template_type', 'text_elements', 'editor_config']);
        });
    }
};
