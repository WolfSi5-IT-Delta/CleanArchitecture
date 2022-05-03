<?php

namespace App\Packages\Common\Application\Services;

interface IAuthorisationService
{
    public static function authorized(string $obj, string $act): bool;

    public static function checkPermission(string $sub, string $obj, string $act): bool;

    // Roles
    public static function deleteRoleForUser(string $user, string $role): bool;

    public static function addRoleForUser(string $user, string $role): bool;

    // Policies
    public static function addPolicy(string $sub, string $obj, string $act): bool;

    public static function removePolicy($params): bool;

    public static function removeFilteredPolicy(...$params): bool;

}
