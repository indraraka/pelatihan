import { Head, Link } from '@inertiajs/react';

export default function Success({ attendance, hasCertificate, siteName }) {
    return (
        <>
            <Head title="Attendance Submitted" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-lg w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-slate-800 mb-4">
                            Attendance Submitted!
                        </h1>

                        <p className="text-slate-600 mb-8">
                            Thank you, <span className="font-semibold text-slate-800">{attendance.name}</span>!
                            Your attendance for <span className="font-semibold text-indigo-600">{attendance.training.title}</span> has been recorded successfully.
                        </p>

                        {hasCertificate && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-slate-800">Your Certificate is Ready!</h3>
                                </div>
                                <p className="text-slate-600 mb-4 text-sm">
                                    Certificate Number: <span className="font-mono font-semibold">{attendance.certificate_number}</span>
                                </p>
                                <a
                                    href={`/certificate/${attendance.id}/download`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Certificate
                                </a>
                                <p className="text-slate-500 text-sm mt-4">
                                    A copy has also been sent to your email address.
                                </p>
                            </div>
                        )}

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>

                    <p className="text-center text-slate-500 text-sm mt-8">
                        Powered by {siteName}
                    </p>
                </div>
            </div>
        </>
    );
}
