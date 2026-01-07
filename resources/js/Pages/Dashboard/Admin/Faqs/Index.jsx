import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Index({ faqs }) {
    const [showForm, setShowForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        question: '',
        answer: '',
        is_active: true,
        order: 0,
    });

    const openCreate = () => {
        reset();
        setEditingFaq(null);
        setShowForm(true);
    };

    const openEdit = (faq) => {
        setData({
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
            order: faq.order || 0,
        });
        setEditingFaq(faq);
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFaq) {
            post(`/admin/faqs/${editingFaq.id}`, {
                _method: 'PUT',
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        } else {
            post('/admin/faqs', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    return (
        <DashboardLayout title="FAQs">
            <Head title="FAQs" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
                    <p className="text-slate-500">Manage FAQ section on the homepage</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add FAQ
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {faqs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 mb-2">{faq.question}</h3>
                                        <p className="text-slate-600 text-sm">{faq.answer}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {faq.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => openEdit(faq)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this FAQ?')) {
                                                    router.delete(`/admin/faqs/${faq.id}`);
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-slate-500">No FAQs yet</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-800">
                                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Question *</label>
                                <input
                                    type="text"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Answer *</label>
                                <textarea
                                    value={data.answer}
                                    onChange={(e) => setData('answer', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                                    />
                                    <span className="text-sm text-slate-700">Active</span>
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData('order', e.target.value)}
                                        className="w-20 px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
