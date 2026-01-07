<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Training extends Model
{
    protected $fillable = [
        'trainer_id',
        'category_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'certificate_template_id',
        'attendance_open_config',
        'zoom_meeting_id',
        'zoom_meeting_url',
        'zoom_passcode',
        'zoom_start_url',
        'material_path',
        'material_original_name',
        'vb_background',
        'jumlah_jp',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'attendance_open_config' => 'array',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function certificateTemplate(): BelongsTo
    {
        return $this->belongsTo(CertificateTemplate::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Check if the training is currently live
     */
    public function isLive(): bool
    {
        $now = Carbon::now();
        return $this->status === 'published' 
            && $now->between($this->start_time, $this->end_time);
    }

    /**
     * Check if the training is upcoming
     */
    public function isUpcoming(): bool
    {
        return $this->status === 'published' 
            && $this->start_time->isFuture();
    }

    /**
     * Check if attendance form is open
     */
    public function isAttendanceOpen(): bool
    {
        if ($this->status !== 'published') {
            return false;
        }

        $config = $this->attendance_open_config ?? ['type' => 'from_start'];
        $now = Carbon::now();

        switch ($config['type'] ?? 'from_start') {
            case 'from_start':
                return $now->gte($this->start_time) && $now->lte($this->end_time);
            
            case 'before_end':
                $minutesBefore = $config['minutes_before_end'] ?? 30;
                $openTime = $this->end_time->copy()->subMinutes($minutesBefore);
                return $now->gte($openTime) && $now->lte($this->end_time);
            
            case 'custom':
                $customStart = Carbon::parse($config['custom_start'] ?? $this->start_time);
                $customEnd = Carbon::parse($config['custom_end'] ?? $this->end_time);
                return $now->between($customStart, $customEnd);
            
            default:
                return $now->between($this->start_time, $this->end_time);
        }
    }

    /**
     * Scope for published trainings
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for upcoming trainings
     */
    public function scopeUpcoming($query)
    {
        return $query->published()
            ->where('start_time', '>', now())
            ->orderBy('start_time', 'asc');
    }

    /**
     * Scope for ongoing trainings
     */
    public function scopeOngoing($query)
    {
        return $query->published()
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now());
    }

    /**
     * Get the attendance form URL
     */
    public function getAttendanceUrl(): string
    {
        return route('attendance.form', $this->id);
    }
}
