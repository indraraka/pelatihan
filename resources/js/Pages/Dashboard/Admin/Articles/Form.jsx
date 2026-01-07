import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Form({ article }) {
    const isEdit = !!article;

    const { data, setData, post, processing, errors } = useForm({
        title: article?.title || '',
        content: article?.content || '',
        excerpt: article?.excerpt || '',
        featured_image: null,
        is_published: article?.is_published ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/articles/${article.id}`, {
                _method: 'PUT',
                forceFormData: true,
            });
        } else {
            post('/admin/articles', {
                forceFormData: true,
            });
        }
    };

    return (
        <DashboardLayout title={isEdit ? 'Edit Article' : 'Create Article'}>
            <Head title={isEdit ? 'Edit Article' : 'Create Article'} />

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Article Details</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt (Short Description)</label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Content *</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={10}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                                required
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Featured Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('featured_image', e.target.files[0])}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            />
                            {article?.featured_image && (
                                <p className="mt-2 text-sm text-slate-500">Current: {article.featured_image}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                            />
                            <label htmlFor="is_published" className="text-sm text-slate-700">Publish article</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/articles')}
                        className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
