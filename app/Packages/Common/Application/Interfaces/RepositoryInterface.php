<?php

namespace App\Packages\Common\Application\Interfaces;

// https://bosnadev.com/2015/03/07/using-repository-pattern-in-laravel-5/

interface RepositoryInterface
{

    public function query($applyFilter = null, $columns = array('*')): RepositoryInterface;

    public function all($columns = array('*')): array;

//    public function findBy($field, $value, $columns = array('*'));

   public function paginate($perPage = 10, $columns = array('*'));

    public function find($id, $columns = array('*')): Object;

    public function create(array $data): Object;

    public function update(array $data, $id): bool;

    public function delete($id): bool;

}
