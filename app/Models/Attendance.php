<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'training_id',
        'user_id',
        'name',
        'email',
        'organization',
        'certificate_number',
        'certificate_path',
        'attended_at',
        'form_data',
    ];

    protected $casts = [
        'attended_at' => 'datetime',
        'form_data' => 'array',
    ];

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if certificate exists
     */
    public function hasCertificate(): bool
    {
        return !empty($this->certificate_number) && !empty($this->certificate_path);
    }

    /**
     * Get certificate download URL
     */
    public function getCertificateUrl(): ?string
    {
        if (!$this->hasCertificate()) {
            return null;
        }
        
        return route('certificate.download', $this->id);
    }
}
