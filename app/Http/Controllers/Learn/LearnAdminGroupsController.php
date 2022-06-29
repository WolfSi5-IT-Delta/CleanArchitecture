<?php

namespace App\Http\Controllers\Learn;

use App\Http\Controllers\Controller;
use App\Models\CourseGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LearnAdminGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $orderBy = $request->orderby ?? 'id';
        $sortBy = $request->sortby ?? 'asc';
        $perPage = $request->perpage ?? 10;

        // for searching with AsyncPaginate
        $search = $request->has('search') ? '%' . $request->search . '%' : null;
        $selected = $request->has('selected') ? json_decode($request->selected) : null;

        $paginatedList = CourseGroup::when($search, function ($query) use ($search) {
                return $query->where('name', 'like', $search);
            })
            ->when($selected, function ($query) use ($selected) {
                return $query->whereNotIn('id', $selected);
            })
            ->orderBy($orderBy, $sortBy)
            ->paginate($perPage);

        if ($request->has('page')) {
            return $paginatedList;
        }

        if ($request->wantsJson()) {
            return $paginatedList;
        }

        return Inertia::render('Admin/Learning/Groups', compact('paginatedList'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Learning/EditGroup');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $input = $request->all();

        CourseGroup::create($input);

        return redirect()->route('admin.groups')->with([
            'message' => 'Group has been created successfully!',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CourseGroup  $courseGroup
     * @return \Inertia\Response
     */
    public function show(CourseGroup $courseGroup)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CourseGroup  $courseGroup
     * @return \Inertia\Response
     */
    public function edit(CourseGroup $courseGroup)
    {
        return Inertia::render('Admin/Learning/EditGroup', [ 'group' => $courseGroup]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CourseGroup  $courseGroup
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, CourseGroup $courseGroup)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $input = $request->all();

        $courseGroup->update($input);

        return redirect()->route('admin.groups')->with([
            'message' => 'Group has been updated successfully!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CourseGroup  $courseGroup
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(CourseGroup $courseGroup)
    {
        $courseGroup->delete();
        return Redirect::route('admin.groups')->with([
            'message' => __('Group has been deleted successfully'),
        ]);
    }
}
