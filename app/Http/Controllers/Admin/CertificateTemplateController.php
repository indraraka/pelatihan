<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateTemplateController extends Controller
{
    /**
     * List all certificate templates
     */
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Certificates/Index', [
            'certificates' => CertificateTemplate::orderBy('name')->get(),
        ]);
    }

    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('Dashboard/Admin/Certificates/Form', [
            'certificate' => null,
            'placeholders' => CertificateTemplate::getPlaceholders(),
        ]);
    }

    /**
     * Store new template
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_type' => 'required|in:html,image',
            'html_template' => 'nullable|string',
            'text_elements' => 'nullable|array',
            'signer_name' => 'nullable|string|max:255',
            'signer_title' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Handle background image upload
        if ($request->hasFile('background_image')) {
            $request->validate(['background_image' => 'image|mimes:png,jpg,jpeg|max:10240']);
            $validated['background_image'] = $request->file('background_image')->store('certificates/backgrounds', 'public');
        }

        // Handle signature image upload
        if ($request->hasFile('signature_image')) {
            $request->validate(['signature_image' => 'image|mimes:png|max:2048']);
            $validated['signature_image'] = $request->file('signature_image')->store('certificates/signatures', 'public');
        }

        CertificateTemplate::create($validated);

        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate template created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(CertificateTemplate $certificate)
    {
        return Inertia::render('Dashboard/Admin/Certificates/Form', [
            'certificate' => $certificate,
            'placeholders' => CertificateTemplate::getPlaceholders(),
        ]);
    }

    /**
     * Update template
     */
    public function update(Request $request, CertificateTemplate $certificate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_type' => 'required|in:html,image',
            'html_template' => 'nullable|string',
            'text_elements' => 'nullable|array',
            'signer_name' => 'nullable|string|max:255',
            'signer_title' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Handle background image upload
        if ($request->hasFile('background_image')) {
            $request->validate(['background_image' => 'image|mimes:png,jpg,jpeg|max:10240']);
            
            // Delete old image
            if ($certificate->background_image) {
                Storage::disk('public')->delete($certificate->background_image);
            }
            
            $validated['background_image'] = $request->file('background_image')->store('certificates/backgrounds', 'public');
        }

        // Handle signature image upload
        if ($request->hasFile('signature_image')) {
            $request->validate(['signature_image' => 'image|mimes:png|max:2048']);
            
            // Delete old image
            if ($certificate->signature_image) {
                Storage::disk('public')->delete($certificate->signature_image);
            }
            
            $validated['signature_image'] = $request->file('signature_image')->store('certificates/signatures', 'public');
        }

        $certificate->update($validated);

        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate template updated successfully.');
    }

    /**
     * Delete template
     */
    public function destroy(CertificateTemplate $certificate)
    {
        // Check if template is being used
        if ($certificate->trainings()->count() > 0) {
            return back()->withErrors(['template' => 'Cannot delete template that is being used by trainings.']);
        }

        // Delete images
        if ($certificate->background_image) {
            Storage::disk('public')->delete($certificate->background_image);
        }
        if ($certificate->signature_image) {
            Storage::disk('public')->delete($certificate->signature_image);
        }

        $certificate->delete();

        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate template deleted successfully.');
    }

    /**
     * Preview template
     */
    public function preview(Request $request, CertificateTemplate $certificate)
    {
        // Use title from query param if provided, otherwise use sample text
        $trainingTitle = $request->query('title', 'Sample Training Event');
        
        $sampleData = [
            'name' => 'John Doe',
            'organization' => 'Sample Organization',
            'certificate_number' => 'CERT/01/2026/0001',
            'training_title' => $trainingTitle,
            'training_date' => now()->format('d F Y'),
            'training_duration' => '09:00 - 17:00',
            'issue_date' => now()->format('d F Y'),
        ];

        $html = $certificate->render($sampleData);

        return response($html)->header('Content-Type', 'text/html');
    }
}
