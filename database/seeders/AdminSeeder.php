<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\CertificateService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        User::updateOrCreate(
            ['email' => 'admin@training.local'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@training.local',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        // Create sample Trainer
        User::updateOrCreate(
            ['email' => 'trainer@training.local'],
            [
                'name' => 'Sample Trainer',
                'email' => 'trainer@training.local',
                'password' => Hash::make('password'),
                'role' => 'trainer',
                'email_verified_at' => now(),
            ]
        );

        // Create sample User
        User::updateOrCreate(
            ['email' => 'user@training.local'],
            [
                'name' => 'Sample User',
                'email' => 'user@training.local',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // Create default certificate template
        $certificateService = new CertificateService();
        $certificateService->createDefaultTemplate();

        $this->command->info('Admin seeder completed!');
        $this->command->info('Super Admin: admin@training.local / password');
        $this->command->info('Trainer: trainer@training.local / password');
        $this->command->info('User: user@training.local / password');
    }
}
