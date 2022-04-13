<?php

namespace App\Packages\Common\Infrastructure\Services;

use App\Packages\Common\Application\Services\IUserService;
use App\Packages\Common\Domain\UserDTO;
use Illuminate\Support\Facades\Auth;

class UserService implements IUserService
{

    /**
     * @return UserDTO
     */
    public static function currentUser()
    {
        $user = Auth::user();
        return new UserDTO($user->toArray());
    }
}
