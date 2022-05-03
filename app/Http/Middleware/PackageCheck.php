<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Packages\Utils\ConfigStorage;
use Symfony\Component\HttpFoundation\Response;

class PackageCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$packages)
    {
        $modules = ConfigStorage::get('modules', []);
        foreach ($packages as $value) {
            if (!in_array($value, $modules))
                abort(Response::HTTP_UNAUTHORIZED, 'You don\'t have access to this package.');
        }

        return $next($request);
    }
}
