<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('name');
            $table->enum('type', ['text', 'email', 'select', 'textarea', 'number', 'date'])->default('text');
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default fields
        DB::table('form_fields')->insert([
            ['label' => 'Full Name', 'name' => 'name', 'type' => 'text', 'is_required' => true, 'order' => 1, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Email Address', 'name' => 'email', 'type' => 'email', 'is_required' => true, 'order' => 2, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Organization/Institution', 'name' => 'organization', 'type' => 'text', 'is_required' => false, 'order' => 3, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
