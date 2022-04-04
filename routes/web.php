<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\LearnAdminController;
use App\Http\Controllers\LearnController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccessController;
use App\Http\Controllers\Learn\TeacherController;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
//use Enforcer;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/Index');
})->name('home');

Route::middleware(['auth'])->group(function () {

    Route::prefix('learning')->group(function () {
        Route::get('/courses', [LearnController::class, 'index'])
            ->name('courses');

        Route::get('/programs', [LearnController::class, 'index'])
            ->name('programs');

        Route::get('/course/{id}', [LearnController::class, 'course'])
            ->name('course');

        Route::get('/course/{cid}/lesson/{id}', [LearnController::class, 'lesson'])
            ->name('lesson');
        Route::post('/course/{cid}/lesson/{id}', [LearnController::class, 'checkLesson'])
            ->name('check-lesson');

        Route::get('/course/{id}/success', [LearnController::class, 'success'])
        ->name('success');

    });

    Route::redirect('/learning', '/learning/courses')->name('learning');

    Route::get('/profile', [UserController::class, 'profile'])
        ->name('profile');

    Route::post('/profile/edit', [UserController::class, 'edit']);

//    Route::post('/portal/{id}', [UserController::class, 'setPortal'])
//        ->name('setPortal');



});

// admin panel
Route::middleware(['auth'])->group(function () {

    Route::prefix('admin')->group(function () {

        // Common part
        Route::get('/access', [AccessController::class, 'index'])
            ->name('admin.access');

        Route::get('/departments', [AdminController::class, 'departments'])
            ->name('admin.departments');

        Route::get('/departments/create', [AdminController::class, 'editDepartment'])
            ->name('admin.department.create');

        Route::post('/departments/create', [AdminController::class, 'createDepartment'])
            ->name('admin.department.create');

        Route::get('/departments/{id}', [AdminController::class, 'editDepartment'])
            ->name('admin.department.edit');

        Route::post('/departments/{id}', [AdminController::class, 'saveEditedDepartment'])
            ->name('admin.department.edit');

        Route::post('/departments/{id}/delete', [AdminController::class, 'deleteDepartment'])
            ->name('admin.department.delete');


        // Learn package
        Route::get('/', function () {
            return redirect()->route('admin.courses');
        })->name('admin.index');

        Route::get( '/courses', [LearnAdminController::class, 'courses'])
            ->name('admin.courses');

        Route::get('/courses/create', [LearnAdminController::class, 'editCourse'])
            ->name('admin.course.create');

        Route::post('/courses/create', [LearnAdminController::class, 'createCourse'])
            ->name('admin.course.create');

        Route::get('/courses/{id}', [LearnAdminController::class, 'editCourse'])
            ->name('admin.course.edit');

        Route::post('/courses/{id}', [LearnAdminController::class, 'saveEditedCourse'])
            ->name('admin.course.edit');

        Route::post('/courses/{id}/delete', [LearnAdminController::class, 'deleteCourse'])
            ->name('admin.course.delete');

        Route::get( '/lessons', [LearnAdminController::class, 'lessons'])
            ->name('admin.lessons');

        Route::get('/lessons/create', [LearnAdminController::class, 'editLesson'])
            ->name('admin.lesson.create');

        Route::post('/lessons/create', [LearnAdminController::class, 'createLesson'])
            ->name('admin.lesson.create');

        Route::get('/lessons/{lid}', [LearnAdminController::class, 'editLesson'])
            ->name('admin.lesson.edit');

        Route::post('/lessons/{lid}', [LearnAdminController::class, 'saveEditedLesson'])
            ->name('admin.lesson.edit');

        Route::post('/lessons/{lid}/delete', [LearnAdminController::class, 'deleteLesson'])
            ->name('admin.lesson.delete');

        Route::get( '/lessons/{lid}/questions', [LearnAdminController::class, 'questions'])
            ->name('admin.questions');

        Route::get('/lessons/{lid}/questions/create', [LearnAdminController::class, 'editQuestion'])
            ->name('admin.question.create');

        Route::post('/lessons/{lid}/questions/create', [LearnAdminController::class, 'createQuestion'])
            ->name('admin.question.create');

        Route::get('/lessons/{lid}/questions/{qid}', [LearnAdminController::class, 'editQuestion'])
            ->name('admin.question.edit');

        Route::post('/lessons/{lid}/questions/{qid}', [LearnAdminController::class, 'saveEditedQuestion'])
            ->name('admin.question.edit');

        Route::post('/lessons/{lid}/questions/{qid}/delete', [LearnAdminController::class, 'deleteQuestion'])
            ->name('admin.question.delete');

        Route::get('/lessons/{lid}/questions/{qid}/answers', [LearnAdminController::class, 'answers'])
            ->name('admin.answers');

        Route::get('/lessons/{lid}/questions/{qid}/answers/create', [LearnAdminController::class, 'editAnswer'])
            ->name('admin.answer.create');

        Route::post('/lessons/{lid}/questions/{qid}/answers/create', [LearnAdminController::class, 'createAnswer'])
            ->name('admin.answer.create');

        Route::get('/lessons/{lid}/questions/{qid}/answers/{aid}', [LearnAdminController::class, 'editAnswer'])
            ->name('admin.answer.edit');

        Route::post('/lessons/{lid}/questions/{qid}/answers/{aid}', [LearnAdminController::class, 'saveEditedAnswer'])
            ->name('admin.answer.edit');

        Route::post('/lessons/{lid}/questions/{qid}/answers/{aid}/delete', [LearnAdminController::class, 'deleteAnswer'])
            ->name('admin.answer.delete');

         Route::get('/curriculums', [LearnAdminController::class, 'curriculums'])
            ->name('admin.curriculums');

        Route::get('/curriculums/create', [LearnAdminController::class, 'editCurriculum'])
            ->name('admin.curriculum.create');

        Route::post('/curriculums/create', [LearnAdminController::class, 'createCurriculum'])
            ->name('admin.curriculum.create');

        Route::get('/curriculums/{id}', [LearnAdminController::class, 'editCurriculum'])
            ->name('admin.curriculum.edit');

        Route::post('/curriculums/{id}', [LearnAdminController::class, 'saveEditedCurriculum'])
            ->name('admin.curriculum.edit');

        Route::post('/curriculums/{id}/delete', [LearnAdminController::class, 'deleteCurriculum'])
            ->name('admin.curriculum.delete');

        Route::get('/users', [AdminController::class, 'users'])
            ->name('admin.users');

        Route::get('/user/create', [AdminController::class, 'editUser'])
            ->name('admin.user.create');

        Route::post('/user/create', [AdminController::class, 'createUser'])
            ->name('admin.user.create');

        Route::get('/user/{id}', [AdminController::class, 'editUser'])
            ->name('admin.user.edit');

        Route::post('/user/{id}', [AdminController::class, 'saveEditedUser'])
            ->name('admin.user.edit');

        Route::post('/user/{id}/delete', [AdminController::class, 'deleteUser'])
            ->name('admin.user.delete');

        // Teacher part
        Route::prefix('teacher')->group(function () {

            // lessons in pending state
            Route::get('/lessons', [TeacherController::class, 'lessons'])
                ->name('admin.teacher.lessons');
        });

        Route::get('/respondent-answers', [LearnAdminController::class, 'respondentsAnswers'])
            ->name('admin.respondent.answers');

        // Route::get('/respondent-answer/{id}', [LearnAdminController::class, 'respondentAnswer'])
        //     ->name('admin.respondent.answer.');

    });

});

// Bitrix24 integration
// Route::get('/bitrix24', fn() => Socialite::driver('bitrix24')->redirect())
//    ->name('bitrix24');
Route::get('/auth/bitrix24/callback', function (Request $request) {
    \App\Packages\Common\Infrastructure\Integrations\IntegrationService::setConfig();
    $bitrix24_user = Socialite::driver('bitrix24')->user();
    $user = User::updateOrCreate(
        [
            'email' => $bitrix24_user->email
        ],
        [
            'name'  =>  $bitrix24_user->name,
            'password' => md5(rand(1, 10000)),
        ]
    );
    Enforcer::addRoleForUser("U$user->id", 'AU');

    Auth::login($user, true);
    session()->invalidate();

    return redirect()->intended(RouteServiceProvider::HOME);

});


require __DIR__ . '/auth.php';
