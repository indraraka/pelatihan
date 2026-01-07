<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Updates the site settings for SAPU LIDI
     * (Strategi Aparatur Pemerintahan yang Unggul melalui Literasi Digital)
     * by Diskominfo Kab. Indramayu
     */
    public function run(): void
    {
        // Site Name
        Setting::set('site_name', 'Sapu Lidi', 'general');
        
        // Introduction Text (displayed below banner on homepage)
        Setting::set('introduction_text', 
            'SAPU LIDI (Strategi Aparatur Pemerintahan yang Unggul melalui Literasi Digital) adalah program pelatihan literasi digital untuk meningkatkan kompetensi aparatur pemerintah di lingkungan Pemerintah Kabupaten Indramayu dalam menghadapi era transformasi digital.',
            'general'
        );
        
        // Footer Content
        Setting::set('footer_content', 
            '© ' . date('Y') . ' Sapu Lidi - Diskominfo Kab. Indramayu. All rights reserved.',
            'general'
        );

        $this->command->info('Site settings updated for SAPU LIDI - Diskominfo Kab. Indramayu');
    }
}
