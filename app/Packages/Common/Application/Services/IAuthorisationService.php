<?php

namespace App\Packages\Common\Application\Services;

interface IAuthorisationService
{
    /**
     * @param string $sub
     * @param string $obj
     * @param string $act
     * @return bool
     */
    public static function checkPermission(string $sub, string $obj, string $act): bool;

    /**
     * @param string $obj
     * @param string $act
     * @return bool
     */
    public static function authorized(string $obj, string $act): bool;

    // Users
    public static function deleteUser(string $obj);

    public static function deleteRole(string $obj);

    public static function deletePermission(string $obj);

    // Policies
    public static function addPolicy(string $sub, string $obj, string $act): bool;

    public static function removePolicy($params): bool;

    public static function addGroupingPolicy(string $group1, string $group2): bool;

    public static function removeGroupingPolicy(string $group1, string $group2): bool;

}
