<?php

namespace App\Http\Controllers\Common;

use App\Models\Common\Team;
use App\Models\Department;
use App\Notifications\UserInvite;
use App\Packages\Common\Application\Services\PermissionHistoryService;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Multitenancy\Models\Tenant;
use App\Packages\Utils\Helpers;
use Illuminate\Validation\Rules;
use App\Packages\Common\Application\Services\UserInvitationService;

class UserController extends BaseController
{
    /**
     * User profile.
     *
     * @return \Inertia\Response
     */
    public function profile()
    {
        $user = Auth::user();
        $roles = AuthorisationService::prepareRolesForEdit("U{$user->id}");
        return Inertia::render('Pages/Profile', compact('user', 'roles'));
    }

    public function update(Request $request)
    {
        $input = $request->all();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'exists:users'],
        ]);

        // user changes password
        if ($input['password']) {
            $request->validate([
                'password' => [Rules\Password::defaults()],
            ]);
            $input['password'] = Hash::make($input['password'], ['rounds' => 12]);
        } else {
            unset($input['password']);
        }

        // avatar
        $oldFile = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // old avatar
            $oldFile = Auth::user()->avatar;
            $tenant = app('currentTenant')->name;
            $avatarPath = '/' . $request->avatar->store('images/'. $tenant .'/avatars');
            $input['avatar'] = $avatarPath;
        }

        User::updateOrCreate(
            ['id' => Auth::user()->id],
            $input
        );

        // delete old avatar
        if ($oldFile) Storage::delete($oldFile);


        return back();
    }


    // ****************************
    // Inviting
    // ****************************
    public function inviteCreate(Request $request)
    {
        $permissionHistory = (new PermissionHistoryService())->getPermissionHistory();
        return Inertia::render('Pages/InviteUser', compact('permissionHistory'));
    }

    public function inviteSend(Request $request, UserInvitationService $uis)
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        ]);

        $email = $request->email;
        $permissions = $request->permissions;

        $uis->sendInvite($email, $permissions);

        return back()->with(Helpers::notify("User $email has been invited successfully!"));
    }

    public function inviteAccept(Request $request, UserInvitationService $uis)
    {
        if ($request->isMethod('post')) {

            $request->validate([
                'email' => 'required|string|email|max:255|unique:users,email',
                'name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'phone' => 'max:255',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $avatarPath = '';
            if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
                $avatarPath = '/' . $request->avatar->store('images/'. explode('.', $_SERVER['HTTP_HOST'])[0].'/avatars');
            }

            $user = User::firstOrCreate(['email' => $request->email], [
                'name' => $request->name,
                'last_name' => $request->last_name,
                'phone' => $request->phone ?? '',
                'password' => Hash::make($request->password),
                'avatar' => $avatarPath
            ]);

            $uis->acceptInvite($user['email'], $user['id']);

            $permissions = collect($request->permissions);
            $permissions->each(function ($e) use ($user) {
                if ($e['type'] == 'T') {
                    $team = Team::find($e['id']);
                    if ($team) {
                        $team->users()->sync($user->id);
                    }
                } elseif ($e['type'] == 'D') {
                    $dep = Department::find($e['id']);
                    if ($dep) {
                        $dep->users()->sync($user->id);
                    }

                }
            });

            Auth::login($user);

            return redirect(RouteServiceProvider::HOME)->with(Helpers::notify("You have registered successfully!"));

        } else {
            $user = $request->all();

            // check if user has already registered
            $rec = User::where('email', $user['email'])->first();
            if ($rec) {
                return redirect(route('login'))->with('status', 'You have already registered, please log in.');
            }

            // not yet, let fill user's data
            return Inertia::render("Public/RegisterUserByInvite", compact('user'));
        }
    }

    public function justRegistered(Request $request, string $token)
    {
        if ($token) {
            $tenant = Tenant::where('just_created_token', $token)->first();
            logger('First login: '.$tenant->name);
            if ($tenant) {
                $user = User::findOrFail(1);
                Auth::login($user);
                $tenant->just_created_token = null;
                $tenant->save();
                event(new Registered($user));
            }
        }

        return redirect()->intended(RouteServiceProvider::HOME);
    }
}
