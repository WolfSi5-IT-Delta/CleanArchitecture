<?php

namespace App\Packages\Common\Application\Interfaces;

use Illuminate\Pagination\Paginator;

interface DepartmentServiceInterface
{
    /**
     * list of departments
     *
     * @return array
     */
    public function getDepartments(): Paginator;

    /**
     * Department details
     *
     * @param int $id
     */
    public function getDepartment(int $id): array;

}
