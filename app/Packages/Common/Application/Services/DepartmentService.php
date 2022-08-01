<?php

namespace App\Packages\Common\Application\Services;

use App\Packages\Common\Application\Interfaces\DepartmentServiceInterface;
use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Infrastructure\Repositories\DepartmentRepository;
use Illuminate\Pagination\Paginator;

class DepartmentService implements DepartmentServiceInterface
{
    protected static $instance = null;

    public function __construct(protected IAuthorisationService $authService)
    {
        // $this->authService = app()->make(IAuthorisationService::class);
        // MenuService::$instance = $this;
    }

    // public static function instance() {
    //     if (is_null(MenuService::$instance)) {
    //         MenuService::$instance = new MenuService();
    //     }
    //     return MenuService::$instance;
    // }

    public function getDepartments(): Paginator
    {
        $rep = new DepartmentRepository();

        //TODO Add roles to Department Read
        // $list = $rep->all()->toArray();

        // $self = DepartmentService::instance();
        // $res = array_filter($list, fn ($item) => ($self->authService::authorized("LC{$item->id}", 'read')));

        return new Paginator($rep->all(), 50);
    }

    /**
     * @param int $id
     * @return array
     */
    public function getDepartment(int $id): array
    {
        // $self = MenuService::instance();
        $rep = new DepartmentRepository();
        $department = $rep->find($id);
        // if (!$this->authService->authorized("D{$department->id}", 'read')) {
        //     throw new \Error('No access');
        // }

        return compact('department');
    }

}
