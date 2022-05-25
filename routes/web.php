<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Common\AdminUserController;
use App\Http\Controllers\Common\UserController;
use App\Http\Controllers\OrgBoard\DepartmentController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Learn\LearnAdminController;
use App\Http\Controllers\AccessController;
use App\Http\Controllers\Learn\TeacherController;
use App\Http\Controllers\Learn\LearnController;
use App\Http\Controllers\Common\TeamController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Spatie\Multitenancy\Http\Middleware\NeedsTenant;
use Spatie\Multitenancy\Models\Tenant;


// ****************************
// public routes
// ****************************

Route::middleware('tenant.exists')->group(function () {

    Route::get('/', function () {
        return Inertia::render('Public/Index');
    })->name('home');

    Route::get('/register', [RegisteredUserController::class, 'create'])
//        ->middleware('guest')
        ->name('register');

    Route::post('/register', [RegisteredUserController::class, 'store']);
//        ->middleware('guest');

});


Route::middleware(['tenant', 'auth'])->group(function () {

    // ****************************
    // user's section
    // ****************************

    Route::get('/profile', [UserController::class, 'profile'])
        ->name('profile');

    Route::post('/profile/edit', [UserController::class, 'edit']);

    Route::prefix('learning')->middleware('package.check:LC')->group(function () {

        Route::redirect('/', '/learning/courses')->name('learning');

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

    // ****************************
    // admin panel
    // ****************************

    Route::prefix('admin')->group(function () {

        // Common part
        Route::get('/', function () {
            return redirect()->route('admin.courses');
        })->name('admin.index');

        Route::get('/access', [AccessController::class, 'index'])
            ->name('admin.access');

        // User part
        Route::prefix('user')->group(function () {

            Route::get('/', [AdminUserController::class, 'users'])
                ->name('admin.users');

            Route::get('/create', [AdminUserController::class, 'editUser'])
                ->name('admin.user.create');

            Route::get('/{id}', [AdminUserController::class, 'editUser'])
                ->name('admin.user.edit');

            Route::post('/create', [AdminUserController::class, 'updateUser']);

            Route::post('/{id}', [AdminUserController::class, 'updateUser'])
                ->name('admin.user.update');

            Route::post('/{id}/delete', [AdminUserController::class, 'deleteUser'])
                ->name('admin.user.delete');

        });

        // Teams part
        Route::prefix('teams')->group(function () {

            Route::get('/', [TeamController::class, 'teams'])
                ->name('admin.teams');

            Route::get('/create', [TeamController::class, 'edit'])
                ->name('admin.team.create');

            Route::get('/{id}', [TeamController::class, 'edit'])
                ->name('admin.team.edit');

            Route::post('/create', [TeamController::class, 'update']);

            Route::post('/{id}', [TeamController::class, 'update'])
                ->name('admin.team.update');

            Route::post('/{id}/delete', [TeamController::class, 'delete'])
                ->name('admin.team.delete');

        });

        // ********** ORGBOARD Package **********
        Route::middleware('package.check:OB')->group(function () {
            // Departments part
            Route::prefix('departments')->group(function () {

                Route::get('/', [DepartmentController::class, 'index'])
                    ->name('admin.departments');

                Route::get('/create', [DepartmentController::class, 'edit'])
                    ->name('admin.department.create');

                Route::post('/create', [DepartmentController::class, 'update']);

                Route::get('/{id}', [DepartmentController::class, 'edit'])
                    ->name('admin.department.edit');

                Route::post('/{id}', [DepartmentController::class, 'update'])
                    ->name('admin.department.update');

                Route::post('/{id}/delete', [DepartmentController::class, 'delete'])
                    ->name('admin.department.delete');

            });
        });

        // ********** LEARNING CENTER package **********
        Route::middleware('package.check:LC')->group(function () {
            // Courses part
            Route::prefix('courses')->group(function () {

                Route::get( '/', [LearnAdminController::class, 'courses'])
                    ->name('admin.courses');

                Route::get('/create', [LearnAdminController::class, 'editCourse'])
                    ->name('admin.course.create');

                Route::post('/create', [LearnAdminController::class, 'updateCourse']);

                Route::get('/{id}', [LearnAdminController::class, 'editCourse'])
                    ->name('admin.course.edit');

                Route::post('/{id}', [LearnAdminController::class, 'updateCourse']);

                Route::post('/{id}/delete', [LearnAdminController::class, 'deleteCourse'])
                    ->name('admin.course.delete');
            });

            // Lessons

            Route::prefix('lessons')->group(function () {
                Route::get( '/', [LearnAdminController::class, 'lessons'])
                    ->name('admin.lessons');

                Route::get('/create', [LearnAdminController::class, 'editLesson'])
                    ->name('admin.lesson.create');

                Route::post('/create', [LearnAdminController::class, 'updateLesson']);

                Route::get('/{lid}', [LearnAdminController::class, 'editLesson'])
                    ->name('admin.lesson.edit');

                Route::post('/{lid}', [LearnAdminController::class, 'updateLesson']);

                Route::post('/{lid}/delete', [LearnAdminController::class, 'deleteLesson'])
                    ->name('admin.lesson.delete');

                // Questions

                Route::get( '/{lid}/questions', [LearnAdminController::class, 'questions'])
                    ->name('admin.questions');

                Route::get('/{lid}/questions/create', [LearnAdminController::class, 'editQuestion'])
                    ->name('admin.question.create');

                Route::post('/{lid}/questions/create', [LearnAdminController::class, 'updateQuestion']);

                Route::get('/{lid}/questions/{qid}', [LearnAdminController::class, 'editQuestion'])
                    ->name('admin.question.edit');

                Route::post('/{lid}/questions/{qid}', [LearnAdminController::class, 'updateQuestion']);

                Route::post('/{lid}/questions/{qid}/delete', [LearnAdminController::class, 'deleteQuestion'])
                    ->name('admin.question.delete');

                // Answers

                Route::get('/{lid}/questions/{qid}/answers', [LearnAdminController::class, 'answers'])
                    ->name('admin.answers');

                Route::get('/{lid}/questions/{qid}/answers/create', [LearnAdminController::class, 'editAnswer'])
                    ->name('admin.answer.create');

                Route::post('/{lid}/questions/{qid}/answers/create', [LearnAdminController::class, 'updateAnswer']);

                Route::get('/{lid}/questions/{qid}/answers/{aid}', [LearnAdminController::class, 'editAnswer'])
                    ->name('admin.answer.edit');

                Route::post('/{lid}/questions/{qid}/answers/{aid}', [LearnAdminController::class, 'updateAnswer']);

                Route::post('/{lid}/questions/{qid}/answers/{aid}/delete', [LearnAdminController::class, 'deleteAnswer'])
                    ->name('admin.answer.delete');

            });

            // Curriculums part
            Route::prefix('curriculums')->group(function () {

                Route::get('/', [LearnAdminController::class, 'curriculums'])
                    ->name('admin.curriculums');

                Route::get('/create', [LearnAdminController::class, 'editCurriculum'])
                    ->name('admin.curriculum.create');

                Route::post('/create', [LearnAdminController::class, 'saveCurriculum']);

                Route::get('/{id}', [LearnAdminController::class, 'editCurriculum'])
                    ->name('admin.curriculum.edit');

                Route::post('/{id}', [LearnAdminController::class, 'saveCurriculum']);

                Route::post('/{id}/delete', [LearnAdminController::class, 'deleteCurriculum'])
                    ->name('admin.curriculum.delete');
            });

            // Teacher part
            Route::prefix('teacher')->group(function () {

                // lessons in pending state
                Route::get('/lessons', [TeacherController::class, 'getTeacherLessons'])
                    ->name('admin.teacher.lessons');

                Route::get('/{id}', [TeacherController::class, 'getAnswer'])
                    ->name('admin.teacher.lesson');

                Route::post('/{id}', [TeacherController::class, 'postAnswer']);
            });

        });

    });


});




// api resources
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/resource-users', [AccessController::class, 'getResourceUsers'])->name('access.getResourceUsers');

    // routes to provide search results
    Route::get('/users', [SearchController::class, 'getAllUsers'])->name('getAllUsers');
    Route::get('/teams', [SearchController::class, 'getAllTeams'])->name('getAllTeams');
    Route::get('/departments', [SearchController::class, 'getAllDepartments'])-> name('getAllDepartments');
    Route::get('/courses', [SearchController::class, 'getAllCourses'])-> name('getAllCourses');
    Route::get('/lessons', [SearchController::class, 'getAllLessons'])-> name('getAllLessons');
});

