<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\User;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class AccessController extends BaseController
{
    public function index()
    {
        return Inertia::render('Admin/Access');
    }

    /**
     * request should have 'resource' and 'actions' fields
    */
    public function getResourceUsers(Request $request)
    {
        // TODO transform this plug into working function
        $resource = $request->resource;
        $actions = json_decode($request->actions);
        $response = [
            Department::select('id', 'name')->first(),
            User::select('id', 'name')->first()
        ];
        dd($response);
        return json_encode($response);
    }
}
