<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'group'];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
        Cache::forget("setting.{$key}");
    }

    /**
     * Get all settings by group
     */
    public static function getByGroup(string $group): array
    {
        return static::where('group', $group)->pluck('value', 'key')->toArray();
    }

    /**
     * Get the certificate number for current month
     */
    public static function getNextCertificateNumber(): string
    {
        $prefix = static::get('certificate_prefix', 'CERT');
        $counter = json_decode(static::get('certificate_counter', '{}'), true);
        
        $monthKey = now()->format('Y-m');
        $current = ($counter[$monthKey] ?? 0) + 1;
        $counter[$monthKey] = $current;
        
        static::set('certificate_counter', json_encode($counter), 'certificate');
        
        return sprintf(
            '%s/%s/%s/%04d',
            $prefix,
            now()->format('m'),
            now()->format('Y'),
            $current
        );
    }
}
