<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show login page
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login', [
            'recaptchaSiteKey' => Setting::get('recaptcha_site_key'),
            'googleEnabled' => (bool) Setting::get('google_client_id'),
        ]);
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'recaptcha_token' => 'required_if:recaptcha_enabled,true',
        ]);

        // Verify reCAPTCHA
        if (!$this->verifyRecaptcha($request->recaptcha_token)) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        }

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.']);
    }

    /**
     * Show registration page
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register', [
            'recaptchaSiteKey' => Setting::get('recaptcha_site_key'),
            'googleEnabled' => (bool) Setting::get('google_client_id'),
        ]);
    }

    /**
     * Handle registration request
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'recaptcha_token' => 'required_if:recaptcha_enabled,true',
        ]);

        // Verify reCAPTCHA
        if (!$this->verifyRecaptcha($request->recaptcha_token)) {
            return back()->withErrors(['recaptcha' => 'reCAPTCHA verification failed.']);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Verify reCAPTCHA token
     */
    protected function verifyRecaptcha(?string $token): bool
    {
        $secretKey = Setting::get('recaptcha_secret_key');
        
        if (!$secretKey || !$token) {
            return true; // Skip verification if not configured
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $token,
        ]);

        $result = $response->json();
        
        return $result['success'] ?? false;
    }
}
