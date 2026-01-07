<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Training;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show dashboard based on user role
     */
    public function index()
    {
        $user = Auth::user();

        return match ($user->role) {
            'super_admin' => $this->adminDashboard(),
            'trainer' => $this->trainerDashboard(),
            default => $this->userDashboard(),
        };
    }

    /**
     * Admin dashboard
     */
    protected function adminDashboard()
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalTrainers' => User::where('role', 'trainer')->count(),
                'totalTrainings' => Training::count(),
                'totalAttendances' => Attendance::count(),
            ],
            'recentTrainings' => Training::with('trainer:id,name')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * Trainer dashboard
     */
    protected function trainerDashboard()
    {
        $trainerId = Auth::id();

        return Inertia::render('Dashboard/Trainer/Index', [
            'stats' => [
                'totalTrainings' => Training::where('trainer_id', $trainerId)->count(),
                'publishedTrainings' => Training::where('trainer_id', $trainerId)->where('status', 'published')->count(),
                'totalAttendances' => Attendance::whereHas('training', function ($q) use ($trainerId) {
                    $q->where('trainer_id', $trainerId);
                })->count(),
            ],
            'upcomingTrainings' => Training::where('trainer_id', $trainerId)
                ->where('start_time', '>', now())
                ->orderBy('start_time')
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * User dashboard
     */
    protected function userDashboard()
    {
        $userId = Auth::id();

        return Inertia::render('Dashboard/User/Index', [
            'attendances' => Attendance::where('user_id', $userId)
                ->orWhere('email', Auth::user()->email)
                ->with('training:id,title,start_time,end_time,material_path')
                ->orderBy('attended_at', 'desc')
                ->get(),
        ]);
    }
}
