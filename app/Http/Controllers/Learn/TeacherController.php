<?php

namespace App\Http\Controllers\Learn;

use App\Models\JournalLesson;
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
        $answers = JournalLesson::where('status', 'pending')->get();

        $respondents = [];
        foreach ($answers as $answer) {
            $respondents[] = [
                'user' => [
                    'id' => $answer->user->id,
                    'name' => $answer->user->name,
                ],
                'course' => [
                    'id' => $answer->course->id,
                    'name' => $answer->course->name,
                ],
                'lesson' => [
                    'id' => $answer->lesson->id,
                    'name' => $answer->lesson->name,
                ],
                'created_at' => $answer->created_at->toDateString(),
                'id' => $answer->id
            ];
        }

        return Inertia::render('Admin/Learning/TeacherLessons', compact('respondents'));
    }

    /**
     * Detail of lesson to check
     *
     * @return \Inertia`\Response
     */
    public function getAnswer($id)
    {
        $answer = JournalLesson::with(['user', 'course', 'lesson', 'lesson.questions'])->find($id);
        return Inertia::render('Admin/Learning/TeacherLesson', compact('answer'));
    }

    public function postAnswer(Request $request, $id)
    {
        dd($request);
        // $lessons = JournalService::getLessonsForTeacher();
        // return Inertia::render('Admin/Learning/TeacherLessons', compact('lessons'));
    }
}
