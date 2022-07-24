<?php

namespace App\Packages\Learn\UseCases;

use App\Models\JournalLesson;
use App\Models\Course;
use App\Packages\Learn\Infrastructure\Repositories\JournalLessonRepository;

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
    public static function getLesson(int $cid, int $lid): JournalLesson|null
    {
        $user_id = auth()->user()->id;
        $rec = JournalLesson::where([
            'user_id' => $user_id,
            'course_id' => $cid,
            'lesson_id' => $lid
        ])->first();

        return $rec;
    }

    public static function getLessonsStatuses(int $cid): array|null
    {
        $user_id = auth()->user()->id;

        $rec = JournalLesson::select('lesson_id as id', 'status')
            ->where([
                'user_id' => $user_id,
                'course_id' => $cid,
            ])
            ->get()
            ->toArray();

//        $rep = new JournalLessonRepository();
//        $rec = $rep->query(fn ($model) => ($model->where([
//            'user_id' => $user_id
//        ])))->all();
//
//        $rec = array_map(function ($item) {
//          return ['id' => $item->lesson_id, 'status' => $item-> status];
//        }, $rec);
        return $rec;
    }

    public static function getAnswers(int $cid, int $lid): array
    {
        $rec = self::getLesson($cid, $lid);
        $answers = json_decode($rec?->answers, true) ?? [];
        return $answers;
    }

    /**
     * Store answers for a lesson
     * @param int $cid
     * @param int $lid
     * @param \stdClass $answers
     */
    public static function storeAnswers(int $cid, int $lid, array $answers): void
    {
        $user_id = auth()->user()->id;

        $rec = self::getLesson($cid, $lid);
        if (!$rec) $rec = \App\Models\JournalLesson::create([
            'user_id' => $user_id,
            'course_id' => $cid,
            'lesson_id' => $lid,
        ]);

        $rec->tries = $rec->tries ? $rec->tries + 1 : 1;
        $rec->answers = json_encode($answers);
        $rec->save();
    }

//    public static function getCourseStatus(int $id): string
//    {
//        return CourseStatus::DONE;
//    }
//
//    public static function setCourseStatus(int $id, string $status)
//    {
//        return LessonStatus::DONE;
//    }

    public static function getLessonStatus(int $cid, int $lid): string|null
    {
        $user_id = auth()->user()->id;
        $rec = \App\Models\JournalLesson::where([
            'user_id' => $user_id,
            'course_id' => $cid,
            'lesson_id' => $lid
        ])->first();

        return $rec?->status;
    }

    public static function setLessonStatus(int $cid, int $lid, string $status): void
    {
        $user_id = auth()->user()->id;

        \App\Models\JournalLesson::updateOrCreate([
            'user_id' => $user_id,
            'course_id' => $cid,
            'lesson_id' => $lid
        ], [ 'status' => $status ]);

    }

    /**
     * Course progress
     *
     * @param int $uid
     * @param int $cid
     */
    public function getCourseProgress(int $uid, int $cid): int
    {
        $course = Course::with(['lessons'])->find($cid);

        $all = $course->lessons()->count();
       
        $done = 0;
        $percent = 0;

        $course->lessons()->each(function ($e) use (&$done, $uid, $cid) {
            $res = JournalLesson::where([
                'user_id' => $uid,
                'course_id' => $cid,
                'lesson_id' => $e->id,
                'status' => 'done'
            ])->count();
            if ($res) {
                $done++;
            }
        });

        if ($all !== 0 && $done !== 0)
        {
            $percent = intval(floatval($done / $all) * 100);
        }
        return $percent;
    }
     /**
     * Is course started
     *
     * @param int $uid
     * @param int $cid
     */
    public function isCourseStarted(int $uid, int $cid): bool {
        $res = JournalLesson::where([
            'user_id' => $uid,
            'course_id' => $cid,
        ])->count();

        return $res > 0;
    }


/*    public static function getLessonsForTeacher()
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
    }*/


}
