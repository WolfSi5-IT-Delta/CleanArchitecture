<?php

namespace App\Packages\Learn\UseCases;

use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Learn\Entities\Curriculum;
use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Learn\Entities\Course;
use App\Packages\Learn\Entities\Lesson;
use App\Packages\Learn\Entities\QuestionType;
use App\Packages\Learn\Infrastructure\Repositories\CourseGroupRepository;
use App\Packages\Learn\Infrastructure\Repositories\CourseRepository;
use App\Packages\Learn\Infrastructure\Repositories\CurriculumRepository;
use App\Packages\Learn\Infrastructure\Repositories\LessonRepository;
use App\Packages\Learn\Infrastructure\Repositories\QuestionRepository;
use Symfony\Component\HttpFoundation\Response;

class LearnService implements LearnServiceInterface
{
    protected static $instance = null;

    protected $authService;

    private function __construct()
    {
        $this->authService = app()->make(IAuthorisationService::class);
    }

    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function getCourses($onlyActive = true): array
    {
        $rep = new CourseRepository();
        if ($onlyActive) {
            $rep = $rep->query(fn ($model) => ( $model->where('active', '=', 1) ));
        }
        $list = $rep->all();

        $self = LearnService::getInstance();
        $res = array_filter($list, fn($item) => ($self->authService::authorized("LC{$item->id}", 'read')));

        return array_values($res);
    }

    /**
     * @param int $id
     * @return Course
     */
    public static function getCourse(int $id): Course
    {
        $self = LearnService::getInstance();
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
    public static function getCourseGroups(): array
    {
        $rep = new CourseGroupRepository();
        $list = $rep->all();

        return $list;
    }

    public static function getCurriculums($onlyActive = true): array
    {
        $rep = new CurriculumRepository();
        if ($onlyActive) {
            $rep = $rep->query(fn ($model) => ( $model->where('active', '=', 1) ));
        }
        $list = $rep->all();
        //FIXME:
//        $list = array_filter($list, fn($item) => (AuthorisationService::authorized("LP{$item->id}", 'read')));

        $rep = new CurriculumRepository();
        foreach ($list as $item) {
            $item->courses = $rep->courses($item->id);
        }

        return array_values($list);
    }

    public static function getCurriculum(int $id): Curriculum
    {
//        AuthorisationService::authorize("LP{$id}", 'read');
        $rep = new CurriculumRepository();
        $list = $rep->find($id);
        $list->courses = $rep->courses($id);
        return $list;
    }

    public static function runLesson(int $id)
    {
        // check permissions
        $self = LearnService::getInstance();
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
     * @param int $id
     * @param $data
     * @return bool|void
     */
    public static function checkLesson(int $cid, int $id, $data)
    {
        // check permissions
        $self = LearnService::getInstance();
//        if (!$self->authService::authorized("LL{$id}", 'read')) {
//            throw new \Error('No access');
//        }

        $rep = new LessonRepository();
        $lesson = $rep->find($id);
        $lesson->questions = $rep->questions($id);

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
                    assert($rightAnswer);
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
//        dd($storeAnswersArr);
        JournalService::storeAnswers($cid, $id, $storeAnswersArr);
        JournalService::setLessonStatus($id, $result);

        return ($result == 'done') || ($result == 'pending');
    }

    public static function nextLesson(int $cid, int $id): Lesson|bool
    {
        //todo: move to entity
        $course = self::getCourse($cid);
        $rep = new CourseRepository();
        $lessons = $course->lessons;
        $lessons_ids = array_map(fn($e) => ($e->id), $lessons);
        $pos = array_search($id, $lessons_ids);
        if ($pos === false) throw new \Exception('Error while next lesson finding...');

        if ($pos == count($lessons_ids)-1) return false;
        return $lessons[$pos + 1];
    }

    public static function getLessons()
    {
        $rep = new LessonRepository();
        $lessons = $rep->all();
        foreach($lessons as $lesson) {
            $lesson->courses = $rep->courses($lesson->id);
        }
        return $lessons;
    }

    public static function getLesson(int $id): Lesson
    {
        $rep = new LessonRepository();
        $lesson = $rep->find($id);
        $lesson->questions = $rep->questions($id);
        return $lesson;
    }

    public static function getQuestions()
    {
        $rep = new QuestionRepository();
        return $rep->all();
    }

}
