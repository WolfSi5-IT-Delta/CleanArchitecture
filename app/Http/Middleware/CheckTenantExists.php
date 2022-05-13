<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Multitenancy\Models\Tenant;

class CheckTenantExists
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $url = parse_url(env('APP_URL'));
        $host = $url['host'];

        // public domain
        if ($host !== $request->getHost()) {
            // tenant domain
            if (!Tenant::checkCurrent()) abort(404);
        }

        return $next($request);
    }
}
