<?php

namespace App\Packages\Learn\UseCases;

use App\Packages\Learn\Entities\CourseStatus;
use App\Packages\Common\Application\Services\IUserService;
use App\Packages\Common\Infrastructure\Services\UserService;
use App\Packages\Learn\UseCases\LearnService;
use App\Models\JournalLesson;
use App\Models\User;

class StudentService
{
    public function __construct(
        public IUserService $userService, 
        public LearnService $learnService
    ) {}

    public function getStudensList(
        string $orderBy = 'id', 
        string $sortBy = 'asc', 
        int $perPage = 10,
        ): array
    {
        $paginatedList = User::select(['id', 'name', 'last_name', 'avatar'])
            ->orderBy($orderBy, $sortBy)
            ->paginate($perPage);

        $paginatedList->getCollection()->each( function ($e) {
            $courses = $this->learnService->getCoursesFor($e->id);
            $e['assignedCourses'] = count($courses);
        });

        return $paginatedList->toArray();
    }

    public function getStudentInfo(int $id): array {
        $courses = $this->learnService->getCourses();

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
            'name' => 'Ivan Petrov',
            'assignedCourses' => [$course1],
            'startedCourses' => [$course1],
            'finishedCourses' => [$course1],
        ];

        return $studentInfo;

    }

}