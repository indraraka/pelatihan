import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ trainings }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <DashboardLayout title="My Trainings">
            <Head title="My Trainings" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Trainings</h2>
                    <p className="text-slate-500">Manage your training events</p>
                </div>
                <Link
                    href="/trainer/trainings/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Training
                </Link>
            </div>

            {/* Training List */}
            {trainings.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Training</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date & Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">JP</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Certificate</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Attendees</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {trainings.map((training) => (
                                <tr key={training.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-800">{training.title}</p>
                                            {training.zoom_meeting_url && (
                                                <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M4 4h10v10h-10z" />
                                                    </svg>
                                                    Zoom
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-800">{formatDate(training.start_time)}</p>
                                        <p className="text-sm text-slate-500">
                                            {formatTime(training.start_time)} - {formatTime(training.end_time)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {training.jumlah_jp ? (
                                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                                {training.jumlah_jp} JP
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {training.certificate_template ? (
                                            <span className="text-green-600 text-sm">{training.certificate_template.name}</span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">No certificate</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-semibold text-sm">
                                            {training.attendances_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${training.status === 'published' ? 'bg-green-100 text-green-700' :
                                            training.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {training.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/trainer/trainings/${training.id}`}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={`/trainer/trainings/${training.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Trainings Yet</h3>
                    <p className="text-slate-600 mb-6">Create your first training to get started</p>
                    <Link
                        href="/trainer/trainings/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Create Training
                    </Link>
                </div>
            )}
        </DashboardLayout>
    );
}
