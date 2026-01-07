import { useState } from 'react';

export default function MaterialPreview({ isOpen, onClose, materialUrl, fileName }) {
    const [loading, setLoading] = useState(true);

    if (!isOpen) return null;

    // Determine file type from extension
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const isPdf = extension === 'pdf';
    const isPpt = ['ppt', 'pptx'].includes(extension);

    // Check if running on localhost
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    // Get full URL for the material
    const fullUrl = materialUrl.startsWith('http')
        ? materialUrl
        : window.location.origin + materialUrl;

    // For PDF, we can embed directly
    // For PPTX on production, use Google Docs Viewer
    // For PPTX on localhost, show alternative options
    const getPreviewUrl = () => {
        if (isPdf) {
            return materialUrl;
        } else if (isPpt && !isLocalhost) {
            return `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;
        }
        return null;
    };

    const previewUrl = getPreviewUrl();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPdf ? 'bg-red-100' : 'bg-orange-100'}`}>
                            {isPdf ? (
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{fileName}</h3>
                            <p className="text-sm text-slate-500">
                                {isPdf ? 'PDF Document' : 'PowerPoint Presentation'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={materialUrl}
                            target="_blank"
                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open
                        </a>
                        <a
                            href={materialUrl}
                            download
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden">
                    {previewUrl ? (
                        <>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            )}
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title={`Preview: ${fileName}`}
                                allowFullScreen
                                onLoad={() => setLoading(false)}
                            />
                        </>
                    ) : isPpt && isLocalhost ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">PowerPoint Preview</h4>
                                <p className="text-slate-600 mb-6">
                                    In-browser PowerPoint preview requires a public URL. Since you're running on localhost, please use one of the options below:
                                </p>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href={materialUrl}
                                        target="_blank"
                                        className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Open in New Tab
                                    </a>
                                    <a
                                        href={materialUrl}
                                        download
                                        className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download File
                                    </a>
                                </div>
                                <p className="text-xs text-slate-400 mt-4">
                                    💡 After deploying to production, PowerPoint preview will work automatically.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-500">Preview not available for this file type</p>
                                <a href={materialUrl} download className="text-indigo-600 hover:underline mt-2 inline-block">
                                    Download the file instead
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                {isPdf && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Use your browser's PDF viewer controls to zoom and navigate.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
