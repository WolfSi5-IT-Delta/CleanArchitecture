<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Spatie\Multitenancy\Models\Tenant;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        $tenant = Tenant::checkCurrent();

        $result = array_merge(parent::share($request), [
            'tenant' => Tenant::checkCurrent()
        ]);

        if ($tenant) {
            $result = array_merge($result, [
                'auth' => function () use ($request) {
                    return [
                        'user' => Auth::user()
                    ];
                },
                'userNavigation' => [
                    ['name' => 'Профайл', 'href' => '/profile'],
                    ['name' => 'Настройки', 'href' => '/admin'],
                    ['name' => 'Пригласить', 'href' => '/invite-user'],
                    ['name' => 'Выход', 'href' => '/logout'],
                ],
                'flash' => [
                    'test' => fn () => $request->session()->get('test'),
                    'lessonCheckMessage' => fn () => $request->session()->get('lessonCheckMessage'),
                    'nextLessonId' => fn () => $request->session()->get('nextLessonId'),
                    'dataUpdated' => fn () => $request->session()->get('dataUpdated'),
                ],
                'notification' => [
                    'position' => fn () => $request->session()->get('position'),
                    'type' => fn () => $request->session()->get('type'),
                    'header' => fn () => $request->session()->get('header'),
                    'message' => fn () => $request->session()->get('message'),
                ],
            ]);
        }

        return $result;
    }
}
