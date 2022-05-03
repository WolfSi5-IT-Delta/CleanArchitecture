<?php

namespace App\Packages\Common\Infrastructure\Services;

use App\Packages\Common\Application\Events\EntityCreated;
use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Application\Services\IAuthorisationService as IAuthorisationServiceAlias;
use Illuminate\Support\Str;
use Lauthz\Facades\Enforcer;

class AuthorisationService implements IAuthorisationServiceAlias
{

    public static function authorized(string $obj, string $act): bool
    {
        $user_id = UserService::currentUser()->id;
        $sub = "U$user_id";

        $res = Enforcer::GetImplicitPermissionsForUser($sub);
        $res = collect($res)
            ->filter(fn ($e) => $e[1] == $obj)
            ->map(fn ($e) => Str::after($e[1],'LC'));

        return $res->isNotEmpty();

//        return (AuthorisationService::checkPermission($sub, $obj, $act) ||
//            AuthorisationService::checkPermission('AU', $obj, $act));
    }


    public static function checkPermission(string $sub, string $obj, string $act): bool
    {
        return Enforcer::enforce($sub, $obj, $act);
    }

    public static function deleteRoleForUser(string $user, string $role): bool
    {
        return Enforcer::deleteRoleForUser($user, $role);
    }

    public static function addRoleForUser(string $user, string $role): bool
    {
        return Enforcer::addRoleForUser($user, $role);
    }

    //Enforcer::addPolicy('DH1', 'LC1', 'edit');
    //Enforcer::addPolicy('AU', 'LC1', 'read');
    //Enforcer::addPolicy('AU', 'LC2', 'read');
    public static function addPolicy(string $sub, string $obj, string $act): bool
    {
        return Enforcer::addPolicy($sub, $obj, $act);
    }

    public static function removePolicy(...$params): bool
    {
        return Enforcer::removePolicy(...$params);
    }

    public static function removeFilteredPolicy(...$params): bool
    {
        return Enforcer::removeFilteredPolicy(...$params);
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param  \Illuminate\Events\Dispatcher  $events
     * @return string[]
     */
    public function subscribe($events): array
    {
        return [
            EntityDeleted::class => 'entityDeletedEventListener',
            EntityCreated::class => 'entityCreatedEventListener',
        ];

    }

    public function entityDeletedEventListener(EntityDeleted $event) {
        $perm = $event->permission;
        $obj = $perm->type . $perm->id;
        static::removeFilteredPolicy(0, $obj);
        if ($perm->type == 'U') static::deleteRoleForUser($obj, 'AU');
    }

    public function entityCreatedEventListener(EntityCreated $event) {
        $perm = $event->permission;
        $obj = $perm->type . $perm->id;
        if ($perm->type == 'U') static::addRoleForUser($obj, 'AU');
    }
}
