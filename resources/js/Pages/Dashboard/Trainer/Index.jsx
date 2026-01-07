import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ stats, upcomingTrainings }) {
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
        <DashboardLayout title="Trainer Dashboard">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-indigo-100 mb-2">Total Trainings</p>
                    <p className="text-4xl font-bold">{stats.totalTrainings}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <p className="text-green-100 mb-2">Published</p>
                    <p className="text-4xl font-bold">{stats.publishedTrainings}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                    <p className="text-blue-100 mb-2">Total Attendances</p>
                    <p className="text-4xl font-bold">{stats.totalAttendances}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-8">
                <Link
                    href="/trainer/trainings/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Training
                </Link>
            </div>

            {/* Upcoming Trainings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Upcoming Trainings</h2>
                </div>

                {upcomingTrainings.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {upcomingTrainings.map((training) => (
                            <div key={training.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">{training.title}</h3>
                                    <p className="text-sm text-slate-500">
                                        {formatDate(training.start_time)} • {formatTime(training.start_time)} - {formatTime(training.end_time)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${training.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {training.status}
                                    </span>
                                    <Link
                                        href={`/trainer/trainings/${training.id}`}
                                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-600 mb-4">No upcoming trainings</p>
                        <Link
                            href="/trainer/trainings/create"
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Create your first training →
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
