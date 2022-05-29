<?php

namespace App\Packages\Common\Application\Services;

use Illuminate\Support\Facades\Auth;

class MenuService
{
    private static function getItems()
    {
        return [
            'LC'        => ['name' => 'Learning Center', 'href' => route('learning')],
            'admin'     => ['name' => 'Admin', 'href' => route('admin.index')],
            'profile'   => ['name' => 'Profile', 'href' => route('profile')],
            'invite'    => ['name' => 'Invite', 'href' => route('invite-user')],
            'logout'    => ['name' => 'Logout', 'href' => route('logout')]
        ];
    }

    public static function buildTopMenu() {
        $user = Auth::user();
        $items = self::getItems();

        $res = collect()
            ->add($user->can('package', 'LC') ? $items['LC'] : null)
            ->add($user->can('admin') ? $items['admin'] : null)
            ->filter()
            ->values()
            ->toArray();

        return $res;
    }

    public static function buildUserMenu() {
        $user = Auth::user();
        $items = self::getItems();

        $res = collect()
            ->add($items['profile'])
            ->add($user->can('admin') ? $items['admin'] : null)
            ->add($user->can('admin') ? $items['invite'] : null)
            ->add($items['logout'])
            ->filter()
            ->values()
            ->toArray();

        return $res;
    }

    public static function buildLeftMenu() {
        return [

        ];
    }
}