// Bitrix24 integration
// Route::get('/bitrix24', fn() => Socialite::driver('bitrix24')->redirect())
//    ->name('bitrix24');

Route::get('/auth/bitrix24/callback', function (Request $request) {
    \App\Packages\Common\Infrastructure\Integrations\IntegrationService::setConfig();
    $bitrix24_user = Socialite::driver('bitrix24')->user();

    $user = User::where('email', $bitrix24_user->email)->first();

    if(!$user) {
        $user = User::updateOrCreate(
            [
                'email' => $bitrix24_user->email
            ],
            [
                'name'  =>  $bitrix24_user->user['NAME'],
                'last_name'  =>  $bitrix24_user->user['LAST_NAME'],
                'phone'  =>  $bitrix24_user->user['PERSONAL_MOBILE'],
                'avatar'  =>  $bitrix24_user->user['PERSONAL_PHOTO'],
                'password' => md5(rand(1, 10000)),
            ]
        );
        Enforcer::addRoleForUser("U$user->id", 'AU');
    }

    Auth::login($user, true);
    session()->invalidate();

    return redirect()->intended(route('learning'));

});


require __DIR__ . '/auth.php';

//$path = base_path();
//dd("php $path/artisan tenants:artisan migrate --tenant=333");
//logger(Tenant::current()?->name);
//dd($_SERVER);
//dd(\request()->user());


