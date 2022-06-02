<?php

namespace App\Http\Controllers\OrgBoard;

use App\Packages\Common\Application\Services\DepartmentService;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\User;
use Enforcer;
use Illuminate\Http\Request;

class DepartmentController extends BaseController
{

    public function index(Request $request)
    {
        $orderBy = $request->orderby ?? 'id';
        $sortBy = $request->sortby ?? 'asc';
        $perPage = $request->perpage ?? 10;

        $paginatedList = Department::orderBy($orderBy, $sortBy)->paginate($perPage);

        if ($request->has('page')) {
            return $paginatedList;
        }

        return Inertia::render('Admin/OrgBoard/Departments', compact('paginatedList'));
    }

    public function edit($id = null)
    {
        $allDepartaments = DepartmentService::getDepartments()->toArray();
        $allDepartaments = array_map(fn($item) => ["value" => $item->id, "label" => $item->name], $allDepartaments['data']);
        $allUsers = User::all()->toArray();
        $allUsers = array_map(fn($item) => ["value" => $item['id'], "label" => $item['name'], 'last_name'=>$item['last_name']], $allUsers);
        $department = [];
        if ($id !== null) {
            $department = DepartmentService::getDepartment($id)['department'];
        }
        return Inertia::render('Admin/OrgBoard/EditDepartment', compact('department', 'allDepartaments', 'allUsers'));
    }

    public function update(Request $request, $id = null)
    {
        $input = $request->all();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Department::updateOrCreate(['id' => $id], $input);

        $message = $id ? 'Department updated successfully!' : 'Department created successfully!';
        return redirect()->route('admin.departments')->with([
            'message' => $message
        ]);
    }

    public function delete(Request $request, $id)
    {
        $dep = Department::find($id);
        if ($dep->hasChild()) {
            return redirect()->route('admin.departments')->with([
                'header' => 'Can\'t delete',
                'type' => 'fail',
                'message' => 'The department has children!'
            ]);
        }

        $dep->delete();
        return redirect()->route('admin.departments')->with([
            'message' => 'Department has been deleted.'
        ]);
    }

}
