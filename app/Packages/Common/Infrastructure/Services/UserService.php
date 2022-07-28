<?php

namespace App\Packages\Common\Infrastructure\Services;

use App\Packages\Common\Application\Services\IUserService;
use App\Packages\Common\Domain\UserDTO;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserService implements IUserService
{

    /**
     * @return UserDTO
     */
    public function currentUser(): UserDTO
    {
        $user = Auth::user();
        return new UserDTO($user->toArray());
    }

    public function getUser(int $uid): UserDTO
    {
        $user = User::find($uid);
        return new UserDTO($user->toArray());
    }

}
