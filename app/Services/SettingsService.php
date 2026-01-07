<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;

class SettingsService
{
    /**
     * Apply SMTP settings from database to mail config
     */
    public function applySmtpSettings(): void
    {
        $smtpHost = Setting::get('smtp_host');
        
        if ($smtpHost) {
            Config::set('mail.mailers.smtp.host', $smtpHost);
            Config::set('mail.mailers.smtp.port', Setting::get('smtp_port', 587));
            Config::set('mail.mailers.smtp.username', Setting::get('smtp_username'));
            Config::set('mail.mailers.smtp.password', Setting::get('smtp_password'));
            Config::set('mail.mailers.smtp.encryption', Setting::get('smtp_encryption', 'tls'));
            Config::set('mail.from.address', Setting::get('smtp_from_address'));
            Config::set('mail.from.name', Setting::get('smtp_from_name', 'Training Management'));
        }
    }

    /**
     * Apply Google OAuth settings
     */
    public function applyGoogleSettings(): void
    {
        $clientId = Setting::get('google_client_id');
        
        if ($clientId) {
            Config::set('services.google.client_id', $clientId);
            Config::set('services.google.client_secret', Setting::get('google_client_secret'));
            Config::set('services.google.redirect', Setting::get('google_redirect_uri'));
        }
    }

    /**
     * Get all settings for admin panel
     */
    public function getAllSettings(): array
    {
        return [
            'general' => Setting::getByGroup('general'),
            'auth' => Setting::getByGroup('auth'),
            'zoom' => Setting::getByGroup('zoom'),
            'smtp' => Setting::getByGroup('smtp'),
            'certificate' => Setting::getByGroup('certificate'),
        ];
    }

    /**
     * Update settings by group
     */
    public function updateSettings(string $group, array $settings): void
    {
        foreach ($settings as $key => $value) {
            Setting::set($key, $value, $group);
        }
    }

    /**
     * Test SMTP connection
     */
    public function testSmtpConnection(): array
    {
        $this->applySmtpSettings();
        
        try {
            $transport = new \Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport(
                Setting::get('smtp_host'),
                (int) Setting::get('smtp_port', 587),
                Setting::get('smtp_encryption') === 'tls'
            );
            
            $transport->setUsername(Setting::get('smtp_username'));
            $transport->setPassword(Setting::get('smtp_password'));
            
            // This will throw an exception if connection fails
            $transport->start();
            $transport->stop();
            
            return ['success' => true, 'message' => 'SMTP connection successful'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
