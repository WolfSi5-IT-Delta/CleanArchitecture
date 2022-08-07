<?php

namespace App\Packages\Learn\UseCases;

use App\Models\Course as ModelsCourse;
use App\Models\Curriculum;
use App\Models\JournalLesson;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Application\Services\IUserService;
use App\Packages\Learn\Entities\Course;
use App\Packages\Learn\Entities\Lesson;
use App\Packages\Learn\Entities\QuestionType;
use App\Packages\Learn\Infrastructure\Repositories\CourseGroupRepository;
use App\Packages\Learn\Infrastructure\Repositories\CourseRepository;
use App\Packages\Learn\Infrastructure\Repositories\CurriculumRepository;
use App\Packages\Learn\Infrastructure\Repositories\LessonRepository;
use App\Packages\Learn\Infrastructure\Repositories\QuestionRepository;

class LearnService implements LearnServiceInterface
{
    public function __construct(
        protected IAuthorisationService $authService, 
        protected IUserService $userService
    ) {}

    public function getCourses($onlyActive = true): array
    {
        $user_id = $this->userService->currentUser()->id;

        return $this->getCoursesFor($user_id, $onlyActive);
    }

    public function getCoursesFor(int $user_id, $onlyActive = true): array
    {
        $rep = new CourseRepository();
        if ($onlyActive) {
            $rep = $rep->query(fn ($model) => ( $model->where('active', '=', 1) ));
        }
        $list = $rep->all();

        $res = array_filter($list, fn($item) => ($this->authService->authorizedFor($user_id, "LC{$item->id}", 'read')));

        return array_values($res);
    }

    /**
     * @param int $id
     * @return Course
     */
    public function getCourse(int $id): Course
    {
        // $self = LearnService::getInstance();
//        AuthorisationService::authorize("LC{$id}", 'read');

        $rep = new CourseRepository();
        $course = $rep->find($id);
        $course->lessons = $rep->lessons($id);
//        $course->lessons = array_filter($course->lessons, fn($item) => ($self->authService::authorized("LL{$item->id}", 'read')));

        return $course;
    }

    /**
     * @return array
     */
    public function getCourseGroups(): array
    {
        $rep = new CourseGroupRepository();
        $list = $rep->all();

        return $list;
    }

    public function getCurriculums()
    {
        $list = Curriculum::with('courses')
            ->where('active', true)
            ->get()
            ->filter(fn($e) => ($this->authService->authorized("LP{$e->id}", 'read')))
            ->load('courses')
            ->toArray();

        $list = array_map(function ($e) {
            // удаляем из курсов те, к которым нет доступа и неактивные
            $e['courses'] = array_filter($e['courses'], function ($e) {
                return $e['active'] && $this->authService->authorized("LC{$e['id']}", 'read');
            });
            $e['courses'] = array_values($e['courses']); // перенумеровываем массив
            return count($e['courses']) ? $e : null; // если доступных курсов нет, убираем программу
        }, $list);

        $list = array_filter($list, fn($e) => !is_null($e)); // убираем пустые элементы
        return array_values($list);
    }

    public function getCurriculum(int $id)
    {
//        AuthorisationService::authorize("LP{$id}", 'read');
        $rep = new CurriculumRepository();
        $list = $rep->find($id);
        $list->courses = $rep->courses($id);
        return $list;
    }

    public function runLesson(int $id)
    {
        // check permissions
        // $self = LearnService::getInstance();
//        if (!$self->authService::authorized("LL{$id}", 'read')) {
//            throw new \Error('No access');
//        }

        // fill lesson questions and answers data
        $rep = new LessonRepository();
        $lesson = $rep->find($id);
        $lesson->questions = $rep->questions($id);

        $rep = new QuestionRepository();
        foreach ($lesson->questions as $value) {
            $value->answers = $rep->answers($value->id);
            // delete hint
            unset($value->hint);
            // delete right answer from the frontend side
            foreach ($value->answers as $val) {
                unset($val->correct);
            }
        }

        return $lesson;
    }

