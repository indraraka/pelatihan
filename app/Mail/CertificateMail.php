<?php

namespace App\Mail;

use App\Models\Attendance;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CertificateMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Attendance $attendance
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Training Certificate - ' . $this->attendance->training->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.certificate',
            with: [
                'attendance' => $this->attendance,
                'training' => $this->attendance->training,
            ],
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        
        if ($this->attendance->certificate_path && Storage::exists($this->attendance->certificate_path)) {
            $attachments[] = Attachment::fromStorage($this->attendance->certificate_path)
                ->as('Certificate-' . $this->attendance->certificate_number . '.pdf')
                ->withMime('application/pdf');
        }

        return $attachments;
    }
}
