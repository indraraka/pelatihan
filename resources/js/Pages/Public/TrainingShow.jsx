import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function TrainingShow({ training, isOpen, attendanceUrl }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <MainLayout>
            <Head title={training.title} />

            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Beranda
                </Link>

                {/* Training Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{training.title}</h1>
                        <p className="text-indigo-100">{formatDate(training.start_time)}</p>
                    </div>

                    <div className="p-8">
                        <div className="prose prose-lg max-w-none text-slate-600 mb-8">
                            <p>{training.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Tanggal</p>
                                    <p className="font-semibold text-slate-800">{formatDate(training.start_time)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Waktu</p>
                                    <p className="font-semibold text-slate-800">
                                        {formatTime(training.start_time)} - {formatTime(training.end_time)}
                                    </p>
                                </div>
                            </div>

                            {training.jumlah_jp && (
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Jumlah JP</p>
                                        <p className="font-semibold text-slate-800">{training.jumlah_jp} JP</p>
                                    </div>
                                </div>
                            )}

                            {training.trainer && (
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Narasumber</p>
                                        <p className="font-semibold text-slate-800">{training.trainer.name}</p>
                                    </div>
                                </div>
                            )}

                            {training.certificate_template && (
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Sertifikat</p>
                                        <p className="font-semibold text-slate-800">Tersedia setelah menyelesaikan</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* VB Background Download */}
                        {training.vb_background && (
                            <div className="mb-8 p-4 bg-purple-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Virtual Background</p>
                                            <p className="text-sm text-slate-500">Unduh background untuk Zoom meeting</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`/storage/${training.vb_background}`}
                                        download
                                        target="_blank"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Unduh
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Zoom Meeting Info */}
                        {training.zoom_meeting_url && (
                            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 3.5l4.5-2.25A.5.5 0 0121 4.5v11a.5.5 0 01-.5.5l-4.5-2.25V6.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Zoom Meeting</h3>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Meeting URL</p>
                                        <p className="text-blue-600 font-medium break-all text-sm">
                                            {training.zoom_meeting_url}
                                        </p>
                                    </div>

                                    {training.zoom_passcode && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Passcode</p>
                                            <p className="font-mono text-lg font-bold text-slate-800">
                                                {training.zoom_passcode}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={training.zoom_meeting_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 hover:shadow-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 3.5l4.5-2.25A.5.5 0 0121 4.5v11a.5.5 0 01-.5.5l-4.5-2.25V6.5z" />
                                    </svg>
                                    Gabung Meeting
                                </a>
                            </div>
                        )}

                        {/* Action Button */}
                        {isOpen ? (
                            <Link
                                href={attendanceUrl}
                                className="block w-full text-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                            >
                                Isi Formulir Kehadiran
                            </Link>
                        ) : (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                                <p className="text-amber-700">
                                    Formulir kehadiran belum dibuka. Silakan kembali saat pelatihan berlangsung.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
