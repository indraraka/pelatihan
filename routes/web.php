<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CertificateTemplateController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FormFieldController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Trainer\TrainingController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [PublicController::class, 'index'])->name('home');
Route::get('/article/{slug}', [PublicController::class, 'article'])->name('article.show');
Route::get('/training/{training}', [PublicController::class, 'training'])->name('training.show');

// Attendance Routes (Public)
Route::get('/attendance/{training}', [AttendanceController::class, 'form'])->name('attendance.form');
Route::post('/attendance/{training}', [AttendanceController::class, 'submit'])->name('attendance.submit');
Route::get('/certificate/{attendance}/download', [AttendanceController::class, 'downloadCertificate'])->name('certificate.download');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
    // Google OAuth
    Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Super Admin Routes
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
        Route::post('/settings/general', [SettingsController::class, 'updateGeneral'])->name('settings.general');
        Route::post('/settings/auth', [SettingsController::class, 'updateAuth'])->name('settings.auth');
        Route::post('/settings/zoom', [SettingsController::class, 'updateZoom'])->name('settings.zoom');
        Route::post('/settings/smtp', [SettingsController::class, 'updateSmtp'])->name('settings.smtp');
        Route::post('/settings/smtp/test', [SettingsController::class, 'testSmtp'])->name('settings.smtp.test');
        Route::post('/settings/certificate', [SettingsController::class, 'updateCertificate'])->name('settings.certificate');
        
        // Banners
        Route::resource('banners', BannerController::class);
        
        // Articles
        Route::resource('articles', ArticleController::class);
        
        // FAQs
        Route::resource('faqs', FaqController::class);
        
        // Certificate Templates
        Route::resource('certificates', CertificateTemplateController::class);
        Route::get('/certificates/{certificate}/preview', [CertificateTemplateController::class, 'preview'])->name('certificates.preview');
        
        // Form Fields
        Route::resource('form-fields', FormFieldController::class);
        
        // Categories
        Route::resource('categories', CategoryController::class);
        
        // Users
        
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    });

    // Trainer Routes
    Route::middleware('role:super_admin,trainer')->prefix('trainer')->name('trainer.')->group(function () {
        Route::resource('trainings', TrainingController::class);
        Route::post('/trainings/{training}/zoom/create', [TrainingController::class, 'createZoomMeeting'])->name('trainings.zoom.create');
        Route::post('/trainings/{training}/zoom/update', [TrainingController::class, 'updateZoomMeeting'])->name('trainings.zoom.update');
        Route::get('/trainings/{training}/zoom/start', [TrainingController::class, 'startZoomMeeting'])->name('trainings.zoom.start');
        Route::get('/trainings/{training}/material/download', [TrainingController::class, 'downloadMaterial'])->name('trainings.material.download');
    });
});
