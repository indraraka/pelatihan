<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Admin/Banners/Index', [
            'banners' => Banner::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Admin/Banners/Form', [
            'banner' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|url',
            'button_text' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        $validated['image_path'] = $request->file('image')->store('banners', 'public');

        Banner::create($validated);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Dashboard/Admin/Banners/Form', [
            'banner' => $banner,
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|url',
            'button_text' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($banner->image_path);
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        Storage::disk('public')->delete($banner->image_path);
        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }
}
