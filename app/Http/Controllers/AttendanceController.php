<?php

namespace App\Http\Controllers;

use App\Mail\CertificateMail;
use App\Models\Attendance;
use App\Models\FormField;
use App\Models\Setting;
use App\Models\Training;
use App\Services\CertificateService;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function __construct(
        protected CertificateService $certificateService,
        protected SettingsService $settingsService
    ) {}

    /**
     * Show attendance form
     */
    public function form(Training $training)
    {
        if ($training->status !== 'published') {
            abort(404);
        }

        $isOpen = $training->isAttendanceOpen();

        return Inertia::render('Attendance/Form', [
            'training' => $training->only('id', 'title', 'description', 'start_time', 'end_time'),
            'formFields' => FormField::active()->get(),
            'isOpen' => $isOpen,
            'recaptchaSiteKey' => Setting::get('recaptcha_site_key'),
            'siteName' => Setting::get('site_name', 'Training Management'),
        ]);
    }

    /**
     * Submit attendance form
     */
    public function submit(Request $request, Training $training)
    {
        if ($training->status !== 'published' || !$training->isAttendanceOpen()) {
            return back()->withErrors(['form' => 'Attendance form is not available at this time.']);
        }

        // Build validation rules from form fields
        $formFields = FormField::active()->get();
        $rules = [];
        
        foreach ($formFields as $field) {
            $fieldRules = [];
            if ($field->is_required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }
            
            if ($field->type === 'email') {
                $fieldRules[] = 'email';
            }
            
            $rules[$field->name] = implode('|', $fieldRules);
        }

        // Add recaptcha validation
        $rules['recaptcha_token'] = 'required';

        $validated = $request->validate($rules);

        // Verify reCAPTCHA
        if (!$this->verifyRecaptcha($request->recaptcha_token)) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        }

        // Check for duplicate attendance
        $existingAttendance = Attendance::where('training_id', $training->id)
            ->where('email', $validated['email'] ?? $request->email)
            ->first();

        if ($existingAttendance) {
            return back()->withErrors(['email' => 'You have already registered for this training.']);
        }

        // Create attendance record
        $attendance = Attendance::create([
            'training_id' => $training->id,
            'user_id' => Auth::id(),
            'name' => $validated['name'] ?? 'Guest',
            'email' => $validated['email'] ?? '',
            'organization' => $validated['organization'] ?? null,
            'attended_at' => now(),
            'form_data' => $validated,
        ]);

        // Generate certificate
        $certificatePath = $this->certificateService->generate($attendance);

        // Send email with certificate
        if ($certificatePath && $attendance->email) {
            $this->settingsService->applySmtpSettings();
            
            try {
                Mail::to($attendance->email)->send(new CertificateMail($attendance));
            } catch (\Exception $e) {
                // Log error but don't fail the request
                \Log::error('Failed to send certificate email: ' . $e->getMessage());
            }
        }

        return Inertia::render('Attendance/Success', [
            'attendance' => $attendance->load('training:id,title'),
            'hasCertificate' => (bool) $certificatePath,
            'siteName' => Setting::get('site_name', 'Training Management'),
        ]);
    }

    /**
     * Download certificate
     */
    public function downloadCertificate(Attendance $attendance)
    {
        if (!$attendance->certificate_path || !Storage::exists($attendance->certificate_path)) {
            abort(404, 'Certificate not found.');
        }

        return Storage::download(
            $attendance->certificate_path,
            'Certificate-' . str_replace('/', '-', $attendance->certificate_number) . '.pdf'
        );
    }

    /**
     * Verify reCAPTCHA token
     */
    protected function verifyRecaptcha(?string $token): bool
    {
        $secretKey = Setting::get('recaptcha_secret_key');
        
        if (!$secretKey || !$token) {
            return true;
        }

        $response = \Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
        ]);

        return $response->json()['success'] ?? false;
    }
}
