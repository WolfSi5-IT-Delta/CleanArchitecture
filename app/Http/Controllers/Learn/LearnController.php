<?php

namespace App\Http\Controllers\Learn;

use App\Models\Course;
use App\Packages\Learn\UseCases\JournalService;
use App\Packages\Learn\UseCases\LearnService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;


class LearnController extends BaseController
{
    public function __construct(
        public LearnService $learnService
    )
    {}

    /**
     * Select portal.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function index()
    {
        $courses = $this->learnService->getCourses();
        $curriculums = $this->learnService->getCurriculums();
        $courseGroups = $this->learnService->getCourseGroups();
        return Inertia::render('Pages/Learning/Courses', compact('courses', 'curriculums', 'courseGroups'));
    }

    public function course($cid)
    {
        $course = Course::with(['lessons' => function ($query) {
            $query->where('active', '1');
        }])->find($cid);
        $statuses = JournalService::getLessonsStatuses($cid);

        $course_completed = true;
        foreach ($course->lessons as $item) {
            if (array_search(['id' => $item->id, 'status' => 'done'], $statuses) === false) {
                $course_completed = false;
            }
        }

        return Inertia::render('Pages/Learning/Course', compact('course', 'statuses', 'course_completed'));
    }

    public function success($cid)
    {
        $course = $this->learnService->getCourse($cid);
        $statuses = JournalService::getLessonsStatuses($cid);
        $course_completed = $this->isCourseCompleted($cid);

        if ($course_completed === false) {
            return redirect()->route('course', $cid);
        }

        return Inertia::render('Pages/Learning/Course', compact('course', 'statuses', 'course_completed'));
    }

    public function lesson(Request $request, $cid, $lid)
    {
        $lesson = $this->learnService->runLesson($lid);
        $answers = JournalService::getAnswers($cid, $lid);
        $answers = array_map(function ($item) {
            unset($item['hint']);
//            unset($item['done']);
            return $item;
        }, $answers);
        $course = $this->learnService->getCourse($cid);
        $statuses = JournalService::getLessonsStatuses($cid);

        $course_completed = true;
        foreach ($course->lessons as $item) {
            if (array_search(['id' => $item->id, 'status' => 'done'], $statuses) === false) {
                $course_completed = false;
            }
        }
//        dd($answers);

        return Inertia::render('Pages/Learning/Lesson', [
            'course_id' => $cid,
            'lesson' => $lesson,
            'answers' => $answers,
            'status' => JournalService::getLessonStatus($cid, $lid),
            'statuses'=>$statuses,
            'course' => $course,
            'course_completed' => $course_completed
//            'statuses' => $statuses,
//            'course_completed' => $this->isCourseCompleted($cid)
        ]);
    }

    public function checkLesson(Request $request, $cid, $id)
    {
        $result = $this->learnService->checkLesson($cid, $id, $request->all());

        if ($result) {
            $nextLesson = $this->learnService->nextLesson($cid, $id);
            if ($this->isCourseCompleted($cid))
                return redirect()->route('success', $cid)->with(['lessonCheckMessage' => 'done']);
            elseif ($nextLesson)
                return redirect()->route('lesson', [$cid, $nextLesson->id])->with(['lessonCheckMessage' => 'done', 'nextLessonId' => $nextLesson->id]);
            else
                return redirect()->route('lesson', [$cid, $id])->with(['lessonCheckMessage' => 'pending']);
        }

//        return redirect()->route('lesson', [$cid, $id])->with(['lessonCheckMessage' => 'fail']);
        return redirect()->route('lesson', [$cid, $id])->with(['header' => 'fail111', 'type' => 'fail']);
    }

    private function isCourseCompleted($cid) {
        $course = $this->learnService->getCourse($cid);
        $statuses = JournalService::getLessonsStatuses($cid);

        $course_completed = true;
        foreach ($course->lessons as $item) {
            if (array_search(['id' => $item->id, 'status' => 'done'], $statuses) === false) {
                $course_completed = false;
            }
        }
        return $course_completed;
    }
}
