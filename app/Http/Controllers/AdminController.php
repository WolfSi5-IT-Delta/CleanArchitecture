<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\User;
use App\Packages\Common\Application\Services\DepartmentService;
use Enforcer;
use Illuminate\Pagination\Paginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminController extends BaseController
{
    /**
     * Get departments.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function departments()
    {
        $departments = DepartmentService::getDepartments();

        Log::debug('Departments', [$departments]);
        return Inertia::render('Admin/Departments', compact('departments'));
    }

    public function editDepartment($id = null)
    {
        $allDepartaments = DepartmentService::getDepartments()->toArray();
        $allDepartaments = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $allDepartaments['data']);
        $allUsers = User::all()->toArray();
        $allUsers = array_map(fn($item) => ["value" => $item['id'], "label" => $item['name']], $allUsers);
        $department = [];
        if ($id !== null) {
            $department = DepartmentService::getDepartment($id)['department'];
        }
        return Inertia::render('Admin/EditDepartment', compact('department', 'allDepartaments', 'allUsers'));
    }

    public function saveEditedDepartment(Request $request, $id)
    {
        $changedFields = [];

        $input = $request->collect();
        $department = Department::find($id);

        foreach ($input as $key => $item) {
            if ($key === 'head' && $item === null){
                $department->$key = null;
            }
            elseif ($key === 'parent'){
                if ($department->id !== $item) {
                    $department->$key = $item;
                } else {
                    $department->$key = null;
                }
            }
            elseif ($key !== 'id' && strpos($key, 'image') === false && $item !== null) {
                $department->$key = $item;
            }
        }

        $department->save();

        return redirect()->route('admin.departments')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'department updated successfully!',
        ]);
    }

    public function deleteDepartment(Request $request, $id)
    {
        Department::find($id)->delete();
        return redirect()->route('admin.departments');
    }

    public function createDepartment(Request $request)
    {
        // TODO set current user as head if nothing received
        $department = new Department;
        $changedFields = [];

        $input = $request->collect();

        foreach ($input as $key => $item) {
            if ($key !== 'id' && $item !== null) {
                $department->$key = $item;
            }
        }

        $department->save();
        return redirect()->route('admin.departments')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'Departament created successfully!',
        ]);
    }

    public function users(Request $request)
    {

        $orderBy = $request->orderby;
        $sort = $request->sort;
        $perPage = $request->perpage;

        $users = User::orderBy($orderBy ?? 'id', $sort ?? 'asc')->paginate($perPage);


        if ($request->has('page')) { // response for pagination
            return $users;
        }
        $users = [];

        return Inertia::render('Admin/Users', compact('users'));

    }

    public function createUser(Request $request)
    {
        $changedFields = [];


        $path = 'empty';
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
        $user = User::create($changedFields);
        $user->save();

        return redirect()->route('admin.users')->with([
            'position' => 'bottom',
            'type' => 'success',
            'header' => 'Success!',
            'message' => 'User created successfully!',
        ]);
    }

    public function editUser($id = null)
    {

        $user = [];
        if ($id !== null) {
            $user = User::find($id);
        }
        return Inertia::render('Admin/EditUser', compact('user'));
    }

    public function saveEditedUser(Request $request, $id)
    {
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
            ['id' => $id],
            $changedFields
        );

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
