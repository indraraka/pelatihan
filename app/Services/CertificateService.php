<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\CertificateTemplate;
use App\Models\Setting;
use App\Models\Training;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class CertificateService
{
    /**
     * Generate a certificate for an attendance record
     */
    public function generate(Attendance $attendance): ?string
    {
        $training = $attendance->training;
        
        // Check if training has a certificate template
        if (!$training->certificate_template_id) {
            return null;
        }

        $template = $training->certificateTemplate;
        if (!$template) {
            return null;
        }

        // Generate certificate number
        $certificateNumber = Setting::getNextCertificateNumber();
        
        // Prepare data for the certificate
        $data = [
            'name' => $attendance->name,
            'email' => $attendance->email,
            'organization' => $attendance->organization ?? '',
            'certificate_number' => $certificateNumber,
            'training_title' => $training->title,
            'training_date' => $training->start_time->format('d F Y'),
            'training_duration' => $training->start_time->format('H:i') . ' - ' . $training->end_time->format('H:i'),
            'issue_date' => now()->format('d F Y'),
        ];

        // Render the template (uses template_type to choose correct rendering)
        $html = $template->render($data);

        // For HTML templates, wrap with background if exists
        // (Image templates already include background in renderImageTemplate)
        if ($template->template_type === 'html' && $template->background_image) {
            $backgroundUrl = Storage::url($template->background_image);
            $html = $this->wrapWithBackground($html, $backgroundUrl);
        }

        // Add signature image if exists (for HTML templates that use this placeholder)
        if ($template->signature_image) {
            $signatureUrl = Storage::url($template->signature_image);
            $html = str_replace('{{signature_image}}', "<img src='{$signatureUrl}' style='max-height: 80px;'>", $html);
        } else {
            $html = str_replace('{{signature_image}}', '', $html);
        }

        // Generate PDF
        $pdf = Pdf::loadHTML($html)
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ]);

        // Save to storage
        $filename = "certificates/{$training->id}/{$certificateNumber}.pdf";
        $filename = str_replace('/', '_', $filename);
        $path = "certificates/{$filename}";
        
        Storage::put($path, $pdf->output());

        // Update attendance record
        $attendance->update([
            'certificate_number' => $certificateNumber,
            'certificate_path' => $path,
        ]);

        return $path;
    }

    /**
     * Wrap HTML with background image styling
     */
    protected function wrapWithBackground(string $html, string $backgroundUrl): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @page {
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                    background-image: url('{$backgroundUrl}');
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    width: 100%;
                    height: 100%;
                }
                .certificate-content {
                    padding: 50px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="certificate-content">
                {$html}
            </div>
        </body>
        </html>
        HTML;
    }

    /**
     * Get certificate PDF content
     */
    public function download(Attendance $attendance): ?string
    {
        if (!$attendance->certificate_path || !Storage::exists($attendance->certificate_path)) {
            return null;
        }

        return Storage::get($attendance->certificate_path);
    }

    /**
     * Create a default certificate template
     */
    public function createDefaultTemplate(): CertificateTemplate
    {
        return CertificateTemplate::create([
            'name' => 'Default Certificate',
            'html_template' => $this->getDefaultTemplateHtml(),
            'signer_name' => 'Administrator',
            'signer_title' => 'Training Manager',
            'is_active' => true,
        ]);
    }

    /**
     * Get default template HTML
     */
    protected function getDefaultTemplateHtml(): string
    {
        return <<<HTML
        <div style="text-align: center; font-family: 'Times New Roman', serif;">
            <h1 style="font-size: 36px; color: #1a365d; margin-bottom: 10px;">CERTIFICATE OF ATTENDANCE</h1>
            <p style="font-size: 18px; color: #4a5568; margin: 20px 0;">This is to certify that</p>
            <h2 style="font-size: 32px; color: #2d3748; border-bottom: 2px solid #3182ce; display: inline-block; padding: 10px 40px;">{{name}}</h2>
            <p style="font-size: 16px; color: #4a5568; margin: 15px 0;">from <strong>{{organization}}</strong></p>
            <p style="font-size: 18px; color: #4a5568; margin: 20px 0;">has successfully attended the training</p>
            <h3 style="font-size: 24px; color: #2d3748; margin: 20px 0;">{{training_title}}</h3>
            <p style="font-size: 16px; color: #4a5568;">held on <strong>{{training_date}}</strong></p>
            <p style="font-size: 14px; color: #718096;">Duration: {{training_duration}}</p>
            <div style="margin-top: 60px;">
                {{signature_image}}
                <p style="font-size: 16px; color: #2d3748; margin: 5px 0; border-top: 1px solid #000; display: inline-block; padding-top: 5px; min-width: 200px;">{{signer_name}}</p>
                <p style="font-size: 14px; color: #718096;">{{signer_title}}</p>
            </div>
            <p style="font-size: 12px; color: #a0aec0; margin-top: 30px;">Certificate No: {{certificate_number}}</p>
            <p style="font-size: 12px; color: #a0aec0;">Issued on: {{issue_date}}</p>
        </div>
        HTML;
    }
}
