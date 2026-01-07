<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * FAQs based on user flow for attending pelatihan:
     * 1. Visit homepage
     * 2. See ongoing/upcoming trainings
     * 3. Click training to see details
     * 4. Fill attendance form (only available during event time)
     * 5. Receive certificate (generated automatically)
     * 6. Download certificate or receive via email
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Bagaimana cara mengikuti pelatihan?',
                'answer' => 'Untuk mengikuti pelatihan, kunjungi halaman utama website kami dan pilih pelatihan yang ingin Anda ikuti dari daftar "Pelatihan Mendatang" atau "Sedang Berlangsung". Klik pada pelatihan tersebut untuk melihat detail dan mengisi formulir kehadiran.',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Kapan saya bisa mengisi formulir kehadiran?',
                'answer' => 'Formulir kehadiran hanya tersedia saat pelatihan sedang berlangsung. Anda tidak dapat mengisi formulir kehadiran sebelum atau setelah waktu pelatihan berakhir. Pastikan Anda hadir tepat waktu untuk dapat mengisi formulir.',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara mendapatkan sertifikat?',
                'answer' => 'Sertifikat akan otomatis digenerate setelah Anda berhasil mengisi formulir kehadiran. Anda dapat langsung mengunduh sertifikat pada halaman konfirmasi, atau sertifikat juga akan dikirim ke alamat email yang Anda daftarkan.',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah saya perlu login untuk mengikuti pelatihan?',
                'answer' => 'Tidak, Anda tidak perlu login atau membuat akun untuk mengikuti pelatihan. Cukup isi formulir kehadiran dengan nama lengkap, email, dan instansi Anda saat pelatihan berlangsung.',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara bergabung ke meeting Zoom?',
                'answer' => 'Pada halaman detail pelatihan yang sedang berlangsung, Anda akan menemukan informasi Zoom Meeting termasuk link meeting, passcode, dan tombol "Gabung Meeting". Klik tombol tersebut untuk langsung bergabung ke meeting.',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'question' => 'Saya tidak menerima email sertifikat, bagaimana?',
                'answer' => 'Silakan periksa folder Spam atau Junk di email Anda. Jika tetap tidak ditemukan, hubungi penyelenggara pelatihan untuk meminta pengiriman ulang sertifikat ke email Anda.',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah saya bisa mengunduh sertifikat kembali?',
                'answer' => 'Ya, jika Anda memiliki link download sertifikat dari email konfirmasi atau halaman sukses setelah mengisi kehadiran, Anda dapat menggunakan link tersebut untuk mengunduh sertifikat kapan saja.',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'question' => 'Berapa Jam Pelajaran (JP) yang saya dapatkan?',
                'answer' => 'Jumlah JP yang Anda dapatkan tercantum pada detail setiap pelatihan. JP dihitung berdasarkan durasi pelatihan dan akan tertera pada sertifikat yang Anda terima.',
                'order' => 8,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah saya bisa mengikuti pelatihan yang sama lebih dari sekali?',
                'answer' => 'Tidak, sistem hanya mengizinkan satu kehadiran per email untuk setiap pelatihan. Jika Anda sudah terdaftar, Anda tidak dapat mendaftar ulang untuk pelatihan yang sama.',
                'order' => 9,
                'is_active' => true,
            ],
            [
                'question' => 'Apa yang harus saya siapkan sebelum mengikuti pelatihan?',
                'answer' => 'Pastikan Anda memiliki koneksi internet yang stabil, aplikasi Zoom yang sudah terinstall (atau gunakan browser), dan siapkan alamat email aktif untuk menerima sertifikat. Anda juga bisa mengunduh Virtual Background yang disediakan pada halaman detail pelatihan.',
                'order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}
