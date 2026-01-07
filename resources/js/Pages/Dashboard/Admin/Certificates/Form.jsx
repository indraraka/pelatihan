import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';

export default function Form({ certificate, placeholders }) {
    const isEdit = !!certificate;
    const [activeTab, setActiveTab] = useState(certificate?.template_type || 'image');
    const [previewHtml, setPreviewHtml] = useState('');
    const canvasRef = useRef(null);
    const [selectedElement, setSelectedElement] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: certificate?.name || '',
        template_type: certificate?.template_type || 'image',
        html_template: certificate?.html_template || getDefaultTemplate(),
        text_elements: certificate?.text_elements || [],
        background_image: null,
        signer_name: certificate?.signer_name || '',
        signer_title: certificate?.signer_title || '',
        is_active: certificate?.is_active ?? true,
    });

    const [backgroundPreview, setBackgroundPreview] = useState(
        certificate?.background_image ? `/storage/${certificate.background_image}` : null
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setData('template_type', tab);
    };

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('background_image', file);
            setBackgroundPreview(URL.createObjectURL(file));
        }
    };

    const addTextElement = (placeholder = null) => {
        const newElement = {
            id: `el_${Date.now()}`,
            type: placeholder ? 'placeholder' : 'static',
            value: placeholder?.key || 'Text',
            x: 50,
            y: 50,
            fontSize: 24,
            fontFamily: 'Times New Roman, serif',
            fontWeight: 'normal',
            color: '#000000',
            textAlign: 'center',
            width: 80,
        };
        setData('text_elements', [...data.text_elements, newElement]);
        setSelectedElement(newElement.id);
    };

    const updateElement = (id, updates) => {
        setData('text_elements', data.text_elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
        ));
    };

    const removeElement = (id) => {
        setData('text_elements', data.text_elements.filter(el => el.id !== id));
        if (selectedElement === id) setSelectedElement(null);
    };

    const handleDrag = (id, e, dragData) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = ((dragData.x + (rect.width / 2)) / rect.width) * 100;
        const y = ((dragData.y + 20) / rect.height) * 100;
        updateElement(id, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('template_type', data.template_type);
        formData.append('html_template', data.html_template || '');
        formData.append('text_elements', JSON.stringify(data.text_elements));
        formData.append('signer_name', data.signer_name);
        formData.append('signer_title', data.signer_title);
        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.background_image) {
            formData.append('background_image', data.background_image);
        }

        if (isEdit) {
            formData.append('_method', 'PUT');
            post(`/admin/certificates/${certificate.id}`, {
                data: formData,
                forceFormData: true,
            });
        } else {
            post('/admin/certificates', {
                data: formData,
                forceFormData: true,
            });
        }
    };

    const selectedEl = data.text_elements.find(el => el.id === selectedElement);

    return (
        <DashboardLayout title={isEdit ? 'Edit Template' : 'Create Template'}>
            <Head title={isEdit ? 'Edit Template' : 'Create Template'} />

            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1 mr-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Template Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                placeholder="e.g., Training Certificate 2026"
                                required
                            />
                        </div>
                        <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                            />
                            <span className="text-sm text-slate-700">Active</span>
                        </label>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                        <button
                            type="button"
                            onClick={() => handleTabChange('html')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'html'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            📝 HTML Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('image')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'image'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            🖼️ Image Editor
                        </button>
                    </div>
                </div>

                {/* HTML Editor Mode */}
                {activeTab === 'html' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Editor */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">HTML Template</h3>
                                <a
                                    href={isEdit ? `/admin/certificates/${certificate.id}/preview` : '#'}
                                    target="_blank"
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Open Preview →
                                </a>
                            </div>

                            {/* Placeholders */}
                            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                                <p className="text-xs text-indigo-700 mb-2 font-medium">Click to insert placeholder:</p>
                                <div className="flex flex-wrap gap-1">
                                    {placeholders.map((p) => (
                                        <button
                                            key={p.key}
                                            type="button"
                                            onClick={() => {
                                                setData('html_template', data.html_template + p.key);
                                            }}
                                            className="px-2 py-1 bg-white text-indigo-700 rounded text-xs font-mono hover:bg-indigo-100 transition-colors"
                                            title={p.label}
                                        >
                                            {p.key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={data.html_template}
                                onChange={(e) => setData('html_template', e.target.value)}
                                rows={25}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none font-mono text-sm bg-slate-900 text-green-400"
                                placeholder="Enter HTML template..."
                            />
                        </div>

                        {/* Signer Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-semibold text-slate-800 mb-4">Signer Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Signer Name</label>
                                        <input
                                            type="text"
                                            value={data.signer_name}
                                            onChange={(e) => setData('signer_name', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                            placeholder="e.g., Training Director"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Signer Title</label>
                                        <input
                                            type="text"
                                            value={data.signer_title}
                                            onChange={(e) => setData('signer_title', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                            placeholder="e.g., Training Manager"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Template Tips */}
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                                <h4 className="font-medium text-amber-800 mb-2">💡 Tips</h4>
                                <ul className="text-sm text-amber-700 space-y-1">
                                    <li>• Use A4 landscape dimensions (297mm × 210mm)</li>
                                    <li>• Include inline styles for PDF compatibility</li>
                                    <li>• Test preview before saving</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Editor Mode */}
                {activeTab === 'image' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Canvas */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Certificate Canvas</h3>
                                {isEdit && (
                                    <a
                                        href={`/admin/certificates/${certificate.id}/preview`}
                                        target="_blank"
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        Open Preview →
                                    </a>
                                )}
                            </div>

                            {/* Upload Area */}
                            {!backgroundPreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-slate-600 font-medium">Upload Certificate Background</p>
                                        <p className="text-sm text-slate-400 mt-1">PNG or JPG, max 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={handleBackgroundUpload}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div
                                    ref={canvasRef}
                                    className="relative w-full bg-slate-100 rounded-xl overflow-hidden"
                                    style={{
                                        aspectRatio: '297/210',
                                        backgroundImage: `url(${backgroundPreview})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* Draggable Text Elements */}
                                    {data.text_elements.map((element) => (
                                        <Draggable
                                            key={element.id}
                                            position={{
                                                x: canvasRef.current ? (element.x / 100) * canvasRef.current.offsetWidth - (canvasRef.current.offsetWidth / 2) : 0,
                                                y: canvasRef.current ? (element.y / 100) * canvasRef.current.offsetHeight - 20 : 0
                                            }}
                                            onStop={(e, dragData) => handleDrag(element.id, e, dragData)}
                                            bounds="parent"
                                        >
                                            <div
                                                onClick={() => setSelectedElement(element.id)}
                                                className={`absolute cursor-move select-none px-2 py-1 rounded ${selectedElement === element.id
                                                    ? 'ring-2 ring-indigo-500 bg-indigo-50/50'
                                                    : 'hover:ring-2 hover:ring-slate-300'
                                                    }`}
                                                style={{
                                                    fontSize: `${element.fontSize}px`,
                                                    fontFamily: element.fontFamily,
                                                    fontWeight: element.fontWeight,
                                                    color: element.color,
                                                    textAlign: element.textAlign,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {element.value}
                                            </div>
                                        </Draggable>
                                    ))}

                                    {/* Change Background Button */}
                                    <label className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-sm font-medium text-slate-700 cursor-pointer shadow-sm">
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            onChange={handleBackgroundUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                            {/* Add Elements */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-semibold text-slate-800 mb-4">Add Text Element</h3>
                                <div className="space-y-2">
                                    {placeholders.map((p) => (
                                        <button
                                            key={p.key}
                                            type="button"
                                            onClick={() => addTextElement(p)}
                                            className="w-full px-3 py-2 text-left text-sm bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-between"
                                        >
                                            <span className="font-mono text-indigo-600">{p.key}</span>
                                            <span className="text-slate-500 text-xs">{p.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addTextElement()}
                                        className="w-full px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                                    >
                                        + Custom Text
                                    </button>
                                </div>
                            </div>

                            {/* Element Properties */}
                            {selectedEl && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-slate-800">Element Properties</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeElement(selectedEl.id)}
                                            className="text-red-500 hover:text-red-600 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Text/Placeholder</label>
                                            <input
                                                type="text"
                                                value={selectedEl.value}
                                                onChange={(e) => updateElement(selectedEl.id, { value: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Font Size</label>
                                                <input
                                                    type="number"
                                                    value={selectedEl.fontSize}
                                                    onChange={(e) => updateElement(selectedEl.id, { fontSize: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                                    min="8"
                                                    max="120"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Color</label>
                                                <input
                                                    type="color"
                                                    value={selectedEl.color}
                                                    onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                                                    className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Font Weight</label>
                                            <select
                                                value={selectedEl.fontWeight}
                                                onChange={(e) => updateElement(selectedEl.id, { fontWeight: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="bold">Bold</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Font Family</label>
                                            <select
                                                value={selectedEl.fontFamily}
                                                onChange={(e) => updateElement(selectedEl.id, { fontFamily: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            >
                                                <option value="Times New Roman, serif">Times New Roman</option>
                                                <option value="Arial, sans-serif">Arial</option>
                                                <option value="Georgia, serif">Georgia</option>
                                                <option value="Verdana, sans-serif">Verdana</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Elements List */}
                            {data.text_elements.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="font-semibold text-slate-800 mb-3">Elements ({data.text_elements.length})</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {data.text_elements.map((el) => (
                                            <div
                                                key={el.id}
                                                onClick={() => setSelectedElement(el.id)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedElement === el.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <span className="text-sm truncate">{el.value}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/certificates')}
                        className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : (isEdit ? 'Update Template' : 'Create Template')}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

function getDefaultTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        @page { margin: 0; size: A4 landscape; }
        body {
            font-family: 'Times New Roman', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .certificate {
            background: white;
            border: 8px solid #b8860b;
            padding: 60px 80px;
            text-align: center;
            width: 100%;
            max-width: 900px;
        }
        .title {
            font-size: 48px;
            color: #1a365d;
            margin-bottom: 10px;
            letter-spacing: 4px;
        }
        .subtitle {
            font-size: 24px;
            color: #4a5568;
            margin-bottom: 40px;
        }
        .recipient {
            font-size: 36px;
            color: #2d3748;
            font-weight: bold;
            border-bottom: 2px solid #b8860b;
            padding-bottom: 10px;
            margin: 20px auto;
            display: inline-block;
        }
        .description {
            font-size: 18px;
            color: #4a5568;
            margin: 15px 0;
        }
        .training-title {
            font-size: 24px;
            color: #2d3748;
            font-weight: bold;
            margin: 20px 0;
        }
        .date { font-size: 16px; color: #718096; }
        .number { font-size: 12px; color: #a0aec0; margin-top: 40px; }
        .signer { margin-top: 60px; }
        .signer-name {
            font-size: 16px;
            color: #2d3748;
            border-top: 1px solid #000;
            display: inline-block;
            padding-top: 5px;
            min-width: 200px;
        }
        .signer-title { font-size: 14px; color: #718096; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="title">CERTIFICATE</div>
        <div class="subtitle">of Completion</div>
        <p class="description">This is to certify that</p>
        <div class="recipient">{{name}}</div>
        <p class="description">has successfully completed the training</p>
        <div class="training-title">{{training_title}}</div>
        <p class="date">Held on {{training_date}}</p>
        <div class="signer">
            <p class="signer-name">{{signer_name}}</p>
            <p class="signer-title">{{signer_title}}</p>
        </div>
        <p class="number">Certificate No: {{certificate_number}} | Issued: {{issue_date}}</p>
    </div>
</body>
</html>`;
}
