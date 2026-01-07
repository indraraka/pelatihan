import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Index({ certificates }) {
    const [deleteModal, setDeleteModal] = useState(null);

    const handleDelete = () => {
        if (deleteModal) {
            router.delete(`/admin/certificates/${deleteModal.id}`, {
                onSuccess: () => setDeleteModal(null),
            });
        }
    };

    return (
        <DashboardLayout title="Certificate Templates">
            <Head title="Certificate Templates" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Certificate Templates</h1>
                    <p className="text-slate-600 mt-1">Manage certificate designs for trainings</p>
                </div>
                <Link
                    href="/admin/certificates/create"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-300/50 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Template
                </Link>
            </div>

            {/* Templates Grid */}
            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                        >
                            {/* Preview Card */}
                            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                {template.background_image ? (
                                    <img
                                        src={`/storage/${template.background_image}`}
                                        alt={template.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                            <p className="text-sm text-slate-400">HTML Template</p>
                                        </div>
                                    </div>
                                )}

                                {/* Preview Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <a
                                        href={`/admin/certificates/${template.id}/preview`}
                                        target="_blank"
                                        className="px-4 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                                    >
                                        Preview Certificate
                                    </a>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {template.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.template_type === 'image'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {template.template_type === 'image' ? '🖼️ Image' : '📝 HTML'}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <h3 className="font-semibold text-slate-800 mb-2">{template.name}</h3>

                                {template.signer_name && (
                                    <p className="text-sm text-slate-500 mb-4">
                                        Signed by: {template.signer_name}
                                    </p>
                                )}

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/certificates/${template.id}/edit`}
                                        className="flex-1 px-4 py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal(template)}
                                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Templates Yet</h3>
                    <p className="text-slate-600 mb-6">Create your first certificate template to get started</p>
                    <Link
                        href="/admin/certificates/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Create Template
                    </Link>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Template?</h3>
                            <p className="text-slate-600">
                                Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
