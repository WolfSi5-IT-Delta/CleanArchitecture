<?php

namespace App\Packages\Common\Domain;

class Team
{
    public $id;

    public $name;

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
