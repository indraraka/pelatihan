<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Categories/Index', [
            'categories' => Category::ordered()->withCount('trainings')->get(),
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create()
    {
        return Inertia::render('Dashboard/Admin/Categories/Form');
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        // Check for duplicate slug
        $slug = $validated['slug'];
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $validated['slug'] . '-' . $count;
            $count++;
        }
        $validated['slug'] = $slug;

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified category
     */
    public function edit(Category $category)
    {
        return Inertia::render('Dashboard/Admin/Categories/Form', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Only update slug if name changed
        if ($category->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $count = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = Str::slug($validated['name']) . '-' . $count;
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category)
    {
        // Check if category has trainings
        if ($category->trainings()->count() > 0) {
            return back()->withErrors(['delete' => 'Kategori tidak dapat dihapus karena masih memiliki pelatihan.']);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
