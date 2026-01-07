import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export default function Index({ users: paginatedUsers, filters = {} }) {
    // Safety check for users prop
    const users = paginatedUsers || { data: [], links: [], meta: {} };
    // Handle different pagination structures (API resource vs simple paginate)
    const userList = users.data || [];
    const links = users.links || [];
    const from = users.from || 0;
    const to = users.to || 0;
    const total = users.total || 0;

    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [isLoading, setIsLoading] = useState(false);

    // Debounced search to prevent excessive requests
    const debouncedSearch = useCallback(
        debounce((query, roleFilter) => {
            setIsLoading(true);
            router.get(
                route('admin.users.index'),
                { search: query, role: roleFilter },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsLoading(false),
                    replace: true // Prevent history stack buildup
                }
            );
        }, 300),
        []
    );

    // Initial search effect (skip on mount if empty strings)
    useEffect(() => {
        // Only trigger if values are different from initial props (basic check)
        if (search !== (filters.search || '') || role !== (filters.role || '')) {
            debouncedSearch(search, role);
        }
    }, [search, role]);

    const handleDelete = (userId) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('admin.users.destroy', userId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Add toast notification here
                }
            });
        }
    };

    const getRoleBadge = (userRole) => {
        const badges = {
            super_admin: 'bg-purple-100 text-purple-700 border-purple-200 ring-purple-500/30',
            trainer: 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/30',
            user: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/30',
        };
        const defaultBadge = 'bg-gray-100 text-gray-700 border-gray-200';
        return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${badges[userRole] || defaultBadge}`;
    };

    const getRoleLabel = (userRole) => {
        const labels = {
            super_admin: 'Super Admin',
            trainer: 'Trainer',
            user: 'User',
        };
        return labels[userRole] || userRole;
    };

    return (
        <DashboardLayout title="Kelola Pengguna">
            <Head title="Kelola Pengguna" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daftar Pengguna</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Kelola akses dan informasi pengguna dalam sistem.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-3">
                        <Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Pengguna
                        </Link>
                    </div>
                </div>

                {/* Filters & Actions Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6 transition-all duration-300 hover:shadow-lg hover:border-indigo-100">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className={`h-5 w-5 transition-colors duration-200 ${isLoading ? 'text-indigo-500 animate-pulse' : 'text-slate-400 group-hover:text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm sm:leading-6 transition-all duration-200"
                            />
                        </div>

                        <div className="flex w-full sm:w-auto gap-4">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="block w-full sm:w-48 rounded-xl border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm sm:leading-6 transition-all duration-200"
                            >
                                <option value="">Semua Role</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="trainer">Trainer</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengguna</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bergabung</th>
                                    <th scope="col" className="relative px-6 py-4">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {userList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-900">Tidak ada pengguna ditemukan</p>
                                                <p className="mt-1 text-sm text-slate-500">Coba sesuaikan filter pencarian Anda atau tambahkan pengguna baru.</p>
                                                <button
                                                    onClick={() => { setSearch(''); setRole(''); }}
                                                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Reset Filter
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    userList.map((user) => (
                                        <tr key={user.id} className="group hover:bg-slate-50/80 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {user.avatar ? (
                                                            <img className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" src={user.avatar} alt="" />
                                                        ) : (
                                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm text-sm font-bold ring-2 ring-white
                                                                ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-600' :
                                                                    user.role === 'trainer' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    {user.email_verified_at ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                                            <svg className="h-1.5 w-1.5 fill-current" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                                                            <svg className="h-1.5 w-1.5 fill-current" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                                                            Belum Terverifikasi
                                                        </span>
                                                    )}
                                                    {user.google_id && (
                                                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                                            <svg className="h-3 w-3" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                                                            Google
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getRoleBadge(user.role)}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end items-center gap-3">
                                                    <Link
                                                        href={route('admin.users.edit', user.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors p-1 rounded hover:bg-indigo-50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-900 font-medium transition-colors p-1 rounded hover:bg-red-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {links && links.length > 3 && (
                        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <Link
                                    href={links[0].url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${!links[0].url && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    Previous
                                </Link>
                                <Link
                                    href={links[links.length - 1].url || '#'}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ${!links[links.length - 1].url && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    Next
                                </Link>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-700">
                                        Menampilkan <span className="font-medium">{from}</span> sampai <span className="font-medium">{to}</span> dari <span className="font-medium">{total}</span> hasil
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                                        {links.map((link, index) => {
                                            // Clean up HTML entities from Laravel pagination
                                            const label = link.label.replace('&laquo; Previous', '←').replace('Next &raquo;', '→');

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors
                                                        ${index === 0 ? 'rounded-l-lg' : ''} 
                                                        ${index === links.length - 1 ? 'rounded-r-lg' : ''}
                                                        ${link.active
                                                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                            : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'}
                                                        ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                                    `}
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
