<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyDynamicConfig
{
    public function __construct(
        protected SettingsService $settingsService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Apply Google OAuth settings from database
        $this->settingsService->applyGoogleSettings();
        
        // Apply SMTP settings from database
        $this->settingsService->applySmtpSettings();
        
        return $next($request);
    }
}
