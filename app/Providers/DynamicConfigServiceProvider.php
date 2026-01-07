<?php

namespace App\Providers;

use App\Services\SettingsService;
use Illuminate\Support\ServiceProvider;

class DynamicConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(SettingsService $settingsService): void
    {
        // Apply Google OAuth settings from database
        $settingsService->applyGoogleSettings();
        
        // Apply SMTP settings from database
        $settingsService->applySmtpSettings();
    }
}
