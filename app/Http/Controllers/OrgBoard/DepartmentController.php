<?php

namespace App\Http\Controllers\OrgBoard;

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

class DepartmentController extends BaseController
{

    public function departments()
    {
        $departments = DepartmentService::getDepartments();

        return Inertia::render('Admin/Departments', compact('departments'));
    }

    public function editDepartment($id = null)
    {
        $allDepartaments = DepartmentService::getDepartments()->toArray();
        $allDepartaments = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $allDepartaments['data']);
        $allUsers = User::all()->toArray();
        $allUsers = array_map(fn($item) => ["value" => $item['id'], "label" => $item['name'], 'last_name'=>$item['last_name']], $allUsers);
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

}
