import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function DashboardLayout({ children, title }) {
    const { auth, app, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = {
        super_admin: [
            { name: 'Dashboard', href: '/dashboard', icon: '📊' },
            { name: 'Pengaturan', href: '/admin/settings', icon: '⚙️' },
            { name: 'Banner', href: '/admin/banners', icon: '🖼️' },
            { name: 'Artikel', href: '/admin/articles', icon: '📝' },
            { name: 'FAQ', href: '/admin/faqs', icon: '❓' },
            { name: 'Sertifikat', href: '/admin/certificates', icon: '📜' },
            { name: 'Form Fields', href: '/admin/form-fields', icon: '📋' },
            { name: 'Kategori', href: '/admin/categories', icon: '🏷️' },
            { name: 'Pelatihan', href: '/trainer/trainings', icon: '🎓' },
        ],
        trainer: [
            { name: 'Dashboard', href: '/dashboard', icon: '📊' },
            { name: 'Pelatihan Saya', href: '/trainer/trainings', icon: '🎓' },
        ],
        user: [
            { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        ],
    };

    const userNav = navigation[auth.user?.role] || navigation.user;

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">TM</span>
                    </div>
                    <span className="font-bold text-lg text-white">{app.name}</span>
                </div>

                <nav className="px-4 py-6 space-y-1">
                    {userNav.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${window.location.pathname === item.href
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                        <span>🏠</span>
                        <span className="font-medium">Kembali ke Beranda</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h1 className="text-xl font-semibold text-slate-800">{title}</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {auth.user?.avatar ? (
                                <img src={auth.user.avatar} alt="" className="h-8 w-8 rounded-full" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium text-sm">
                                        {auth.user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-slate-700">{auth.user?.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{auth.user?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.post('/logout')}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Flash Messages */}
                {(flash.success || flash.error) && (
                    <div className="px-6 py-4">
                        {flash.success && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {flash.error}
                            </div>
                        )}
                    </div>
                )}

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
