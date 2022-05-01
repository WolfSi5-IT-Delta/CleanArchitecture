<?php

namespace App\Http\Controllers;

use App\Models\Common\Team;
use App\Models\User;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Learn\Infrastructure\Repositories\CourseRepository;
use App\Packages\Learn\Infrastructure\Repositories\LessonRepository;
use App\Packages\Learn\UseCases\LearnService;
use App\Packages\Learn\UseCases\LearnAdminService;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Curriculum;
use App\Models\LearnCourseLesson;
use App\Models\LearnCurriculum;
use App\Models\JournalLesson;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Enforcer;

// TODO refactor and optimize models usage
class LearnAdminController extends BaseController
{
    public function courses(Request $request)
    {

      // TODO: sorting
      $orderBy = $request->orderby;
      $sort = $request->sort;
      $perPage = $request->perpage;

      $rep = new CourseRepository();
      $list = $rep->paginate($perPage);

      if ($request->has('page')) { // response for pagination
          return $list;
      }

      return Inertia::render('Admin/Learning/Courses', [
          'paginatedCourses' => $list
      ]);

    }

    public function editCourse(Request $request, $id = null)
    {
        $all_lessons = LearnService::getLessons();
        $all_lessons = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $all_lessons);
        $course = [];
        if ($id !== null) {
            $course = LearnService::getCourse($id);
        }

        $allUsers = User::all()->map(fn ($user) => ([
            'type' => 'U',
            'id' => $user->id,
            'name' => $user->name.' '.$user->last_name
        ]));

        $allTeams = Team::all()->map(fn ($team) => ([
            'type' => 'T',
            'id' => $team->id,
            'name' => $team->name
        ]));

        $permissions = [];
        $permData = Enforcer::getFilteredPolicy(1, "LC$id");
        foreach ($permData as $value) {
            $sub = $value[0];
            if ($sub[0] == 'U') {
                $id = substr($sub, 1);
                $permissions[] = $allUsers->first(fn ($e) => ($e['id'] == $id));
            } elseif ($sub[0] == 'T') {
                $id = substr($sub, 1);
                $permissions[] = $allTeams->first(fn ($e) => ($e['id'] == $id));
            } elseif ($sub == 'AU') {
                $permissions[] = [
                    'type' => 'O',
                    'id' => 'AU',
                    'name' => 'All Users'
                ];
            }
        }

        $allPermissions = array_merge(
            $allUsers->toArray(),
            $allTeams->toArray(),
            [
                [
                    'type' => 'O',
                    'id' => 'AU',
                    'name' => 'All Users'
                ]
            ]
        );

