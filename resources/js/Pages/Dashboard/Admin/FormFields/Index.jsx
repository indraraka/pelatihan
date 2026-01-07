import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Index({ formFields }) {
    const [showForm, setShowForm] = useState(false);
    const [editingField, setEditingField] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        label: '',
        type: 'text',
        options: '',
        is_required: true,
        is_active: true,
        order: 0,
    });

    const fieldTypes = [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'tel', label: 'Phone' },
        { value: 'number', label: 'Number' },
        { value: 'textarea', label: 'Text Area' },
        { value: 'select', label: 'Dropdown' },
    ];

    const openCreate = () => {
        reset();
        setEditingField(null);
        setShowForm(true);
    };

    const openEdit = (field) => {
        setData({
            name: field.name,
            label: field.label,
            type: field.type,
            options: field.options ? field.options.join(', ') : '',
            is_required: field.is_required,
            is_active: field.is_active,
            order: field.order || 0,
        });
        setEditingField(field);
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            ...data,
            options: data.options ? data.options.split(',').map(o => o.trim()) : [],
        };

        if (editingField) {
            router.put(`/admin/form-fields/${editingField.id}`, formData, {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        } else {
            router.post('/admin/form-fields', formData, {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    return (
        <DashboardLayout title="Form Fields">
            <Head title="Form Fields" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Attendance Form Fields</h2>
                    <p className="text-slate-500">Configure fields for the attendance form</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Field
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Order</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Label</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Required</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {formFields.map((field) => (
                            <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500">{field.order}</td>
                                <td className="px-6 py-4 font-mono text-sm text-slate-800">{field.name}</td>
                                <td className="px-6 py-4 text-slate-800">{field.label}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm capitalize">
                                        {field.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {field.is_required ? (
                                        <span className="text-green-600">Yes</span>
                                    ) : (
                                        <span className="text-slate-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${field.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {field.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(field)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this field?')) {
                                                    router.delete(`/admin/form-fields/${field.id}`);
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-semibold text-slate-800">
                                {editingField ? 'Edit Field' : 'Add Field'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Field Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                                    placeholder="e.g., organization"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-mono"
                                    required
                                />
                                <p className="mt-1 text-xs text-slate-500">Lowercase, no spaces (used as database field)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Label *</label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="e.g., Organization Name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                >
                                    {fieldTypes.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            {data.type === 'select' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
                                    <input
                                        type="text"
                                        value={data.options}
                                        onChange={(e) => setData('options', e.target.value)}
                                        placeholder="Option 1, Option 2, Option 3"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Comma-separated values</p>
                                </div>
                            )}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_required}
                                        onChange={(e) => setData('is_required', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                                    />
                                    <span className="text-sm text-slate-700">Required</span>
                                </label>
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
