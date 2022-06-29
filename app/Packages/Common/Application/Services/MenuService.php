<?php

namespace App\Packages\Common\Application\Services;

use App\Packages\Utils\ConfigStorage;
use Illuminate\Support\Facades\Auth;

class MenuService
{
    private static function getItems()
    {
        return [
            // user items
            'LC'        => ['name' => 'Learning Center', 'href' => route('learning')],
            'admin'     => ['name' => 'Admin', 'href' => route('admin.index')],
            'profile'   => ['name' => 'Profile', 'href' => route('profile')],
            'invite'    => ['name' => 'Invite', 'href' => route('invite-user')],
            'logout'    => ['name' => 'Logout', 'href' => route('logout')],

            // admins items
            'teams'                 => ['name' => 'Teams', 'href' => route('admin.teams'), 'icon' => 'LibraryIcon'],
            'users'                 => ['name' => 'Users', 'href' => route('admin.users'), 'icon'=>'UsersIcon'],

            'lc.curriculums'        => ['name' => 'Curriculums', 'href' => route('admin.curriculums')],
            'lc.courses'            => ['name' => 'Courses', 'href' => route('admin.courses')],
            'lc.groups'      => ['name' => 'Course groups', 'href' => route('admin.groups')],
            'lc.lessons'            => ['name' => 'Lessons', 'href' => route('admin.lessons')],
            'lc.teacher.answers'    => ['name' => 'Student`s answers', 'href' => route('admin.teacher.lessons')],
            'lc.teacher.students'    =>['name' => 'Students', 'href' => route('admin.teacher.students')],

            'ob.departments'        => ['name' => 'Departments', 'href' => route('admin.departments')],
//            ''          => ['name' => '', 'href' => route('')],
//            ''          => ['name' => '', 'href' => route('')],


        ];
    }

    public static function buildTopMenu() {
        $user = Auth::user();
        if (!$user) return [];

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
        if (!$user) return [];

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
        $user = Auth::user();
        if (!$user) return [];

        if ($user->cannot('admin')) return [];

        $items = self::getItems();
        $modules = ConfigStorage::get('modules', []);

        $res = collect();

        if (in_array('LC', $modules)) {
            $res->add([
                'name' => 'Learning Center',
                'items' => [
                    $items['lc.curriculums'],
                    $items['lc.courses'],
                    $items['lc.groups'],
                    $items['lc.lessons'],
                    $items['lc.teacher.answers'],
                    $items['lc.teacher.students'],
                ]
            ]);
        }

        if (in_array('OB', $modules)) {
            $res->add([
                'name' => 'Org Board',
                'items' => [
                    $items['ob.departments'],
                ]
            ]);
        }

        $res->add($items['teams'])
            ->add($items['users'])
            ->filter()
            ->values()
            ->toArray();

        return $res;
    }

}
