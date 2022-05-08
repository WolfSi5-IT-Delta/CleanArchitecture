<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Multitenancy\Models\Concerns\UsesTenantModel;
use Spatie\Multitenancy\Models\Tenant;

class RegisteredUserController extends Controller
{
    use UsesTenantModel;

    /**
     * Display the registration view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', /*'unique:users'*/],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        //create new tenant
        Tenant::forgetCurrent();
        $id = Artisan::call('cp:create_tenant');
        $tenant = $this->getTenantModel()->findOrFail($id);
        $tenant->makeCurrent();

        // create the first admin user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // go to the new portal
        $url = parse_url(env('APP_URL'));
        $url['host'] = $tenant->domain;
        $path = $this->reverse_parse_url($url);
        return redirect()->away($path.'/just-registered/'.$tenant->just_created_token, 302);
    }

    private function reverse_parse_url(array $parts)
    {
        $url = '';
        if (!empty($parts['scheme'])) {
            $url .= $parts['scheme'] . ':';
        }
        if (!empty($parts['user']) || !empty($parts['host'])) {
            $url .= '//';
        }
        if (!empty($parts['user'])) {
            $url .= $parts['user'];
        }
        if (!empty($parts['pass'])) {
            $url .= ':' . $parts['pass'];
        }
        if (!empty($parts['user'])) {
            $url .= '@';
        }
        if (!empty($parts['host'])) {
            $url .= $parts['host'];
        }
        if (!empty($parts['port'])) {
            $url .= ':' . $parts['port'];
        }
        if (!empty($parts['path'])) {
            $url .= $parts['path'];
        }
        if (!empty($parts['query'])) {
            if (is_array($parts['query'])) {
                $url .= '?' . http_build_query($parts['query']);
            } else {
                $url .= '?' . $parts['query'];
            }
        }
        if (!empty($parts['fragment'])) {
            $url .= '#' . $parts['fragment'];
        }

        return $url;
    }
}
