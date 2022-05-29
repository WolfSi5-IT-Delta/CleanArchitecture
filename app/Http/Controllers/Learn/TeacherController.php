<?php

namespace App\Http\Controllers\Learn;

use App\Models\JournalLesson;
use App\Packages\Learn\UseCases\JournalService;
use App\Packages\Learn\UseCases\LearnService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends BaseController
{
    /**
     * List of lessons to check
     *
     * @return \Inertia\Response
     */
    public function getTeacherLessons(Request $request)
    {
//        $orderBy = $request->orderby;
//        $sort = $request->sort;
        $perPage = $request->perpage ?? 10;
        $paginatedList = JournalLesson::where('status', 'pending')->paginate($perPage);

        $respondents = [];
        foreach ($paginatedList as $answer) {
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

        if ($request->has('page')) {
            return $paginatedList;
        }

        return Inertia::render('Admin/Learning/TeacherLessons', compact('paginatedList'));
    }

    /**
     * Detail of lesson to check
     *
     * @return \Inertia`\Response
     */
    public function getAnswer($id): Response
    {
        $answer = JournalLesson::with(['user', 'course', 'lesson', 'lesson.questions'])->find($id);
        return Inertia::render('Admin/Learning/TeacherLesson', compact('answer'));
    }

    public function postAnswer(Request $request, $id)
    {
        $answers = $request->all();
        $journal = JournalLesson::find($id);
        $journal->answers = $answers;

        // check if all text answers are done
        $status = array_reduce($answers, function ($val, $item) {
            if ($item['type'] !== 'text') return $val;
            return ($val && $item['done']);
        }, true);

        $journal->status = $status ? 'done' : 'fail';

        $journal->save();

        return redirect()->route('admin.teacher.lessons');

    }
}
