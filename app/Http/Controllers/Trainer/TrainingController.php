<?php

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CertificateTemplate;
use App\Models\Training;
use App\Services\ZoomService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrainingController extends Controller
{
    public function __construct(
        protected ZoomService $zoomService
    ) {}

    /**
     * List trainer's trainings
     */
    public function index()
    {
        $trainings = Training::where('trainer_id', Auth::id())
            ->with('certificateTemplate:id,name')
            ->withCount('attendances')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/Trainer/Trainings/Index', [
            'trainings' => $trainings,
        ]);
    }

    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('Dashboard/Trainer/Trainings/Form', [
            'training' => null,
            'certificateTemplates' => CertificateTemplate::where('is_active', true)->get(['id', 'name']),
            'categories' => Category::active()->ordered()->get(['id', 'name', 'icon', 'color']),
            'zoomConfigured' => $this->zoomService->isConfigured(),
            'attendanceOptions' => $this->getAttendanceOptions(),
        ]);
    }

    /**
     * Store new training
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'certificate_template_id' => 'nullable|exists:certificate_templates,id',
            'attendance_open_type' => 'required|in:from_start,before_end,custom',
            'attendance_minutes_before_end' => 'nullable|integer|min:1',
            'attendance_custom_start' => 'nullable|date',
            'attendance_custom_end' => 'nullable|date',
            'status' => 'required|in:draft,published',
            'material' => 'nullable|file|mimes:pdf,pptx,ppt|max:51200',
            'vb_background' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
            'jumlah_jp' => 'nullable|integer|min:1|max:100',
        ]);

        // Build attendance config
        $attendanceConfig = ['type' => $validated['attendance_open_type']];
        
        if ($validated['attendance_open_type'] === 'before_end') {
            $attendanceConfig['minutes_before_end'] = $validated['attendance_minutes_before_end'] ?? 30;
        } elseif ($validated['attendance_open_type'] === 'custom') {
            $attendanceConfig['custom_start'] = $validated['attendance_custom_start'];
            $attendanceConfig['custom_end'] = $validated['attendance_custom_end'];
        }

        // Handle material upload
        $materialPath = null;
        $materialName = null;
        if ($request->hasFile('material')) {
            $file = $request->file('material');
            $materialPath = $file->store('materials', 'public');
            $materialName = $file->getClientOriginalName();
        }

        // Handle VB background upload
        $vbBackgroundPath = null;
        if ($request->hasFile('vb_background')) {
            $vbBackgroundPath = $request->file('vb_background')->store('trainings/vb', 'public');
        }

        $training = Training::create([
            'trainer_id' => Auth::id(),
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'certificate_template_id' => $validated['certificate_template_id'],
            'attendance_open_config' => $attendanceConfig,
            'status' => $validated['status'],
            'material_path' => $materialPath,
            'material_original_name' => $materialName,
            'vb_background' => $vbBackgroundPath,
            'jumlah_jp' => $validated['jumlah_jp'] ?? null,
        ]);

        return redirect()->route('trainer.trainings.show', $training)
            ->with('success', 'Training created successfully.');
    }

    /**
     * Show training details
     */
    public function show(Training $training)
    {
        $this->authorize('view', $training);

        return Inertia::render('Dashboard/Trainer/Trainings/Show', [
            'training' => $training->load(['certificateTemplate:id,name', 'attendances']),
            'attendanceUrl' => route('attendance.form', $training),
            'zoomConfigured' => $this->zoomService->isConfigured(),
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Training $training)
    {
        $this->authorize('update', $training);

        return Inertia::render('Dashboard/Trainer/Trainings/Form', [
            'training' => $training,
            'certificateTemplates' => CertificateTemplate::where('is_active', true)->get(['id', 'name']),
            'categories' => Category::active()->ordered()->get(['id', 'name', 'icon', 'color']),
            'zoomConfigured' => $this->zoomService->isConfigured(),
            'attendanceOptions' => $this->getAttendanceOptions(),
        ]);
    }

    /**
     * Update training
     */
    public function update(Request $request, Training $training)
    {
        $this->authorize('update', $training);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'certificate_template_id' => 'nullable|exists:certificate_templates,id',
            'attendance_open_type' => 'required|in:from_start,before_end,custom',
            'attendance_minutes_before_end' => 'nullable|integer|min:1',
            'attendance_custom_start' => 'nullable|date',
            'attendance_custom_end' => 'nullable|date',
            'status' => 'required|in:draft,published,completed',
            'material' => 'nullable|file|mimes:pdf,pptx,ppt|max:51200',
            'vb_background' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
            'jumlah_jp' => 'nullable|integer|min:1|max:100',
            'zoom_meeting_url' => 'nullable|url',
            'zoom_passcode' => 'nullable|string|max:20',
        ]);

        // Build attendance config
        $attendanceConfig = ['type' => $validated['attendance_open_type']];
        
        if ($validated['attendance_open_type'] === 'before_end') {
            $attendanceConfig['minutes_before_end'] = $validated['attendance_minutes_before_end'] ?? 30;
        } elseif ($validated['attendance_open_type'] === 'custom') {
            $attendanceConfig['custom_start'] = $validated['attendance_custom_start'];
            $attendanceConfig['custom_end'] = $validated['attendance_custom_end'];
        }

        // Handle material upload
        if ($request->hasFile('material')) {
            // Delete old material
            if ($training->material_path) {
                Storage::disk('public')->delete($training->material_path);
            }
            
            $file = $request->file('material');
            $training->material_path = $file->store('materials', 'public');
            $training->material_original_name = $file->getClientOriginalName();
        }

        // Handle VB background upload
        $vbBackgroundPath = $training->vb_background;
        if ($request->hasFile('vb_background')) {
            // Delete old VB background
            if ($training->vb_background) {
                Storage::disk('public')->delete($training->vb_background);
            }
            $vbBackgroundPath = $request->file('vb_background')->store('trainings/vb', 'public');
        }

        $training->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'] ?? $training->category_id,
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'certificate_template_id' => $validated['certificate_template_id'],
            'attendance_open_config' => $attendanceConfig,
            'status' => $validated['status'],
            'vb_background' => $vbBackgroundPath,
            'jumlah_jp' => $validated['jumlah_jp'] ?? $training->jumlah_jp,
            'zoom_meeting_url' => $validated['zoom_meeting_url'] ?? $training->zoom_meeting_url,
            'zoom_passcode' => $validated['zoom_passcode'] ?? $training->zoom_passcode,
        ]);

        return redirect()->route('trainer.trainings.show', $training)
            ->with('success', 'Training updated successfully.');
    }

    /**
     * Delete training
     */
    public function destroy(Training $training)
    {
        $this->authorize('delete', $training);

        // Delete material
        if ($training->material_path) {
            Storage::disk('public')->delete($training->material_path);
        }

        // Delete VB background
        if ($training->vb_background) {
            Storage::disk('public')->delete($training->vb_background);
        }

        // Delete Zoom meeting if exists
        if ($training->zoom_meeting_id) {
            $this->zoomService->deleteMeeting($training->zoom_meeting_id);
        }

        $training->delete();

        return redirect()->route('trainer.trainings.index')
            ->with('success', 'Training deleted successfully.');
    }

    /**
     * Create Zoom meeting for training
     */
    public function createZoomMeeting(Training $training)
    {
        $this->authorize('update', $training);

        if (!$this->zoomService->isConfigured()) {
            return back()->withErrors(['zoom' => 'Zoom is not configured.']);
        }

        $result = $this->zoomService->createMeeting([
            'title' => $training->title,
            'description' => $training->description,
            'start_time' => $training->start_time,
            'end_time' => $training->end_time,
        ]);

        if (!$result) {
            return back()->withErrors(['zoom' => 'Failed to create Zoom meeting.']);
        }

        $training->update([
            'zoom_meeting_id' => $result['meeting_id'],
            'zoom_meeting_url' => $result['join_url'],
            'zoom_passcode' => $result['passcode'],
            'zoom_start_url' => $result['start_url'],
        ]);

        return back()->with('success', 'Zoom meeting created successfully.');
    }

    /**
     * Update Zoom meeting
     */
    public function updateZoomMeeting(Training $training)
    {
        $this->authorize('update', $training);

        if (!$training->zoom_meeting_id) {
            return back()->withErrors(['zoom' => 'No Zoom meeting exists for this training.']);
        }

        $success = $this->zoomService->updateMeeting($training->zoom_meeting_id, [
            'title' => $training->title,
            'description' => $training->description,
            'start_time' => $training->start_time,
            'end_time' => $training->end_time,
        ]);

        if (!$success) {
            return back()->withErrors(['zoom' => 'Failed to update Zoom meeting.']);
        }

        return back()->with('success', 'Zoom meeting updated successfully.');
    }

    /**
     * Get Zoom start URL
     */
    public function startZoomMeeting(Training $training)
    {
        $this->authorize('update', $training);

        if (!$training->zoom_meeting_id) {
            return back()->withErrors(['zoom' => 'No Zoom meeting exists for this training.']);
        }

        // Refresh meeting details to get latest start URL
        $meeting = $this->zoomService->getMeeting($training->zoom_meeting_id);

        if (!$meeting) {
            return back()->withErrors(['zoom' => 'Failed to get Zoom meeting details.']);
        }

        $training->update(['zoom_start_url' => $meeting['start_url']]);

        return Inertia::location($meeting['start_url']);
    }

    /**
     * Download material
     */
    public function downloadMaterial(Training $training)
    {
        if (!$training->material_path || !Storage::disk('public')->exists($training->material_path)) {
            abort(404, 'Material not found.');
        }

        return Storage::disk('public')->download($training->material_path, $training->material_original_name);
    }

    /**
     * Get attendance options
     */
    protected function getAttendanceOptions(): array
    {
        return [
            ['value' => 'from_start', 'label' => 'From event start until end'],
            ['value' => 'before_end', 'label' => 'X minutes before event end'],
            ['value' => 'custom', 'label' => 'Custom time range'],
        ];
    }
}
