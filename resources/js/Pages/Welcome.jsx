import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState, useEffect } from 'react';

export default function Welcome({ banners, upcomingTrainings, ongoingTrainings, articles, faqs, introductionText, categories }) {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentBanner((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

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
            <Head title="Beranda" />

            {/* Hero/Banner Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />

                {/* Banner Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    {banners.length > 0 ? (
                        <div className="text-center animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                {banners[currentBanner].title}
                            </h1>
                            {banners[currentBanner].subtitle && (
                                <p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-3xl mx-auto">
                                    {banners[currentBanner].subtitle}
                                </p>
                            )}
                            {banners[currentBanner].button_text && banners[currentBanner].link && (
                                <a
                                    href={banners[currentBanner].link}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
                                >
                                    {banners[currentBanner].button_text}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}

                            {/* Banner Indicators */}
                            {banners.length > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    {banners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentBanner(index)}
                                            className={`h-2 rounded-full transition-all ${index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                Tingkatkan Kompetensi Anda
                            </h1>
                            <p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-3xl mx-auto">
                                Bergabunglah dengan program pelatihan komprehensif kami untuk mengembangkan kemampuan Anda
                            </p>
                            <a
                                href="#trainings"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all"
                            >
                                Lihat Pelatihan
                            </a>
                        </div>
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
            </section>

            {/* Introduction Section */}
            {introductionText && (
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                                {introductionText}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {categories && categories.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                                Kategori Pelatihan
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Pilih Bidang Kompetensi
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <a
                                    key={category.id}
                                    href={`#trainings`}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-indigo-200"
                                >
                                    <div
                                        className="h-2"
                                        style={{ backgroundColor: category.color || '#6366f1' }}
                                    />
                                    <div className="p-6 text-center">
                                        <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                                            {category.icon || '📁'}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                                                {category.description}
                                            </p>
                                        )}
                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                            {category.trainings_count || 0} Pelatihan
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Ongoing Trainings (Live Now) */}
            {ongoingTrainings.length > 0 && (
                <section className="py-12 bg-gradient-to-r from-green-500 to-emerald-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <h2 className="text-2xl font-bold text-white">Sedang Berlangsung</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoingTrainings.map((training) => (
                                <div key={training.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold text-white mb-2">{training.title}</h3>
                                    <p className="text-green-100 mb-4">
                                        {formatTime(training.start_time)} - {formatTime(training.end_time)}
                                    </p>
                                    {training.zoom_meeting_url && (
                                        <a
                                            href={training.zoom_meeting_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-full font-semibold hover:shadow-lg transition-all"
                                        >
                                            Gabung Meeting
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Upcoming Trainings */}
            <section id="trainings" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                            Jadwal Pelatihan
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                            Pelatihan Mendatang
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Jangan lewatkan kesempatan untuk mengikuti program pelatihan kami
                        </p>
                    </div>

                    {upcomingTrainings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingTrainings.map((training, index) => (
                                <div
                                    key={training.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-card"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className="h-2"
                                        style={{ backgroundColor: training.category?.color || '#6366f1' }}
                                    />
                                    <div className="p-6">
                                        {training.category && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg">{training.category.icon}</span>
                                                <span
                                                    className="text-xs font-medium px-2 py-1 rounded-full"
                                                    style={{
                                                        backgroundColor: (training.category.color || '#6366f1') + '20',
                                                        color: training.category.color || '#6366f1'
                                                    }}
                                                >
                                                    {training.category.name}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-indigo-600 mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(training.start_time)}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                                            {training.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 line-clamp-2">
                                            {training.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTime(training.start_time)} - {formatTime(training.end_time)}
                                            </div>
                                            <Link
                                                href={`/training/${training.id}`}
                                                className="text-indigo-600 font-medium hover:text-indigo-700"
                                            >
                                                Selengkapnya →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Pelatihan</h3>
                            <p className="text-slate-600">Pantau terus untuk informasi pelatihan terbaru!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Articles Section */}
            <section id="articles" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                            Informasi Terbaru
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                            Artikel & Sumber Daya
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Tetap update dengan informasi terbaru dari kami
                        </p>
                    </div>

                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/article/${article.slug}`}
                                    className="group hover-card"
                                >
                                    <div className="bg-slate-100 rounded-2xl overflow-hidden">
                                        {article.featured_image ? (
                                            <img
                                                src={`/storage/${article.featured_image}`}
                                                alt={article.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="text-slate-600 text-sm line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl">
                            <p className="text-slate-600">Belum ada artikel yang tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-gradient-to-br from-slate-100 to-indigo-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
                            Ada Pertanyaan?
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                    </div>

                    {faqs.length > 0 ? (
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-semibold text-slate-800">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-indigo-600 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-5 text-slate-600 animate-fade-in">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl">
                            <p className="text-slate-600">Belum ada FAQ yang tersedia.</p>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
