<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Kecakapan Digital',
                'slug' => 'kecakapan-digital',
                'description' => 'Pelatihan untuk meningkatkan kemampuan digital dan teknologi informasi',
                'icon' => '💻',
                'color' => '#3b82f6',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Etika Digital',
                'slug' => 'etika-digital',
                'description' => 'Pelatihan tentang etika dan tata krama dalam dunia digital',
                'icon' => '⚖️',
                'color' => '#8b5cf6',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Keamanan Digital',
                'slug' => 'keamanan-digital',
                'description' => 'Pelatihan tentang keamanan siber dan perlindungan data',
                'icon' => '🔒',
                'color' => '#ef4444',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Budaya Digital',
                'slug' => 'budaya-digital',
                'description' => 'Pelatihan tentang budaya dan literasi digital',
                'icon' => '🌐',
                'color' => '#10b981',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
