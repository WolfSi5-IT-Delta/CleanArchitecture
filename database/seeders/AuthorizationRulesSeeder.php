<?php

namespace Database\Seeders;

use Lauthz\Facades\Enforcer;
use Illuminate\Database\Seeder;

class AuthorizationRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // adds a role for a user.
        Enforcer::addRoleForUser('U1', 'ADMIN'); // administrator

        // adds a role for a user.
        Enforcer::addRoleForUser('U1', 'AU');
        Enforcer::addRoleForUser('U1', 'DM1');
        Enforcer::addRoleForUser('U1', 'DH1');
        Enforcer::addRoleForUser('U1', 'T1');
        Enforcer::addRoleForUser('U1', 'T2'); // teachers


        // adds permissions to a user
//        Enforcer::addPermissionForUser('U1', 'LC1', 'read');

        // adds permissions to a rule - courses
        Enforcer::addPolicy('DH1', 'LC1', 'edit');
        Enforcer::addPolicy('AU', 'LC1', 'read');
        Enforcer::addPolicy('AU', 'LC2', 'read');
        Enforcer::addPolicy('AU', 'LC3', 'read');
        Enforcer::addPolicy('AU', 'LC4', 'read');

        // adds permissions to a rule - lessons
        Enforcer::addPolicy('AU', 'LL1', 'read');
        Enforcer::addPolicy('AU', 'LL2', 'read');
        Enforcer::addPolicy('AU', 'LL4', 'read');

        // adds permissions to a rule - curriculums
        Enforcer::addPolicy('AU', 'LP1', 'read');
        Enforcer::addPolicy('AU', 'LP2', 'read');


    }
}
