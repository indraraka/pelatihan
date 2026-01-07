import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Index({ categories }) {
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <DashboardLayout title="Kategori Pelatihan">
            <Head title="Kategori Pelatihan" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Kategori Pelatihan</h2>
                    <p className="text-slate-500">Kelola kategori untuk pelatihan</p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kategori
                </Link>
            </div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div
                                className="h-3"
                                style={{ backgroundColor: category.color || '#6366f1' }}
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl">{category.icon || '📁'}</span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {category.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-sm text-slate-500">
                                        {category.trainings_count || 0} Pelatihan
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Kategori</h3>
                    <p className="text-slate-600 mb-6">Buat kategori pertama untuk mengelompokkan pelatihan</p>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Tambah Kategori
                    </Link>
                </div>
            )}
        </DashboardLayout>
    );
}
