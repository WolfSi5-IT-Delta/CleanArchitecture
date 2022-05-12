<?php

namespace App\Http\Controllers\Common;

use App\Notifications\UserInvite;
use App\Packages\Common\Application\Services\PermissionHistoryService;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Multitenancy\Models\Tenant;
use App\Packages\Utils\Helpers;
use Illuminate\Validation\Rules;

class UserController extends BaseController
{
    /**
     * User profile.
     *
     * @return \Inertia\Response
     */
    public function profile()
    {
        //        dd(Auth::user());
        return Inertia::render('Pages/Profile', [
            'user' => Auth::user()
        ]);
    }

    public function edit(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'exists:users'],
        ]);

        $path = 'empty';
        $changedFields = [];
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $avatarPath = '/' . $request->avatar->store('images/'. explode('.', $_SERVER['HTTP_HOST'])[0].'/avatars');
            $changedFields['avatar'] = $avatarPath;
        }
        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && strpos($key, 'avatar') === false && $item !== null) {
                if ($key === 'password') {
                    $changedFields[$key] = Hash::make($item, ['rounds' => 12]);
                } else {
                    $changedFields[$key] = $item;
                }
            }
        }
        User::updateOrCreate(
            ['id' => Auth::user()->id],
            $changedFields
        );

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

    public function inviteSend(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        ]);

        $email = $request->email;
        $link = URL::temporarySignedRoute('accept-invite', 86400, ['email' => $email]); // expiration 1 day
        $sender = Auth::user()->getFIO();

        Notification::route('mail', $email)->notify(new UserInvite($link, $sender));

        return back()->with(Helpers::notify("User $email has been invited successfully!"));
    }

    public function inviteAccept(Request $request)
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
            return Inertia::render('Public/RegisterUserByInvite', compact('user'));
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
