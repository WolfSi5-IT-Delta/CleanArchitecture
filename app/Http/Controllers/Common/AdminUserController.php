<?php

namespace App\Http\Controllers\Common;

use App\Models\User;
use App\Packages\Common\Application\Events\PermissionAdded;
use App\Packages\Common\Application\Services\PermissionHistoryService;
use App\Packages\Common\Domain\PermissionDTO;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Lauthz\Facades\Enforcer;
use Illuminate\Support\Facades\Redirect;

class AdminUserController extends BaseController
{

    public function users(Request $request)
    {
        $orderBy = $request->orderby ?? 'id';
        $sortBy = $request->sortby ?? 'asc';
        $perPage = $request->perpage ?? 10;

        $paginatedList = User::orderBy($orderBy, $sortBy)->paginate($perPage);

        if ($request->has('page')) {
            return $paginatedList;
        }

        return Inertia::render('Admin/Common/Users', compact('paginatedList'));
    }

    public function editUser($id = null)
    {
        $user = User::find($id);
        $permissions = AuthorisationService::prepareRolesForEdit("U$id");
        $permissionHistory = (new PermissionHistoryService())->getPermissionHistory();

        return Inertia::render('Admin/Common/EditUser', compact('user', 'permissions', 'permissionHistory'));
    }

    public function updateUser(Request $request, $id = null)
    {
        $input = $request->all();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
        ]);

        // new user
        if (!$id) {
            $request->validate([
                'password' => ['required', Rules\Password::defaults()],
            ]);
        }

        // user changes password
        if ($input['password']) {
            $request->validate([
                'password' => [Rules\Password::defaults()],
            ]);
            $input['password'] = Hash::make($input['password'], ['rounds' => 12]);
        } else {
            unset($input['password']);
        }

        $permissions = $input['permissions'] ?? null;
        unset($input['permissions']);

        // check for last admin
        if ($id && !$input['admin']) {
            $admins = collect(Enforcer::GetUsersForRole('ADMIN')); //TODO Authorisation service
            if ($admins->count() == 1 && $admins->first() == "U$id") { // try to delete last admin
                return Redirect::refresh()->withErrors(['admin' => 'Try to delete last admin!']);
                // abort(401, 'Try to delete last admin!');
            }
        }

        // avatar
        $oldFile = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // old avatar
            if($id) {
                $rec = User::find($id);
                $oldFile = $rec?->avatar;
            }
            $tenant = app('currentTenant')->name;
            $avatarPath = '/' . $request->avatar->store('images/'. $tenant .'/avatars');
            $input['avatar'] = $avatarPath;
        }

        $curr = User::updateOrCreate(
            ['id' => $id],
            $input
        );

        // delete old avatar
        if ($oldFile) Storage::delete($oldFile);

        // saving permissions (only roles)
        $obj = "U{$curr->id}";
        AuthorisationService::deleteRolesForUser($obj);
        AuthorisationService::addRoleForUser($obj, 'AU');
        if ($input['admin']) AuthorisationService::addRoleForUser($obj, 'ADMIN');
        foreach ($permissions as $perm) {
            if ($perm['type'] == 'O') {
                $sub = $perm['id']; // All users
            } else
                $sub = $perm['type'] . $perm['id'];
            AuthorisationService::addRoleForUser($obj, $sub);
            PermissionAdded::dispatch(new PermissionDTO(...$perm));
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
