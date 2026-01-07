import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

export default function Form({ training, certificateTemplates, categories, zoomConfigured, attendanceOptions }) {
    const isEdit = !!training;
    const [showCustomTime, setShowCustomTime] = useState(training?.attendance_open_config?.type === 'custom');
    const [vbPreview, setVbPreview] = useState(training?.vb_background ? `/storage/${training.vb_background}` : null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: training?.title || '',
        description: training?.description || '',
        category_id: training?.category_id || '',
        start_time: training?.start_time ? new Date(training.start_time).toISOString().slice(0, 16) : '',
        end_time: training?.end_time ? new Date(training.end_time).toISOString().slice(0, 16) : '',
        certificate_template_id: training?.certificate_template_id || '',
        attendance_open_type: training?.attendance_open_config?.type || 'from_start',
        attendance_minutes_before_end: training?.attendance_open_config?.minutes_before_end || 30,
        attendance_custom_start: training?.attendance_open_config?.custom_start || '',
        attendance_custom_end: training?.attendance_open_config?.custom_end || '',
        status: training?.status || 'draft',
        zoom_meeting_url: training?.zoom_meeting_url || '',
        zoom_passcode: training?.zoom_passcode || '',
        material: null,
        vb_background: null,
        jumlah_jp: training?.jumlah_jp || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/trainer/trainings/${training.id}`, {
                _method: 'PUT',
                forceFormData: true,
            });
        } else {
            post('/trainer/trainings', {
                forceFormData: true,
            });
        }
    };

    const handleAttendanceTypeChange = (type) => {
        setData('attendance_open_type', type);
        setShowCustomTime(type === 'custom');
    };

    const handleVbUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('vb_background', file);
            setVbPreview(URL.createObjectURL(file));
        }
    };

    return (
        <DashboardLayout title={isEdit ? 'Edit Training' : 'Create Training'}>
            <Head title={isEdit ? 'Edit Training' : 'Create Training'} />

            <form onSubmit={handleSubmit} className="max-w-4xl">
                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Informasi Pelatihan</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Judul Pelatihan *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                placeholder="Enter training title"
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                                placeholder="Describe the training..."
                                required
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Category */}
                        {categories && categories.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setData('category_id', cat.id)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${data.category_id == cat.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <span className="text-2xl mb-2 block">{cat.icon || '📁'}</span>
                                            <span className="font-medium text-slate-800 text-sm">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    required
                                />
                                {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">End Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    required
                                />
                                {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
                            </div>
                        </div>

                        {/* Jumlah JP */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Jumlah JP (Jam Pelajaran)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={data.jumlah_jp}
                                    onChange={(e) => setData('jumlah_jp', e.target.value)}
                                    min="1"
                                    max="100"
                                    className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    placeholder="0"
                                />
                                <span className="text-slate-500">JP</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">Total learning hours for this training (optional)</p>
                            {errors.jumlah_jp && <p className="mt-1 text-sm text-red-600">{errors.jumlah_jp}</p>}
                        </div>
                    </div>
                </div>

                {/* Virtual Background */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">
                        Virtual Background
                        <span className="text-sm font-normal text-slate-500 ml-2">for Zoom Meeting</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload VB Image (JPG/PNG)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleVbUpload}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            />
                            <p className="mt-1 text-sm text-slate-500">Recommended: 1920×1080px, max 10MB</p>
                            {errors.vb_background && <p className="mt-1 text-sm text-red-600">{errors.vb_background}</p>}
                        </div>

                        <div>
                            {vbPreview ? (
                                <div className="relative">
                                    <img
                                        src={vbPreview}
                                        alt="VB Preview"
                                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVbPreview(null);
                                            setData('vb_background', null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                                    <div className="text-center text-slate-400">
                                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm">No VB uploaded</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Certificate */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Certificate</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Template</label>
                        <select
                            value={data.certificate_template_id}
                            onChange={(e) => setData('certificate_template_id', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        >
                            <option value="">No Certificate</option>
                            {certificateTemplates.map((template) => (
                                <option key={template.id} value={template.id}>{template.name}</option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-slate-500">Leave empty if you don't want to issue certificates for this training</p>
                    </div>
                </div>

                {/* Attendance Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Attendance Form Settings</h2>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">When can attendees fill the form?</label>

                        {attendanceOptions.map((option) => (
                            <label key={option.value} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                <input
                                    type="radio"
                                    name="attendance_type"
                                    value={option.value}
                                    checked={data.attendance_open_type === option.value}
                                    onChange={() => handleAttendanceTypeChange(option.value)}
                                    className="mt-1"
                                />
                                <span className="text-slate-700">{option.label}</span>
                            </label>
                        ))}

                        {data.attendance_open_type === 'before_end' && (
                            <div className="ml-7 p-4 bg-indigo-50 rounded-xl">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Minutes before event ends</label>
                                <input
                                    type="number"
                                    value={data.attendance_minutes_before_end}
                                    onChange={(e) => setData('attendance_minutes_before_end', e.target.value)}
                                    min="1"
                                    className="w-32 px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        )}

                        {showCustomTime && (
                            <div className="ml-7 p-4 bg-indigo-50 rounded-xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Custom Start</label>
                                        <input
                                            type="datetime-local"
                                            value={data.attendance_custom_start}
                                            onChange={(e) => setData('attendance_custom_start', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Custom End</label>
                                        <input
                                            type="datetime-local"
                                            value={data.attendance_custom_end}
                                            onChange={(e) => setData('attendance_custom_end', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Zoom Meeting */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Zoom Meeting</h2>

                    {!zoomConfigured ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                            Zoom is not configured. Please ask your administrator to set up Zoom integration.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Meeting URL</label>
                                    <input
                                        type="url"
                                        value={data.zoom_meeting_url}
                                        onChange={(e) => setData('zoom_meeting_url', e.target.value)}
                                        placeholder="https://zoom.us/j/..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Passcode</label>
                                    <input
                                        type="text"
                                        value={data.zoom_passcode}
                                        onChange={(e) => setData('zoom_passcode', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">
                                You can enter the details manually or use "Create Zoom Meeting" button after saving.
                            </p>
                        </div>
                    )}
                </div>

                {/* Material Upload */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Training Material</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Material (PDF/PPTX)</label>
                        <input
                            type="file"
                            accept=".pdf,.pptx,.ppt"
                            onChange={(e) => setData('material', e.target.files[0])}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                        />
                        {training?.material_original_name && (
                            <p className="mt-2 text-sm text-slate-500">
                                Current file: <span className="font-medium">{training.material_original_name}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Status & Submit */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                {isEdit && <option value="completed">Completed</option>}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/trainer/trainings')}
                                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : (isEdit ? 'Update Training' : 'Create Training')}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
