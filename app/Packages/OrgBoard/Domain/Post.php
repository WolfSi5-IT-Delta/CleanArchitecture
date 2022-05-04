<?php

namespace App\Packages\OrgBoard\Domain;

class Post
{
    public $id;

    public $name;

    public $description;

    public $department_id;

    public $user_id;

    public $active;

    /**
     * @param $prop
     */
    public function __construct($prop)
    {
        foreach ($prop as $key => $value) {
            $this->{$key} = $value;
        }
    }

}
