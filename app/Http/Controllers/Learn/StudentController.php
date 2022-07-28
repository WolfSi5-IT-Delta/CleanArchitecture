<?php

namespace App\Http\Controllers\Learn;

use App\Models\JournalLesson;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use App\Packages\Learn\UseCases\StudentService;

class StudentController extends BaseController
{

    /**
     * Student's list
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function index(Request $request, StudentService $studentService) {

        $orderBy = $request->orderby ?? 'id';
        $sortBy = $request->sortby ?? 'asc';
        $perPage = $request->perpage ?? 10;

        $paginatedList = $studentService->getStudensList($orderBy, $sortBy, $perPage);

        if ($request->has('page')) { // response for pagination
            return $paginatedList;
        }

        return Inertia::render('Admin/Learning/Students', compact('paginatedList'));
    }

     /**
     * Student detail page.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function getStudentInfo(Request $request, StudentService $studentService, int $id) {
        $studentInfo = $studentService->getStudentInfo($id);

        return Inertia::render('Admin/Learning/Student', compact('studentInfo'));
    }
}
