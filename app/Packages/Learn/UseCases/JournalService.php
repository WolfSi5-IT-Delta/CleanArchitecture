<?php

namespace App\Packages\Learn\UseCases;

use App\Packages\Learn\Entities\JournalLesson;
use App\Packages\Learn\Entities\Lesson;
use App\Packages\Learn\Infrastructure\Repositories\JournalLessonRepository;
use App\Packages\Learn\Infrastructure\Repositories\QuestionRepository;
use App\Packages\Learn\Entities\QuestionType;
use phpDocumentor\Reflection\Types\Callable_;

class CourseStatus
{
    public const NEW = "new";
    public const IN_PROGRESS = "in_progress";
    public const DONE = "done";
}

class LessonStatus
{
    public const PENDING = "pending";
    public const DONE = "done";
    public const FAIL = "fail";
    public const BLOCKED = "blocked";
}

class JournalService
{
    public static function getLesson(int $lid): JournalLesson|null
    {
        $user_id = auth()->user()->id;
        $rep = new JournalLessonRepository();
        $rec = $rep->query(fn ($model) => ( $model->where([
                'user_id' => $user_id,
                'lesson_id' => $lid
            ])))->all()[0];
        return $rec;
    }

    public static function getLessonsStatuses(): array|null
    {
        $user_id = auth()->user()->id;
        $rep = new JournalLessonRepository();
        $rec = $rep->query(fn ($model) => ($model->where([
            'user_id' => $user_id
        ])))->all();
        $rec = array_map(function ($item) {
          return ['id' => $item->lesson_id, 'status' => $item-> status];
        }, $rec);
        return $rec;
    }

    public static function getAnswers(int $lid): array
    {
        $rec = self::getLesson($lid);
        return $rec?->answers ?? [];
    }

    /**
     * Store answers for a lesson
     * @param int $cid
     * @param int $lid
     * @param \stdClass $answers
     */
    public static function storeAnswers(int $cid, int $lid, array $answers): void
    {
        $rec = self::getLesson($lid);
        $user_id = auth()->user()->id;
        $tries = $rec?->tries ? $rec->tries + 1 : 1;

        $data = [
            'user_id' => $user_id,
            'course_id' => $cid,
            'lesson_id' => $lid,
            'tries' => $tries,
            'answers' => json_encode($answers),
        ];

        $rep = new JournalLessonRepository();
        if (!$rec)
            $rec = $rep->create($data);
        else
            $rep->update($data, $rec->id);
    }

    public static function getCourseStatus(int $id): string
    {
        return CourseStatus::DONE;
    }

    public static function setCourseStatus(int $id, string $status)
    {
        return LessonStatus::DONE;
    }

    public static function getLessonStatus(int $lid): string|null
    {
        $rec = self::getLesson($lid);
        return $rec?->status;
    }

    public static function setLessonStatus(int $lid, string $status): void
    {
        $rec = self::getLesson($lid);
        $user_id = auth()->user()->id;
        $data = [
            'user_id' => $user_id,
            'lesson_id' => $lid,
            'status' => $status
        ];

        $rep = new JournalLessonRepository();
        if (!$rec)
            $rec = $rep->create($data);
        else {
            if ($rec->status !== $status)
                $rec = $rep->update($data, $rec->id);
        }
    }

    public static function getLessonsForTeacher()
    {
        $result = [];

        $rep = new JournalLessonRepository();
        $lessons = $rep->query(fn ($model) => ( $model->where([
                'status' => LessonStatus::PENDING
            ])))->all();

        $rep = new QuestionRepository();
        foreach ($lessons as $lesson) {
          $questions = $rep->query(fn ($model) => ( $model->where([
                  'lesson_id' => $lesson->id,
                  'type' => QuestionType::TEXT
              ])))->all();

          // make array "q3" => {question}
          $arr1 = [];
          foreach ($questions as $question) {
            $arr1["q{$question->id}"] = $question;
          }

          // check if the answer is text type
          $textAnswers = array_intersect_key($arr1, $lesson->answers);
          foreach ($textAnswers as $key => $value) {
            $result[] = [
              'user_id' => $lesson->user_id,
              'course_id' => $lesson->course_id,
              'lesson_id' => $lesson->lesson_id,
              'tries' => $lesson->tries,
              'instructor_id' => $lesson->instructor_id,
              'comment' => $lesson->comment,
              'question' => $arr1[$key],
              'answer' => [
                'id' => $key,
                'text' => $lesson->answers[$key]
              ],
              'updated_at' => $lesson->updated_at
            ];
          }
        }

        return $result;
    }
}
