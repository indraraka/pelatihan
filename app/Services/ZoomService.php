<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ZoomService
{
    protected ?string $accessToken = null;

    /**
     * Get OAuth access token from Zoom
     */
    protected function getAccessToken(): ?string
    {
        if ($this->accessToken) {
            return $this->accessToken;
        }

        // Try cache first
        $cached = Cache::get('zoom_access_token');
        if ($cached) {
            $this->accessToken = $cached;
            return $cached;
        }

        $accountId = Setting::get('zoom_account_id');
        $clientId = Setting::get('zoom_client_id');
        $clientSecret = Setting::get('zoom_client_secret');

        if (!$accountId || !$clientId || !$clientSecret) {
            return null;
        }

        $response = Http::withBasicAuth($clientId, $clientSecret)
            ->asForm()
            ->post('https://zoom.us/oauth/token', [
                'grant_type' => 'account_credentials',
                'account_id' => $accountId,
            ]);

        if ($response->successful()) {
            $data = $response->json();
            $this->accessToken = $data['access_token'];
            
            // Cache for slightly less than the expiry time
            $expiresIn = ($data['expires_in'] ?? 3600) - 60;
            Cache::put('zoom_access_token', $this->accessToken, $expiresIn);
            
            return $this->accessToken;
        }

        Log::error('Zoom OAuth token request failed', [
            'status' => $response->status(),
            'body' => $response->json(),
        ]);

        return null;
    }

    /**
     * Create a Zoom meeting
     */
    public function createMeeting(array $data): ?array
    {
        $token = $this->getAccessToken();
        if (!$token) {
            return null;
        }

        $response = Http::withToken($token)
            ->post('https://api.zoom.us/v2/users/me/meetings', [
                'topic' => $data['title'],
                'type' => 2, // Scheduled meeting
                'start_time' => $data['start_time']->toIso8601String(),
                'duration' => $data['start_time']->diffInMinutes($data['end_time']),
                'timezone' => config('app.timezone'),
                'agenda' => $data['description'] ?? '',
                'settings' => [
                    'host_video' => true,
                    'participant_video' => true,
                    'join_before_host' => false,
                    'mute_upon_entry' => true,
                    'watermark' => false,
                    'audio' => 'both',
                    'auto_recording' => 'none',
                ],
            ]);

        if ($response->successful()) {
            $meeting = $response->json();
            return [
                'meeting_id' => (string) $meeting['id'],
                'join_url' => $meeting['join_url'],
                'start_url' => $meeting['start_url'],
                'passcode' => $meeting['password'] ?? '',
            ];
        }

        Log::error('Zoom meeting creation failed', [
            'status' => $response->status(),
            'body' => $response->json(),
        ]);

        return null;
    }

    /**
     * Update an existing Zoom meeting
     */
    public function updateMeeting(string $meetingId, array $data): bool
    {
        $token = $this->getAccessToken();
        if (!$token) {
            return false;
        }

        $payload = [];
        
        if (isset($data['title'])) {
            $payload['topic'] = $data['title'];
        }
        
        if (isset($data['start_time']) && isset($data['end_time'])) {
            $payload['start_time'] = $data['start_time']->toIso8601String();
            $payload['duration'] = $data['start_time']->diffInMinutes($data['end_time']);
        }
        
        if (isset($data['description'])) {
            $payload['agenda'] = $data['description'];
        }

        $response = Http::withToken($token)
            ->patch("https://api.zoom.us/v2/meetings/{$meetingId}", $payload);

        return $response->successful();
    }

    /**
     * Get meeting details
     */
    public function getMeeting(string $meetingId): ?array
    {
        $token = $this->getAccessToken();
        if (!$token) {
            return null;
        }

        $response = Http::withToken($token)
            ->get("https://api.zoom.us/v2/meetings/{$meetingId}");

        if ($response->successful()) {
            $meeting = $response->json();
            return [
                'meeting_id' => (string) $meeting['id'],
                'join_url' => $meeting['join_url'],
                'start_url' => $meeting['start_url'],
                'passcode' => $meeting['password'] ?? '',
                'status' => $meeting['status'],
            ];
        }

        return null;
    }

    /**
     * Delete a Zoom meeting
     */
    public function deleteMeeting(string $meetingId): bool
    {
        $token = $this->getAccessToken();
        if (!$token) {
            return false;
        }

        $response = Http::withToken($token)
            ->delete("https://api.zoom.us/v2/meetings/{$meetingId}");

        return $response->successful();
    }

    /**
     * Check if Zoom is configured
     */
    public function isConfigured(): bool
    {
        return Setting::get('zoom_account_id') 
            && Setting::get('zoom_client_id') 
            && Setting::get('zoom_client_secret');
    }
}
