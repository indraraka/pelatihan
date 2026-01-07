import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Settings({ settings }) {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Umum', icon: '🏠' },
        { id: 'auth', label: 'Autentikasi', icon: '🔐' },
        { id: 'zoom', label: 'Zoom', icon: '📹' },
        { id: 'smtp', label: 'Email (SMTP)', icon: '✉️' },
        { id: 'certificate', label: 'Sertifikat', icon: '📜' },
    ];

    return (
        <DashboardLayout title="Pengaturan">
            <Head title="Pengaturan" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'general' && <GeneralSettings settings={settings.general} />}
                    {activeTab === 'auth' && <AuthSettings settings={settings.auth} />}
                    {activeTab === 'zoom' && <ZoomSettings settings={settings.zoom} />}
                    {activeTab === 'smtp' && <SmtpSettings settings={settings.smtp} />}
                    {activeTab === 'certificate' && <CertificateSettings settings={settings.certificate} />}
                </div>
            </div>
        </DashboardLayout>
    );
}

function GeneralSettings({ settings }) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name || '',
        introduction_text: settings.introduction_text || '',
        footer_description: settings.footer_description || '',
        footer_content: settings.footer_content || '',
        site_logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/general', {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Pengaturan Umum</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Situs</label>
                    <input
                        type="text"
                        value={data.site_name}
                        onChange={(e) => setData('site_name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Logo Situs</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('site_logo', e.target.files[0])}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Teks Pengantar</label>
                    <textarea
                        value={data.introduction_text}
                        onChange={(e) => setData('introduction_text', e.target.value)}
                        rows={4}
                        placeholder="Teks yang ditampilkan di bawah banner pada halaman utama..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                    />
                    <p className="mt-1 text-sm text-slate-500">Teks ini akan ditampilkan di bawah banner pada halaman utama</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Footer</label>
                    <textarea
                        value={data.footer_description}
                        onChange={(e) => setData('footer_description', e.target.value)}
                        rows={2}
                        placeholder="Deskripsi singkat yang ditampilkan di footer sebelah kiri..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                    />
                    <p className="mt-1 text-sm text-slate-500">Teks ini ditampilkan di footer di bawah nama situs</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Konten Footer (Copyright)</label>
                    <textarea
                        value={data.footer_content}
                        onChange={(e) => setData('footer_content', e.target.value)}
                        rows={2}
                        placeholder="© 2026 Nama Situs. All rights reserved."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                    />
                    <p className="mt-1 text-sm text-slate-500">Teks copyright di bagian bawah footer</p>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}

function AuthSettings({ settings }) {
    const { data, setData, post, processing } = useForm({
        google_client_id: settings.google_client_id || '',
        google_client_secret: settings.google_client_secret || '',
        google_redirect_uri: settings.google_redirect_uri || '',
        recaptcha_site_key: settings.recaptcha_site_key || '',
        recaptcha_secret_key: settings.recaptcha_secret_key || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/auth');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Authentication Settings</h2>

            <div className="space-y-8">
                {/* Google OAuth */}
                <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google OAuth
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client ID</label>
                            <input
                                type="text"
                                value={data.google_client_id}
                                onChange={(e) => setData('google_client_id', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Client Secret</label>
                            <input
                                type="password"
                                value={data.google_client_secret}
                                onChange={(e) => setData('google_client_secret', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Redirect URI</label>
                            <input
                                type="url"
                                value={data.google_redirect_uri}
                                onChange={(e) => setData('google_redirect_uri', e.target.value)}
                                placeholder="https://yourdomain.com/auth/google/callback"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* reCAPTCHA */}
                <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-4">reCAPTCHA v3</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Site Key</label>
                            <input
                                type="text"
                                value={data.recaptcha_site_key}
                                onChange={(e) => setData('recaptcha_site_key', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Secret Key</label>
                            <input
                                type="password"
                                value={data.recaptcha_secret_key}
                                onChange={(e) => setData('recaptcha_secret_key', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

function ZoomSettings({ settings }) {
    const { data, setData, post, processing } = useForm({
        zoom_account_id: settings.zoom_account_id || '',
        zoom_client_id: settings.zoom_client_id || '',
        zoom_client_secret: settings.zoom_client_secret || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/zoom');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Zoom Integration</h2>
            <p className="text-slate-500 text-sm mb-6">
                Configure Server-to-Server OAuth credentials from{' '}
                <a href="https://marketplace.zoom.us/" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">
                    Zoom Marketplace
                </a>
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account ID</label>
                    <input
                        type="text"
                        value={data.zoom_account_id}
                        onChange={(e) => setData('zoom_account_id', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client ID</label>
                    <input
                        type="text"
                        value={data.zoom_client_id}
                        onChange={(e) => setData('zoom_client_id', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client Secret</label>
                    <input
                        type="password"
                        value={data.zoom_client_secret}
                        onChange={(e) => setData('zoom_client_secret', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

function SmtpSettings({ settings }) {
    const { data, setData, post, processing } = useForm({
        smtp_host: settings.smtp_host || '',
        smtp_port: settings.smtp_port || '587',
        smtp_username: settings.smtp_username || '',
        smtp_password: settings.smtp_password || '',
        smtp_encryption: settings.smtp_encryption || 'tls',
        smtp_from_address: settings.smtp_from_address || '',
        smtp_from_name: settings.smtp_from_name || '',
    });

    const [testing, setTesting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/smtp');
    };

    const handleTest = () => {
        setTesting(true);
        router.post('/admin/settings/smtp/test', {}, {
            onFinish: () => setTesting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Email (SMTP) Settings</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
                        <input
                            type="text"
                            value={data.smtp_host}
                            onChange={(e) => setData('smtp_host', e.target.value)}
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                        <input
                            type="number"
                            value={data.smtp_port}
                            onChange={(e) => setData('smtp_port', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={data.smtp_username}
                        onChange={(e) => setData('smtp_username', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={data.smtp_password}
                        onChange={(e) => setData('smtp_password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Encryption</label>
                    <select
                        value={data.smtp_encryption}
                        onChange={(e) => setData('smtp_encryption', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">From Address</label>
                        <input
                            type="email"
                            value={data.smtp_from_address}
                            onChange={(e) => setData('smtp_from_address', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">From Name</label>
                        <input
                            type="text"
                            value={data.smtp_from_name}
                            onChange={(e) => setData('smtp_from_name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        disabled={testing}
                        onClick={handleTest}
                        className="px-6 py-3 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all disabled:opacity-50"
                    >
                        {testing ? 'Testing...' : '🔌 Test Connection'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function CertificateSettings({ settings }) {
    const { data, setData, post, processing } = useForm({
        certificate_prefix: settings.certificate_prefix || 'CERT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/certificate');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Certificate Settings</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Number Prefix</label>
                    <input
                        type="text"
                        value={data.certificate_prefix}
                        onChange={(e) => setData('certificate_prefix', e.target.value)}
                        placeholder="e.g., DISKOMINFO"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                        Certificate numbers will be: <span className="font-mono">{data.certificate_prefix}/MM/YYYY/0001</span>
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