        return Inertia::render('Admin/Learning/EditCourse',
            compact('course', 'all_lessons', 'permissions', 'allPermissions'));
    }

    public function saveCourse(Request $request, $id = null)
    {

        // saving data
        DB::transaction(function () use ($id, $request) {
            $isNewCourse = $id === null;
            $course = $id === null
                ? new Course
                : Course::find($id);
            $input = $request->collect();
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $imagePath = '/' . $request->image->store('images/' . explode('.', $_SERVER['HTTP_HOST'])[0] . '/course_images');
                $course->image = $imagePath;
            }

            // saving permissions
            $permissions = $input['permissions'] ?? null;
            unset($input['permissions']);
            if ($permissions) {
                $obj = "LC$id";
                $act = "read";
                AuthorisationService::removeFilteredPolicy(1, $obj, $act);
                foreach ($permissions as $perm) {
                    if ($perm['type'] == 'O') {
                        $sub = $perm['id'];
                    } else
                        $sub = $perm['type'].$perm['id'];
                    AuthorisationService::addPolicy($sub, $obj, $act);
                }
            }

            foreach ($input as $key => $item) {
                if ($item !== null) {
                    switch ($key) {
                        case 'lessons':
                            if ($id !== null) {
                                LearnCourseLesson::where('course_id', $id)->delete();
                            } else {
                                $course->save();
                                $id = $course->id;
                            }
                            foreach ($item as $lesson) {
                                $orderTemp = $course->lessons()->get()->max('pivot.order')
                                    ? $course->lessons()->get()->max('pivot.order') + 1
                                    : 1;
                                $course->lessons()->attach([$lesson => ['order' => $orderTemp]]);
                            }
                            break;
                        case 'order':
                            if ($id === null) {
                                $course->save();
                                $id = $course->id;
                            }
                            foreach ($item as $order) {
                                $coursePivot = LearnCourseLesson::where('lesson_id', $order['lesson_id'])
                                    ->where('course_id', $id === null ? $course->id : $order['course_id'])
                                    ->first();
                                if ($coursePivot) {
                                    $coursePivot->order = $order['order'];
                                    $coursePivot->save();
                                }
                            }
                            break;
                        default:
                            $course->$key = $item;
                            break;
                    }
                }
            }

            $course->save();
            if ($isNewCourse) {
                Enforcer::addPolicy('AU', "LC{$course->id}", 'read');
                Enforcer::addPolicy('AU', "LC{$course->id}", 'edit');
            }
        });

        return redirect()->route('admin.courses')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Course updated successfully!',
        ]);
    }

    public function deleteCourse(Request $request, $id)
    {
        Course::find($id)->delete();
        return redirect()->route('admin.courses');
    }

    public function lessons(Request $request)
    {
        // TODO: sorting
        $orderBy = $request->orderby;
        $sort = $request->sort;
        $perPage = $request->perpage ?? 10;

        $rep = new LessonRepository();
        $lessons = $rep->paginate($perPage);

        if ($request->has('page')) { // response for pagination
            return $lessons;
        }
        return Inertia::render('Admin/Learning/Lessons', [
            'paginatedLessons' => $lessons
        ]);
    }

    public function editLesson(Request $request, $lid = null)
    {
        $all_questions = json_decode(json_encode(LearnService::getQuestions()));
        $all_questions = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $all_questions);

        $lesson = [];
        if ($lid !== null) {
            $lesson = (array)LearnService::getLesson($lid);
        }
        return Inertia::render('Admin/Learning/EditLesson', compact('lesson', 'all_questions'));
    }

    public function saveLesson(Request $request, $lid)
    {
        $changedFields = [];
        $input = $request->collect();
        $order = $request->get('order');

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }
        Lesson::updateOrCreate(
            ['id' => $lid],
            $changedFields
        );

        foreach ($order as $item) {
            $currPivot = Question::find($item['id']);
            $currPivot->lesson_id = $item['lesson_id'];
            $currPivot->sort = $item['order'];
            $currPivot->save();
        }

        return redirect()->route('admin.lessons')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Lesson updated successfully!',
        ]);
    }

    public function deleteLesson(Request $request, $lid)
    {
        Lesson::find($lid)->delete();
        return redirect()->route('admin.lessons');
    }

    public function createLesson(Request $request)
    {
        $lesson = new Lesson;

        $input = $request->collect();
//        dd($input);

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $key !== 'questions' && $item !== null) {
                $lesson->$key = $item;
            }
        }

        $lesson->save();

        //        $course->lessons()->save($lesson);
        // TODO create standalone access rights element instead of adding rules directly
        Enforcer::addPolicy('AU', "LL{$lesson->id}", 'read');
        return redirect()->route('admin.lessons')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Lesson created successfully!',
        ]);
    }

    public function questions(Request $request, $lid)
    {
        $questions = Question::where('lesson_id', $lid)->get();
        return Inertia::render('Admin/Learning/Questions', compact('questions'));
    }

    public function editQuestion(Request $request, $lid, $qid = null)
    {
        $question = [];
        if ($qid !== null) {
            $questions = Question::where('lesson_id', $lid)->get()->all();
            $question = array_values(array_filter( $questions, function ($item) use ($qid) {
                return $item->id === (int) $qid;
            }))[0];
        }
        return Inertia::render('Admin/Learning/EditQuestion', compact('question'));
    }

    public function saveQuestion(Request $request, $lid, $qid)
    {
        $changedFields = [];
        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }
        Question::updateOrCreate(
            ['id' => $qid],
            $changedFields
        );
        return redirect()->route('admin.questions', [$lid])->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Question updated successfully!',
        ]);
    }

    public function deleteQuestion(Request $request, $lid, $qid)
    {
        Question::find($qid)->delete();
        return redirect()->route('admin.questions', [$lid]);
    }

    public function createQuestion(Request $request, $lid)
    {
        $lesson = Lesson::find($lid);
        $question = new Question;

        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $question->$key = $item;
            }
        }

        $lesson->questions()->save($question);
        return redirect()->route('admin.questions', [$lid])->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Question created successfully!',
        ]);
    }

    public function answers(Request $request, $lid, $qid)
    {
        $answers = Answer::where('question_id', $qid)->get();
        return Inertia::render('Admin/Learning/Answers', compact('answers'));
    }

    public function editAnswer(Request $request, $lid, $qid, $aid = null)
    {
        $answer = [];
        if ($aid !== null) {
            $answers = Answer::where('question_id', $qid)->get()->all();
            $answer = array_values(array_filter( $answers, function ($item) use ($aid) {
                return $item->id === (int) $aid;
            }))[0];
        }
        return Inertia::render('Admin/Learning/EditAnswer', compact('answer'));
    }

    public function saveAnswer(Request $request, $lid, $qid, $aid)
    {
        $changedFields = [];
        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }
        Answer::updateOrCreate(
            ['id' => $aid],
            $changedFields
        );
        return redirect()->route('admin.answers', [$lid, $qid])->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Answer updated successfully!',
        ]);
    }

    public function deleteAnswer(Request $request, $lid, $qid, $aid)
    {
        Answer::find($aid)->delete();
        return redirect()->route('admin.answers', [$lid, $qid]);
    }

    public function createAnswer(Request $request, $lid, $qid)
    {
        $question = Question::find($qid);
        $answer = new Answer;

        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $answer->$key = $item;
            }
        }

        $question->answers()->save($answer);
        return redirect()->route('admin.answers', [$lid, $qid])->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Answer created successfully!',
        ]);
    }

    public function curriculums(Request $request)
    {

        $curriculums = LearnService::getCurriculums(false);
        // dd($curriculums);
        $orderBy = $request->orderby;
        $sort = $request->sort;
        $perPage = $request->perpage;
        if ($request->has('page')) {

            // return Course::orderBy($orderBy ?? 'id', $sort ?? 'asc')->paginate($perPage ?? 10);
        }

        // return Inertia::render('Admin/Learning/Courses', [
        //     'paginatedCourses' => fn() => Course::orderBy($orderBy ?? 'id', $sort ?? 'asc')->paginate($perPage ?? 10)
        // ]);


        $curriculums = LearnService::getCurriculums(false);
        $curriculums = array_values($curriculums);
        return Inertia::render('Admin/Learning/Curriculums', compact('curriculums'));
    }

    public function createCurriculum(Request $request)
    {

        $changedFields = [];
        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }

        $curr = Curriculum::create($changedFields);
        foreach ($changedFields['courses'] as $item) {
            $curr->courses()->attach($item);
        }
        $curr->save();

        // TODO create standalone access rights element instead of adding rules directly
        Enforcer::addPolicy('AU', "LCU{$curr->id}", 'read');

        return redirect()->route('admin.curriculums')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Curriculums created successfully!',
        ]);
    }

    public function editCurriculum($id = null)
    {
        $all_courses = LearnService::getCourses();
        $all_courses = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $all_courses);
        $curriculum = [];
        if ($id !== null ) {
            $curriculum = LearnService::getCurriculum($id);
        }
        return Inertia::render('Admin/Learning/EditCurriculum', compact('curriculum','all_courses'));
    }

    public function saveCurriculum(Request $request, $id)
    {
        $changedFields = [];
        $input = $request->collect();
        $order = $request->get('order');

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }

        Curriculum::updateOrCreate(
            ['id' => $id],
            $changedFields
        );
        LearnCurriculum::where('curriculum_id', $id)->delete();
        $curr = Curriculum::find($id);

        foreach ($changedFields['courses'] as $index => $item) {
            $orderTemp = $curr->courses()->max('learn_course_curriculum.order') ? $curr->courses()->get()->max('learn_course_curriculum.order') + 1 : 1;
            $curr->courses()->attach([$item => ['order' => $orderTemp]]);
        }

        $curr->save();

        foreach ($order as $item) {
            $currPivot = LearnCurriculum::where('curriculum_id', $item['curriculum_id'])
                                        ->where('course_id', $item['course_id'])
                                        ->first();
            if($currPivot) {
                $currPivot->order = $item['order'];
                $currPivot->save();
            }
        }

        return redirect()->route('admin.curriculums')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Curriculum updated successfully!',
        ]);
    }

    public function deleteCurriculum(Request $request, $id)
    {
        Curriculum::find($id)->delete();
        return redirect()->route('admin.curriculums');
    }

//    public function respondentsAnswers()
//    {
//        $answers = JournalLesson::where('status', 'pending')->get();
//        $respondents = [];
//         foreach ($answers as $answer) {
//           $respondents[] = [
//               'user' => [
//                   'id' => $answer->user->id,
//                   'name' => $answer->user->name,
//               ],
//               'course' => [
//                   'id' => $answer->course->id,
//                   'name' => $answer->course->name,
//               ],
//               'lesson' => [
//                   'id' => $answer->lesson->id,
//                   'name' => $answer->lesson->name,
//               ],
//               'created_at' => $answer->created_at->toDateString(),
//           ];
//       }
//        return Inertia::render('Admin/Learning/RespondentsAnswers', compact('respondents'));
//    }

}
