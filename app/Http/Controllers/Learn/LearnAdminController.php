<?php

namespace App\Http\Controllers\Learn;

use App\Models\Answer;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\LearnCourseLesson;
use App\Models\LearnCurriculum;
use App\Models\Lesson;
use App\Models\Question;
use App\Packages\Common\Application\Events\PermissionAdded;
use App\Packages\Common\Application\Services\PermissionHistoryService;
use App\Packages\Common\Domain\PermissionDTO;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Learn\Infrastructure\Repositories\CourseRepository;
use App\Packages\Learn\Infrastructure\Repositories\LessonRepository;
use App\Packages\Learn\UseCases\LearnAdminService;
use App\Packages\Learn\UseCases\LearnService;
use Enforcer;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

// TODO refactor and optimize models usage
class LearnAdminController extends BaseController
{
    public function courses(Request $request)
    {

        // TODO: sorting
//        $orderBy = $request->orderby;
//        $sort = $request->sort;
        $perPage = $request->perpage ?? 3;

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
        $permissions = [];
        if ($id !== null) {
            $course = LearnService::getCourse($id);
            $permissions = AuthorisationService::preparePermissionsForEdit("LC$id");
        }

        $permissionHistory = (new PermissionHistoryService())->getPermissionHistory();

        return Inertia::render('Admin/Learning/EditCourse',
            compact('course', 'all_lessons', 'permissions', 'permissionHistory'));
    }

    public function saveCourse(Request $request, $id = null)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

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

            $permissions = $input['permissions'] ?? null;
            unset($input['permissions']);

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
            $id = $course->id; // if new

            // saving permissions
            if ($permissions) {
                $obj = "LC$id";
                $act = "read";
                AuthorisationService::removeFilteredPolicy(1, $obj, $act);
                foreach ($permissions as $perm) {
                    if ($perm['type'] == 'O') {
                        $sub = $perm['id'];
                    } else
                        $sub = $perm['type'] . $perm['id'];
                    AuthorisationService::addPolicy($sub, $obj, $act);
                    PermissionAdded::dispatch(new PermissionDTO(...$perm));
                }
            }

            if ($isNewCourse) {
                Enforcer::addPolicy('AU', "LC{$course->id}", 'read');
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

    // Lessons

    public function lessons(Request $request)
    {
        // TODO: sorting
        $orderBy = $request->orderby;
        $sort = $request->sort;
        $perPage = $request->perpage ?? 3;

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
        $lesson = Lesson::with('questions')->find($lid) ?? [];
        return Inertia::render('Admin/Learning/EditLesson', compact('lesson'));
    }

    public function updateLesson(Request $request, $lid = null)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $input = $request->all();
        $order = $input['order'] ?? [];

        Lesson::updateOrCreate(['id' => $lid], $input);

        foreach ($order as $item) {
            $currPivot = Question::find($item['id']);
            $currPivot->lesson_id = $item['lesson_id'];
            $currPivot->sort = $item['order'];
            $currPivot->save();
        }

        return redirect()->route('admin.lessons')->with([
            'type' => 'success',
            'message' => 'Lesson updated successfully!',
        ]);
    }

