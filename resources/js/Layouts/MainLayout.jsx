import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { auth, app } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3">
                                {app.logo ? (
                                    <img src={`/storage/${app.logo}`} alt="Logo" className="h-8 w-auto" />
                                ) : (
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">TM</span>
                                    </div>
                                )}
                                <span className="font-bold text-xl gradient-text">{app.name}</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#trainings" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                Pelatihan
                            </a>
                            <a href="#articles" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                Artikel
                            </a>
                            <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                FAQ
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-bold">TM</span>
                                </div>
                                <span className="font-bold text-2xl">{app.name}</span>
                            </div>
                            <p className="text-gray-400 max-w-md">
                                {app.footerDescription || 'Menyediakan solusi manajemen pelatihan yang komprehensif untuk organisasi Anda.'}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link></li>
                                <li><a href="#trainings" className="text-gray-400 hover:text-white transition-colors">Pelatihan</a></li>
                                <li><a href="#articles" className="text-gray-400 hover:text-white transition-colors">Artikel</a></li>
                                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-4">Akun</h4>
                            <ul className="space-y-2">
                                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Masuk</Link></li>
                                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Daftar</Link></li>
                                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
                        <p>{app.footerContent || `© ${new Date().getFullYear()} ${app.name}. Hak cipta dilindungi.`}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
