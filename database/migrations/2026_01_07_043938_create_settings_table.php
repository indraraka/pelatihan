<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'site_name', 'value' => 'Training Management', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_logo', 'value' => null, 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'footer_content', 'value' => '© 2026 Training Management. All rights reserved.', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            
            // Google OAuth
            ['key' => 'google_client_id', 'value' => null, 'group' => 'auth', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'google_client_secret', 'value' => null, 'group' => 'auth', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'google_redirect_uri', 'value' => null, 'group' => 'auth', 'created_at' => now(), 'updated_at' => now()],
            
            // reCAPTCHA
            ['key' => 'recaptcha_site_key', 'value' => null, 'group' => 'auth', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'recaptcha_secret_key', 'value' => null, 'group' => 'auth', 'created_at' => now(), 'updated_at' => now()],
            
            // Zoom
            ['key' => 'zoom_account_id', 'value' => null, 'group' => 'zoom', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'zoom_client_id', 'value' => null, 'group' => 'zoom', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'zoom_client_secret', 'value' => null, 'group' => 'zoom', 'created_at' => now(), 'updated_at' => now()],
            
            // SMTP
            ['key' => 'smtp_host', 'value' => null, 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_port', 'value' => '587', 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_username', 'value' => null, 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_password', 'value' => null, 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_encryption', 'value' => 'tls', 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_from_address', 'value' => null, 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'smtp_from_name', 'value' => 'Training Management', 'group' => 'smtp', 'created_at' => now(), 'updated_at' => now()],
            
            // Certificate
            ['key' => 'certificate_prefix', 'value' => 'CERT', 'group' => 'certificate', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'certificate_counter', 'value' => '{}', 'group' => 'certificate', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
