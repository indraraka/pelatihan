import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ stats, recentTrainings }) {
    return (
        <DashboardLayout title="Admin Dashboard">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                    color="indigo"
                />
                <StatCard
                    title="Trainers"
                    value={stats.totalTrainers}
                    icon="🎓"
                    color="purple"
                />
                <StatCard
                    title="Trainings"
                    value={stats.totalTrainings}
                    icon="📚"
                    color="blue"
                />
                <StatCard
                    title="Attendances"
                    value={stats.totalAttendances}
                    icon="✅"
                    color="green"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <span className="text-2xl">⚙️</span>
                            <span className="font-medium">Settings</span>
                        </Link>
                        <Link
                            href="/admin/certificates"
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <span className="text-2xl">📜</span>
                            <span className="font-medium">Certificates</span>
                        </Link>
                        <Link
                            href="/admin/banners"
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <span className="text-2xl">🖼️</span>
                            <span className="font-medium">Banners</span>
                        </Link>
                        <Link
                            href="/trainer/trainings/create"
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <span className="text-2xl">➕</span>
                            <span className="font-medium">New Training</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Trainings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Trainings</h2>
                    {recentTrainings.length > 0 ? (
                        <div className="space-y-3">
                            {recentTrainings.map((training) => (
                                <div key={training.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-800">{training.title}</p>
                                        <p className="text-sm text-slate-500">by {training.trainer?.name}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${training.status === 'published' ? 'bg-green-100 text-green-700' :
                                            training.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {training.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No trainings yet</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600',
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover-card">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
            <p className="text-slate-500">{title}</p>
        </div>
    );
}