    /**
     * Check the answers of the question and
     * @param int $cid
     * @param int $lid
     * @param $data
     * @return bool|void
     */
    public function checkLesson(int $cid, int $lid, $data)
    {
        // check permissions
        // $self = LearnService::getInstance();
//        if (!$self->authService::authorized("LL{$lid}", 'read')) {
//            throw new \Error('No access');
//        }

        $rep = new LessonRepository();
        $lesson = $rep->find($lid);
        $lesson->questions = $rep->questions($lid);

        $result = 'done';
        $pending = false; // there is a text question, need human check

        $storeAnswersArr = [];

        $rep = new QuestionRepository();
        // check all questions
        foreach ($lesson->questions as $question) {
            $question->answers = $rep->answers($question->id);

            // prepare for saving
            $storeAnswersArr[$question->id] = [
                'question_id' => $question->id,
                'question' => $question->name,
                'type' => $question->type,
                'hint' => $question->hint,
            ];

            switch ($question->type) {
                case QuestionType::RADIO:
                    // only one answer
                    $answer = $data["$question->id"]['answer'] ?? false;
                    $storeAnswersArr[$question->id]['answer'] = $answer;
                    $rightAnswer = array_filter($question->answers, fn($item) => ($item->correct));
                    $rightAnswer = $rightAnswer[0] ?? false;
                    // assert(false, 'No answers for the RADIO type question!');
                    // check one correct answer
                    if ($rightAnswer->id != $answer) $result = 'fail';
                    break;
                case QuestionType::CHECKBOX:
                    // array of answers or []
                    $answer = $data["$question->id"]['answer'] ?? [];
                    $storeAnswersArr[$question->id]['answer'] = $answer;
                    $rightAnswer = array_filter($question->answers, fn($item) => ($item->correct));
                    // check all correct answers
                    foreach ($rightAnswer as $value) {
                        if (!in_array($value->id, $answer)) $result = 'fail';
                    }
                    break;
                case QuestionType::TEXT:
                    // needed to check by instructor
                    $answer = $data["$question->id"];
                    $storeAnswersArr[$question->id]['answer'] = $answer['answer'] ?? '';
                    $storeAnswersArr[$question->id]['comment'] = $answer['comment'] ?? '';
                    $storeAnswersArr[$question->id]['done'] = $answer['done'] ?? 0;
                    $pending = true;
                    break;
                default:
                    assert('Unknown question type.');
            }
        }

        if ($result == 'done' && $pending) $result = 'pending';

        JournalService::storeAnswers($cid, $lid, $storeAnswersArr);
        JournalService::setLessonStatus($cid, $lid, $result);

        return ($result == 'done') || ($result == 'pending');
    }

    public function nextLesson(int $cid, int $lid): Lesson|bool
    {
        //todo: move to entity
        $course = self::getCourse($cid);
        $rep = new CourseRepository();
        $lessons = $course->lessons;
        $lessons_ids = array_map(fn($e) => ($e->id), $lessons);
        $pos = array_search($lid, $lessons_ids);
        if ($pos === false) throw new \Exception('Error while next lesson finding...');

        if ($pos == count($lessons_ids)-1) return false;
        return $lessons[$pos + 1];
    }

    public function getLessons()
    {
        $rep = new LessonRepository();
        $lessons = $rep->all();
        foreach($lessons as $lesson) {
            $lesson->courses = $rep->courses($lesson->id);
        }
        return $lessons;
    }

    public function getLesson(int $lid): Lesson
    {
        $rep = new LessonRepository();
        $lesson = $rep->find($lid);
        $lesson->questions = $rep->questions($lid);
        return $lesson;
    }

    public function getQuestions()
    {
        $rep = new QuestionRepository();
        return $rep->all();
    }

}
