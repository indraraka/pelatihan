import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ attendances }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <DashboardLayout title="My Trainings">
            <Head title="Dashboard" />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">My Attended Trainings</h2>
                    <p className="text-slate-500 text-sm">View your training history and download certificates</p>
                </div>

                {attendances.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {attendances.map((attendance) => (
                            <div key={attendance.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 mb-1">
                                            {attendance.training?.title}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Attended on {formatDate(attendance.attended_at)}
                                        </p>
                                        {attendance.certificate_number && (
                                            <p className="text-sm text-indigo-600 font-mono mt-1">
                                                Certificate: {attendance.certificate_number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {attendance.certificate_path && (
                                            <a
                                                href={`/certificate/${attendance.id}/download`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Certificate
                                            </a>
                                        )}

                                        {attendance.training?.material_path && (
                                            <a
                                                href={`/trainer/trainings/${attendance.training.id}/material/download`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Material
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Trainings Yet</h3>
                        <p className="text-slate-600 mb-6">
                            You haven't attended any trainings yet. Browse available trainings to get started!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Browse Trainings
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
