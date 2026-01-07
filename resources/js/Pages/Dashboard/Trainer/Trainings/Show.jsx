import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import MaterialPreview from '@/Components/MaterialPreview';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Show({ training, attendanceUrl, zoomConfigured }) {
    const [copySuccess, setCopySuccess] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const copyAttendanceUrl = () => {
        navigator.clipboard.writeText(attendanceUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <DashboardLayout title="Training Details">
            <Head title={training.title} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link href="/trainer/trainings" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Trainings
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">{training.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${training.status === 'published' ? 'bg-green-100 text-green-700' :
                            training.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                            {training.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/trainer/trainings/${training.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Training Details</h2>
                        <div className="prose prose-slate max-w-none">
                            <p>{training.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Date</p>
                                <p className="font-medium text-slate-800">{formatDate(training.start_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Time</p>
                                <p className="font-medium text-slate-800">{formatTime(training.start_time)} - {formatTime(training.end_time)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Jumlah JP</p>
                                <p className="font-medium text-slate-800">
                                    {training.jumlah_jp ? `${training.jumlah_jp} JP` : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Certificate</p>
                                <p className="font-medium text-slate-800">
                                    {training.certificate_template?.name || 'No certificate'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Total Attendees</p>
                                <p className="font-medium text-slate-800">{training.attendances?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Form URL */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Attendance Form URL</h2>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={attendanceUrl}
                                readOnly
                                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 font-mono text-sm"
                            />
                            <button
                                onClick={copyAttendanceUrl}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${copySuccess
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                    }`}
                            >
                                {copySuccess ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Attendees List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">Attendees ({training.attendances?.length || 0})</h2>
                        </div>

                        {training.attendances?.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {training.attendances.map((attendance) => (
                                    <div key={attendance.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-slate-800">{attendance.name}</p>
                                                <p className="text-sm text-slate-500">{attendance.email}</p>
                                                {attendance.organization && (
                                                    <p className="text-sm text-slate-400">{attendance.organization}</p>
                                                )}
                                            </div>
                                            {attendance.certificate_number && (
                                                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                    {attendance.certificate_number}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                No attendees yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Zoom Controls */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Zoom Meeting</h2>

                        {training.zoom_meeting_url ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Meeting URL</p>
                                    <a
                                        href={training.zoom_meeting_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline text-sm break-all"
                                    >
                                        {training.zoom_meeting_url}
                                    </a>
                                </div>
                                {training.zoom_passcode && (
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Passcode</p>
                                        <p className="font-mono text-slate-800">{training.zoom_passcode}</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2 pt-4">
                                    <a
                                        href={`/trainer/trainings/${training.id}/zoom/start`}
                                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-medium text-center hover:bg-blue-600 transition-colors"
                                    >
                                        Start Meeting
                                    </a>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => router.post(`/trainer/trainings/${training.id}/zoom/update`)}
                                            className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            Update Meeting
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Delete Meeting
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : zoomConfigured ? (
                            <div className="space-y-4">
                                <p className="text-slate-500 text-sm">No Zoom meeting created yet</p>
                                <button
                                    onClick={() => router.post(`/trainer/trainings/${training.id}/zoom/create`)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                                >
                                    Create Zoom Meeting
                                </button>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">Zoom not configured</p>
                        )}
                    </div>

                    {/* Material */}
                    {training.material_path && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Training Material</h2>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${training.material_original_name?.endsWith('.pdf') ? 'bg-red-100' : 'bg-orange-100'}`}>
                                    {training.material_original_name?.endsWith('.pdf') ? (
                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{training.material_original_name}</p>
                                    <p className="text-xs text-slate-500">
                                        {training.material_original_name?.endsWith('.pdf') ? 'PDF Document' : 'PowerPoint Presentation'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Preview
                                </button>
                                <a
                                    href={`/trainer/trainings/${training.id}/material/download`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Material Preview Modal */}
                    <MaterialPreview
                        isOpen={showPreview}
                        onClose={() => setShowPreview(false)}
                        materialUrl={`/storage/${training.material_path}`}
                        fileName={training.material_original_name}
                    />

                    {/* Virtual Background */}
                    {training.vb_background && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Virtual Background</h2>
                            <img
                                src={`/storage/${training.vb_background}`}
                                alt="Virtual Background"
                                className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-4"
                            />
                            <a
                                href={`/storage/${training.vb_background}`}
                                download
                                target="_blank"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download VB
                            </a>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Zoom Meeting"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to delete this Zoom meeting? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                router.delete(`/trainer/trainings/${training.id}/zoom/delete`);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Meeting
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
