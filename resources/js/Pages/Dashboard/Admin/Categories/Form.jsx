import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Form({ category }) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        icon: category?.icon || '📁',
        color: category?.color || '#6366f1',
        is_active: category?.is_active ?? true,
        order: category?.order || 0,
    });

    const iconOptions = ['📁', '💻', '⚖️', '🔒', '🌐', '📚', '🎯', '💡', '🚀', '📊', '🔧', '🎓'];
    const colorOptions = [
        '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899',
        '#6366f1', '#14b8a6', '#f97316', '#84cc16', '#06b6d4', '#a855f7',
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/categories/${category.id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <DashboardLayout title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Informasi Kategori</h2>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nama Kategori *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                placeholder="Masukkan nama kategori"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                                placeholder="Deskripsi singkat tentang kategori..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Ikon
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setData('icon', icon)}
                                        className={`w-12 h-12 text-2xl rounded-xl border-2 flex items-center justify-center transition-all ${data.icon === icon
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Warna
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('color', color)}
                                        className={`w-10 h-10 rounded-xl border-2 transition-all ${data.color === color
                                                ? 'border-slate-800 ring-2 ring-offset-2 ring-slate-400'
                                                : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Order */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Urutan Tampilan
                            </label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            />
                            <p className="mt-1 text-sm text-slate-500">Angka lebih kecil akan ditampilkan lebih dahulu</p>
                        </div>

                        {/* Active */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Kategori Aktif</span>
                            </label>
                            <p className="mt-1 text-sm text-slate-500 ml-8">Kategori aktif akan ditampilkan di halaman publik</p>
                        </div>
                    </div>
                </div>

                {/* Preview & Submit */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-4">Preview</h3>
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                                style={{ backgroundColor: data.color + '20' }}
                            >
                                {data.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">
                                    {data.name || 'Nama Kategori'}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    {data.description || 'Deskripsi kategori...'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/categories')}
                            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Kategori' : 'Simpan Kategori')}
                        </button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
