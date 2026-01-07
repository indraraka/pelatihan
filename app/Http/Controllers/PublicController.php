<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\Training;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Show the landing page
     */
    public function index()
    {
        return Inertia::render('Welcome', [
            'siteName' => Setting::get('site_name', 'Training Management'),
            'siteLogo' => Setting::get('site_logo'),
            'introductionText' => Setting::get('introduction_text'),
            'footerContent' => Setting::get('footer_content'),
            'banners' => Banner::active()->get(),
            'categories' => Category::active()->ordered()->withCount('trainings')->get(),
            'upcomingTrainings' => Training::upcoming()
                ->with('trainer:id,name', 'category:id,name,icon,color')
                ->take(6)
                ->get(),
            'ongoingTrainings' => Training::ongoing()
                ->with('trainer:id,name', 'category:id,name,icon,color')
                ->get(),
            'articles' => Article::published()
                ->take(4)
                ->get(),
            'faqs' => Faq::active()->get(),
        ]);
    }

    /**
     * Show article detail
     */
    public function article(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Public/ArticleShow', [
            'article' => $article,
        ]);
    }

    /**
     * Show training detail
     */
    public function training(Training $training)
    {
        if ($training->status !== 'published') {
            abort(404);
        }

        return Inertia::render('Public/TrainingShow', [
            'training' => $training->load('trainer:id,name', 'certificateTemplate:id,name'),
            'isOpen' => $training->isAttendanceOpen(),
            'attendanceUrl' => route('attendance.form', $training),
        ]);
    }
}
