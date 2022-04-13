<?php

namespace App\Http\Controllers\Common;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Packages\Common\Infrastructure\Repositories\TeamRepository;
use App\Models\Common\Team;
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
      $orderBy = $request->orderby;
      $sort = $request->sort;
      $perPage = $request->perpage;

      $rep = new TeamRepository();
      $list = $rep->paginate($perPage);

      if ($request->has('page')) { // response for pagination
          return $list;
      }

      return Inertia::render('Admin/Teams', [
          'teams' => $list
      ]);

  }

  public function edit($id = null)
  {
      $team = null;
      if ($id !== null) {
          $team = Team::with('users')->find($id);
      }

      return Inertia::render('Admin/EditTeam', compact('team'));
  }

  public function update(Request $request, $id = null)
  {
      $input = $request->all();

      $users = collect($input['users']);
      unset($input['users']);

      $team = Team::updateOrCreate([ 'id' => $id], $input);
      // save users
      $team->users()->sync($users->map(fn ($e) => $e['value'] ));

      return redirect()->route('admin.teams')->with([
          'position' => 'bottom',
          'type' => 'success',
          'header' => 'Success!',
          'message' => 'Team has been updated successfully!',
      ]);
  }

  public function delete(Request $request, $id)
  {
      $rep = new TeamRepository();
      $rep->delete($id);
      return redirect()->route('admin.teams');
  }



}
