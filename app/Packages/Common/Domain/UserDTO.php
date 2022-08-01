<?php

namespace App\Packages\Common\Domain;

class UserDTO
{
    public int $id;
    public string $email;
    public string $name;
    public string $last_name;
    public string|null $avatar;


    /**
     * @param $prop
     */
    public function __construct($prop)
    {
        foreach ($prop as $key => $value) {
            $this->{$key} = $value;
        }
    }

    public function FIO(): string {
        return trim ("$this->name $this->last_name");
    }

    /**
     * @param int $id
     * @param string $email
     * @param string $name
     */
//    public function __construct(int $id, string $email, string $name)
//    {
//        $this->id = $id;
//        $this->email = $email;
//        $this->name = $name;
//    }

}
