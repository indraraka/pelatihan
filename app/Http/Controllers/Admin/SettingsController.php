<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct(
        protected SettingsService $settingsService
    ) {}

    /**
     * Show settings page
     */
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Settings', [
            'settings' => $this->settingsService->getAllSettings(),
        ]);
    }

    /**
     * Update general settings
     */
    public function updateGeneral(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'introduction_text' => 'nullable|string|max:2000',
            'footer_content' => 'nullable|string',
        ]);

        if ($request->hasFile('site_logo')) {
            $request->validate(['site_logo' => 'image|mimes:png,jpg,jpeg,svg|max:2048']);
            $path = $request->file('site_logo')->store('logos', 'public');
            Setting::set('site_logo', $path, 'general');
        }

        Setting::set('site_name', $request->site_name, 'general');
        Setting::set('introduction_text', $request->introduction_text, 'general');
        Setting::set('footer_content', $request->footer_content, 'general');

        return back()->with('success', 'Pengaturan umum berhasil disimpan.');
    }

    /**
     * Update auth settings (Google, reCAPTCHA)
     */
    public function updateAuth(Request $request)
    {
        $request->validate([
            'google_client_id' => 'nullable|string',
            'google_client_secret' => 'nullable|string',
            'google_redirect_uri' => 'nullable|url',
            'recaptcha_site_key' => 'nullable|string',
            'recaptcha_secret_key' => 'nullable|string',
        ]);

        $this->settingsService->updateSettings('auth', $request->only([
            'google_client_id',
            'google_client_secret',
            'google_redirect_uri',
            'recaptcha_site_key',
            'recaptcha_secret_key',
        ]));

        return back()->with('success', 'Authentication settings updated successfully.');
    }

    /**
     * Update Zoom settings
     */
    public function updateZoom(Request $request)
    {
        $request->validate([
            'zoom_account_id' => 'nullable|string',
            'zoom_client_id' => 'nullable|string',
            'zoom_client_secret' => 'nullable|string',
        ]);

        $this->settingsService->updateSettings('zoom', $request->only([
            'zoom_account_id',
            'zoom_client_id',
            'zoom_client_secret',
        ]));

        return back()->with('success', 'Zoom settings updated successfully.');
    }

    /**
     * Update SMTP settings
     */
    public function updateSmtp(Request $request)
    {
        $request->validate([
            'smtp_host' => 'nullable|string',
            'smtp_port' => 'nullable|integer',
            'smtp_username' => 'nullable|string',
            'smtp_password' => 'nullable|string',
            'smtp_encryption' => 'nullable|in:tls,ssl',
            'smtp_from_address' => 'nullable|email',
            'smtp_from_name' => 'nullable|string',
        ]);

        $this->settingsService->updateSettings('smtp', $request->only([
            'smtp_host',
            'smtp_port',
            'smtp_username',
            'smtp_password',
            'smtp_encryption',
            'smtp_from_address',
            'smtp_from_name',
        ]));

        return back()->with('success', 'SMTP settings updated successfully.');
    }

    /**
     * Test SMTP connection
     */
    public function testSmtp()
    {
        $result = $this->settingsService->testSmtpConnection();
        
        if ($result['success']) {
            return back()->with('success', $result['message']);
        }
        
        return back()->withErrors(['smtp' => $result['message']]);
    }

    /**
     * Update certificate settings
     */
    public function updateCertificate(Request $request)
    {
        $request->validate([
            'certificate_prefix' => 'required|string|max:50',
        ]);

        Setting::set('certificate_prefix', $request->certificate_prefix, 'certificate');

        return back()->with('success', 'Certificate settings updated successfully.');
    }
}
