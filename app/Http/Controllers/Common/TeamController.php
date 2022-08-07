<?php

namespace App\Http\Controllers\Common;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Packages\Common\Infrastructure\Repositories\TeamRepository;
use App\Models\Common\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TeamController extends Controller
{
  /**
   * Get departments.
   *
   * @param int $id
   * @return \Inertia\Response
   */
  public function teams(Request $request)
  {
      $orderBy = $request->orderby ?? 'id';
      $sortBy = $request->sortby ?? 'asc';
      $perPage = $request->perpage ?? 10;

      $paginatedList = Team::orderBy($orderBy, $sortBy)->paginate($perPage);

      if ($request->has('page')) {
          return $paginatedList;
      }

      return Inertia::render('Admin/Common/Teams', compact('paginatedList'));
  }

  public function edit($id = null)
  {
      $team = null;
      if ($id !== null) {
          $team = Team::with('users')->find($id);
      }

      return Inertia::render('Admin/Common/EditTeam', compact('team'));
  }

  public function update(Request $request, $id = null)
  {
      $request->validate([
          'name' => ['required', 'string', 'max:255'],
      ]);

      $input = $request->all();

      $users = collect($input['users']);
      unset($input['users']);

    //   if ($id == 1) { // Admins team

    //       $my_id = Auth::user()->id;
    //       if (!$users->map(fn ($e) => $e['value'])->contains($my_id)) { // means user deleted yourself
    //           return Redirect::back()->withErrors(['0' => 'You can not delete yourself from Admins team!']);
    //       }
    //   };

      $team = Team::updateOrCreate(['id' => $id], $input);
      // save users
      $team->users()->sync($users->map(fn ($e) => $e['value'] ));

      return Redirect::route('admin.teams')->with([
          'message' => 'Team has been updated successfully!',
      ]);
  }

  public function delete(Request $request, $id)
  {
    //   if ($id == 1 or $id == 2)
    //       return Redirect::route('admin.teams')->with([
    //           'type' => 'fail',
    //           'header' => 'Error!',
    //           'message' => __('You can not delete groups Admins and Teachers'),
    //       ]);

      $rep = new TeamRepository();
      $rep->delete($id);
      return Redirect::route('admin.teams')->with([
          'message' => __('The team has been deleted successfully'),
      ]);
  }



}
