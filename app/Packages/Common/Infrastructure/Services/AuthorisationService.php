<?php

namespace App\Packages\Common\Infrastructure\Services;

use App\Packages\Common\Application\Services\IAuthorisationService as IAuthorisationServiceAlias;
use Lauthz\Facades\Enforcer;

class AuthorisationService implements IAuthorisationServiceAlias
{

    public static function authorized(string $obj, string $act): bool
    {
        $user_id = UserService::currentUser()->id;
        $sub = "U$user_id";
        return AuthorisationService::checkPermission($sub, $obj, $act);
    }


    public static function checkPermission(string $sub, string $obj, string $act): bool
    {
        return Enforcer::enforce($sub, $obj, $act);
    }

    public static function DeleteUser(string $obj)
    {
        // TODO: Implement DeleteUser() method.
    }

    public static function DeleteRole(string $obj)
    {
        // TODO: Implement DeleteRole() method.
    }

    public static function DeletePermission(string $obj)
    {
        // TODO: Implement DeletePermission() method.
    }

    //Enforcer::addPolicy('DH1', 'LC1', 'edit');
    //Enforcer::addPolicy('AU', 'LC1', 'read');
    //Enforcer::addPolicy('AU', 'LC2', 'read');
    public static function addPolicy(string $sub, string $obj, string $act): bool
    {
        return Enforcer::addPolicy($sub, $obj, $act);
    }

    public static function removePolicy($params): bool
    {
        return Enforcer::removePolicy($params);
    }

    public static function AddGroupingPolicy(string $group1, string $group2): bool
    {
        // TODO: Implement AddGroupingPolicy() method.
    }

    public static function RemoveGroupingPolicy(string $group1, string $group2): bool
    {
        // TODO: Implement RemoveGroupingPolicy() method.
    }
}