    public function deleteLesson(Request $request, $lid)
    {
        Lesson::find($lid)->delete();
        return redirect()->route('admin.lessons')->with([
            'type' => 'success',
            'message' => 'Lesson deleted successfully!',
        ]);;
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
            'type' => 'success',
            'message' => 'Lesson created successfully!',
        ]);
    }

    // Questions

    public function questions(Request $request, $lid)
    {
        $questions = Lesson::find($lid)->questions()->get();
        return Inertia::render('Admin/Learning/Questions', compact('questions', 'lid'));
    }

    public function editQuestion(Request $request, $lid, $qid = null)
    {
        $question = Question::find($qid);
        return Inertia::render('Admin/Learning/EditQuestion', compact('question', 'lid'));
    }

    public function updateQuestion(Request $request, $lid, $qid = null)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $input = $request->all();
        $input['lesson_id'] = $lid;
        Question::updateOrCreate(['id' => $qid], $input);

        $message = $qid ? 'Question updated successfully!' : 'Question created successfully!';
        return redirect()->route('admin.questions', [$lid])->with([
            'type' => 'success',
            'message' => $message,
        ]);
    }

    public function deleteQuestion(Request $request, $lid, $qid)
    {
        Question::find($qid)->delete();
        return redirect()->route('admin.questions', [$lid])->with([
            'type' => 'success',
            'message' => 'Question deleted successfully!',
        ]);;
    }

    // Answers

    public function answers(Request $request, $lid, $qid)
    {
        $question = Question::find($qid);
        if ($question->type == 'text') {
            return redirect()->back()->with([
                'type' => 'fail',
                'header' => 'Error',
                'message' => 'Answers are available only for non text question!',
            ]);;

        }
        $answers = Answer::where('question_id', $qid)->get();
        return Inertia::render('Admin/Learning/Answers', compact('answers', 'lid', 'qid'));
    }

    public function editAnswer(Request $request, $lid, $qid, $aid = null)
    {
        $answer = Answer::find($aid);
        return Inertia::render('Admin/Learning/EditAnswer', compact('answer', 'lid', 'qid'));
    }

    public function updateAnswer(Request $request, $lid, $qid, $aid = null)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $input = $request->all();
        $input['question_id'] = $qid;
        Answer::updateOrCreate(['id' => $aid], $input);

        $message = $aid ? 'Answer updated successfully!' : 'Answer created successfully!';
        return redirect()->route('admin.answers', [$lid, $qid])->with([
            'type' => 'success',
            'message' => $message,
        ]);
    }

    public function deleteAnswer(Request $request, $lid, $qid, $aid)
    {
        Answer::find($aid)->delete();
        return redirect()->route('admin.answers', [$lid, $qid])->with([
            'type' => 'success',
            'message' => 'Answer deleted successfully!',
        ]);
    }

    // Curriculums

    public function curriculums(Request $request)
    {
        $orderBy = $request->orderby ?? 'id';
        $sortBy = $request->sortby ?? 'asc';
        $perPage = $request->perpage ?? 10;

        $paginatedList = Curriculum::orderBy($orderBy, $sortBy)->paginate($perPage);

        if ($request->has('page')) {
             return $paginatedList;
        }

         return Inertia::render('Admin/Learning/Curriculums', compact('paginatedList'));
    }

    public function editCurriculum($id = null)
    {
        $all_courses = LearnService::getCourses();
        $all_courses = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $all_courses);
        $curriculum = [];
        if ($id !== null) {
            $curriculum = LearnService::getCurriculum($id);
        }

        $permissions = AuthorisationService::preparePermissionsForEdit("LP$id");
        $permissionHistory = (new PermissionHistoryService())->getPermissionHistory();

        return Inertia::render('Admin/Learning/EditCurriculum',
            compact('curriculum', 'all_courses', 'permissions', 'permissionHistory'));
    }

    public function updateCurriculum(Request $request, $id = null)
    {

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $isNew = $id === null;

        $changedFields = [];
        $input = $request->collect();
        $order = $request->get('order');

        $permissions = $input['permissions'] ?? null;
        unset($input['permissions']);

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $changedFields[$key] = $item;
            }
        }

        $curr = Curriculum::updateOrCreate(
            ['id' => $id],
            $changedFields
        );
        LearnCurriculum::where('curriculum_id', $id)->delete();

        foreach ($changedFields['courses'] as $index => $item) {
            $orderTemp = $curr->courses()->max('learn_course_curriculum.order') ? $curr->courses()->get()->max('learn_course_curriculum.order') + 1 : 1;
            $curr->courses()->attach([$item => ['order' => $orderTemp]]);
        }

        $curr->save();

        foreach ($order as $item) {
            $currPivot = LearnCurriculum::where('curriculum_id', $item['curriculum_id'])
                ->where('course_id', $item['course_id'])
                ->first();
            if ($currPivot) {
                $currPivot->order = $item['order'];
                $currPivot->save();
            }
        }

        // saving permissions
        if ($permissions) {
            $obj = "LP{$curr->id}";
            $act = "read";
            AuthorisationService::removeFilteredPolicy(1, $obj, $act);
            foreach ($permissions as $perm) {
                if ($perm['type'] == 'O') {
                    $sub = $perm['id'];
                } else
                    $sub = $perm['type'] . $perm['id'];
                AuthorisationService::addPolicy($sub, $obj, $act);
                PermissionAdded::dispatch(new PermissionDTO(...$perm));
            }
        }

        if ($isNew) Enforcer::addPolicy('AU', "LP{$curr->id}", 'read');

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
