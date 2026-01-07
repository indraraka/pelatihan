import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Form({ training, formFields, isOpen, recaptchaSiteKey, siteName }) {
    const { data, setData, post, processing, errors } = useForm(
        formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), { recaptcha_token: '' })
    );

    const recaptchaLoaded = useRef(false);

    useEffect(() => {
        if (recaptchaSiteKey && !recaptchaLoaded.current) {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
            script.async = true;
            document.body.appendChild(script);
            recaptchaLoaded.current = true;
        }
    }, [recaptchaSiteKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let token = '';
        if (recaptchaSiteKey && window.grecaptcha) {
            token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'attendance' });
        }

        post(`/attendance/${training.id}`, {
            transform: (formData) => ({
                ...formData,
                recaptcha_token: token,
            }),
        });
    };

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
        <>
            <Head title={`Kehadiran - ${training.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Formulir Kehadiran
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{training.title}</h1>
                        <p className="text-slate-600">
                            {formatDate(training.start_time)} • {formatTime(training.start_time)} - {formatTime(training.end_time)}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {!isOpen ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Formulir Kehadiran Belum Tersedia</h2>
                                <p className="text-slate-600 max-w-md mx-auto">
                                    Formulir kehadiran untuk pelatihan ini belum dibuka. Silakan cek kembali pada waktu yang telah ditentukan.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="p-8 space-y-6">
                                    {formFields.map((field) => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                {field.label}
                                                {field.is_required && <span className="text-red-500 ml-1">*</span>}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={data[field.name] || ''}
                                                    onChange={(e) => setData(field.name, e.target.value)}
                                                    required={field.is_required}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    value={data[field.name] || ''}
                                                    onChange={(e) => setData(field.name, e.target.value)}
                                                    required={field.is_required}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                                >
                                                    <option value="">Pilih opsi</option>
                                                    {field.options?.map((option, idx) => (
                                                        <option key={idx} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    value={data[field.name] || ''}
                                                    onChange={(e) => setData(field.name, e.target.value)}
                                                    required={field.is_required}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                                />
                                            )}

                                            {errors[field.name] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                                            )}
                                        </div>
                                    ))}

                                    {errors.recaptcha && (
                                        <p className="text-sm text-red-600">{errors.recaptcha}</p>
                                    )}
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                    {errors.form && (
                                        <p className="text-sm text-red-600">{errors.form}</p>
                                    )}
                                </div>

                                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Kehadiran'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-8">
                        Dibuat dengan ❤️ oleh {siteName}
                    </p>
                </div>
            </div>
        </>
    );
}
