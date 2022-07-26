<?php

namespace App\Packages\Learn\UseCases;

use App\Packages\Learn\Entities\CourseStatus;
use App\Packages\Common\Application\Services\IUserService;
use App\Packages\Common\Infrastructure\Services\UserService;
use App\Packages\Learn\UseCases\LearnService;
use App\Models\JournalLesson;
use App\Models\User;
use App\Packages\Learn\Infrastructure\Repositories\LessonRepository;
use App\Packages\Learn\UseCases\JournalService;

class StudentService
{
    public function __construct(
        public IUserService $userService, 
        public LearnService $learnService,
        public JournalService $journalService
    ) {}

    /**
     * Student's list
     */
    public function getStudensList(
        string $orderBy = 'id', 
        string $sortBy = 'asc', 
        int $perPage = 10,
        ): array
    {
        $paginatedList = User::select(['id', 'name', 'last_name', 'avatar'])
            ->orderBy($orderBy, $sortBy)
            ->paginate($perPage);

        // counting cources
        $paginatedList->getCollection()->each( function ($e) {
            $courses = collect($this->learnService->getCoursesFor($e->id));

            $started = 0;
            $finished = 0;
            $courses->each(function ($item) use ($e, &$started, &$finished) {
                $progress = $this->journalService->getCourseProgress($e->id, $item->id);
                if ($progress == 100) {
                    $finished++;
                };
                $_started = $progress = $this->journalService->isCourseStarted($e->id, $item->id);
                if ($_started) {
                    $started++;
                };
            });

            $e['assignedCourses'] = $courses->count();
            $e['startedCourses'] = $started;
            $e['finishedCourses'] = $finished;
        });

        return $paginatedList->toArray();
    }

    /**
     * Student's info
     */
    public function getStudentInfo(int $user_id): array {
        $courses = collect($this->learnService->getCoursesFor($user_id));

        $rep = new LessonRepository();

        $courses->each(function ($e) use ($user_id, $rep) {
            $progress = $this->journalService->getCourseProgress($user_id, $e->id);
            $e->status = $progress === 100 ? 'done' : 'in_progress';
            $e->is_started = $progress = $this->journalService->isCourseStarted($user_id, $e->id);
            if (!$e->is_started) {
                $e->status = 'not_started';
            }

            $e->lessons = $rep->query(
                fn ($model) => ($model->where(['course_id' => $e->id])),
                )->all(['id', 'name']);
        });

        dd($courses);

        $course1 = [
            'id' => 1,
            'name' => 'Course1',
            'lessons' => [
                [
                    'id' => 1,
                    'name' => 'Lesson1',
                    'questions' => [
                        [
                            'id' => 1,
                            'name' => 'Questions 1',            
                        ],
                        [
                            'id' => 2,
                            'name' => 'Questions 2',            
                        ],
                        [
                            'id' => 3,
                            'name' => 'Questions 2',            
                        ],

                    ],
                    'answers' => '{"1": {"hint": null, "type": "radio", "answer": "1", "question": "Question 1_1", "question_id": 1}, "2": {"hint": null, "type": "checkbox", "answer": [3, 4], "question": "Question 1_2", "question_id": 2}, "3": {"done": 0, "hint": null, "type": "text", "answer": "666", "comment": "", "question": "Question 1_3", "question_id": 3}}'
                ],
            ],
        ];

        $studentInfo = [
            'id' => $user_id,
            'name' => 'Ivan Petrov',
            'assignedCourses' => [$course1],
            'startedCourses' => [$course1],
            'finishedCourses' => [$course1],
        ];

        return $studentInfo;

    }

}