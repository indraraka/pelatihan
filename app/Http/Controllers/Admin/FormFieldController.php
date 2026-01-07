<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormFieldController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/FormFields/Index', [
            'formFields' => FormField::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Admin/FormFields/Form', [
            'field' => null,
            'types' => ['text', 'email', 'select', 'textarea', 'number', 'date'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:50|regex:/^[a-z_]+$/',
            'type' => 'required|in:text,email,select,textarea,number,date',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        FormField::create($validated);

        return redirect()->route('admin.form-fields.index')
            ->with('success', 'Form field created successfully.');
    }

    public function edit(FormField $formField)
    {
        return Inertia::render('Dashboard/Admin/FormFields/Form', [
            'field' => $formField,
            'types' => ['text', 'email', 'select', 'textarea', 'number', 'date'],
        ]);
    }

    public function update(Request $request, FormField $formField)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'name' => 'required|string|max:50|regex:/^[a-z_]+$/',
            'type' => 'required|in:text,email,select,textarea,number,date',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $formField->update($validated);

        return redirect()->route('admin.form-fields.index')
            ->with('success', 'Form field updated successfully.');
    }

    public function destroy(FormField $formField)
    {
        // Prevent deletion of core fields
        if (in_array($formField->name, ['name', 'email'])) {
            return back()->withErrors(['field' => 'Cannot delete core form fields (name, email).']);
        }

        $formField->delete();

        return redirect()->route('admin.form-fields.index')
            ->with('success', 'Form field deleted successfully.');
    }
}
