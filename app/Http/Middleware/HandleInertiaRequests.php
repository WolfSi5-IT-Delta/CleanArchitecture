<?php

namespace App\Http\Middleware;

use App\Packages\Common\Application\Services\MenuService;
use App\Packages\Utils\ConfigStorage;
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
            'tenant' => $tenant
        ]);

        $result = array_merge($result, [
            'notification' => [
                'position' => fn () => $request->session()->get('position'),
                'type' => fn () => $request->session()->get('type'),
                'header' => fn () => $request->session()->get('header'),
                'message' => fn () => $request->session()->get('message'),
            ],
        ]);

        if ($tenant) {

            // setting available Modules
            $tenant = app('currentTenant');
            $modules = json_decode($tenant?->options)?->modules ?? [];
            if (app()->isLocal() && empty($modules)) $modules = ['LC', 'OB', 'OP'];
            ConfigStorage::set('modules', $modules);

            $user = Auth::user();
            $result = array_merge($result, [
                'auth.user' => fn () => $user?->only('id', 'name', 'last_name', 'email', 'avatar', 'isAdmin'),
                'topMenu' => MenuService::buildTopMenu(),
                'userMenu' => MenuService::buildUserMenu(),
                'leftMenu' => MenuService::buildLeftMenu(),
            ]);
        }

        return $result;
    }
}
