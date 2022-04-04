<?php

namespace App\Http\Controllers\Learn;

use App\Packages\Learn\UseCases\JournalService;
use App\Packages\Learn\UseCases\LearnService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class TeacherController extends BaseController
{
    /**
     * List of lessons to check
     *
     * @return \Inertia\Response
     */
    public function getTeacherLessons()
    {
        $lessons = JournalService::getLessonsForTeacher();
        return Inertia::render('Admin/Learning/TeacherLessons', compact('lessons'));
    }

    /**
     * Detail of lesson to check
     *
     * @return \Inertia`\Response
     */
    public function getTeacherLesson($id)
    {
        $lesson = JournalService::getLesson($id);
        // return Inertia::render('Admin/Learning/TeacherLessons', compact('lessons'));
    }

    public function putTeacherLesson()
    {
        // $lessons = JournalService::getLessonsForTeacher();
        // return Inertia::render('Admin/Learning/TeacherLessons', compact('lessons'));
    }
}
