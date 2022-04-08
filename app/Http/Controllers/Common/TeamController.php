<?php

namespace App\Http\Controllers\Common;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Packages\Common\Infrastructure\Repositories\TeamRepository;
use App\Packages\Common\Domain\Team;
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
      $perPage = 3;//$request->perpage;

      $rep = new TeamRepository();
      $list = $rep->paginate($perPage);

      if ($request->has('page')) { // response for pagination
          return $list;
      }

      return Inertia::render('Admin/Teams', [
          'teams' => $list
      ]);

  }

  public function create(Request $request)
  {
      $rep = new TeamRepository();

      $input = $request->all();
      $rep->create($input);

      return redirect()->route('admin.teams')->with([
          'position' => 'bottom',
          'type' => 'success',
          'header' => 'Success!',
          'message' => 'Team has been created successfully!',
      ]);
  }

  public function edit($id = null)
  {
      $rep = new TeamRepository();
      $team = null;

      if ($id !== null) {
          $team = $rep->find($id);
      }

      return Inertia::render('Admin/EditTeam', compact('team'));
  }

  public function save(Request $request, $id)
  {
      $input = $request->all();
      $rep = new TeamRepository();
      $rep->update($input, $id);

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
