<?php

namespace App\Http\Controllers\Common;

use App\Packages\Common\Application\Events\PermissionAdded;
use App\Packages\Common\Application\Services\PermissionHistoryService;
use App\Packages\Common\Domain\PermissionDTO;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Enforcer;
use Illuminate\Pagination\Paginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AdminUserController extends BaseController
{

    public function users()
    {
        $users = User::all();
        $users = new Paginator($users, 50);
        return Inertia::render('Admin/Common/Users', compact('users'));
    }

    public function editUser($id = null)
    {
        $user = User::find($id);
        $permissions = AuthorisationService::preparePermissionsForEdit("U$id");
        $permissionHistory = (new PermissionHistoryService())->getPermissionHistory();

        return Inertia::render('Admin/Common/EditUser', compact('user', 'permissions', 'permissionHistory'));
    }

    public function updateUser(Request $request, $id = null)
    {
        $input = $request->collect();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
        ]);

        // user changes password
        if ($input['password'])
            $request->validate([
                'password' => [Rules\Password::defaults()],
            ]);

        // new user
        if (!$id) {
            $request->validate([
                'password' => ['required', Rules\Password::defaults()],
            ]);
        }

        $permissions = $input['permissions'] ?? null;
        unset($input['permissions']);

        $changedFields = [];
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $avatarPath = '/' . $request->avatar->store('images/'. explode('.', $_SERVER['HTTP_HOST'])[0].'/avatars');
            $changedFields['avatar'] = $avatarPath;
        }

        foreach ($input as $key => $item) {
            if ($key !== 'id' && strpos($key, 'avatar') === false && $item !== null) {
                if ($key === 'password') {
                    $changedFields[$key] = Hash::make($item, ['rounds' => 12]);
                } else {
                    $changedFields[$key] = $item;
                }
            }
        }

        $curr = User::updateOrCreate(
            ['id' => $id],
            $changedFields
        );

        // saving permissions
        if ($permissions) {
            $obj = "U{$curr->id}";
            $act = "read";
            AuthorisationService::removeFilteredPolicy(1, $obj, $act);
            foreach ($permissions as $perm) {
                if ($perm['type'] == 'O') {
                    $sub = $perm['id'];
                } else
                    $sub = $perm['type'].$perm['id'];
                AuthorisationService::addPolicy($sub, $obj, $act);
                PermissionAdded::dispatch(new PermissionDTO(...$perm));
            }
        }

        return redirect()->route('admin.users')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'User updated successfully!',
        ]);
    }

    public function deleteUser(Request $request, $id)
    {
        User::find($id)->delete();
        return redirect()->route('admin.users');
    }



}
