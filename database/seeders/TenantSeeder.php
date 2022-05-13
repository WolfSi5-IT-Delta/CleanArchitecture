<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Lauthz\Facades\Enforcer;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Enforcer::addRoleForUser('U1', 'AU'); // all users
        Enforcer::addRoleForUser('U1', 'T1'); // admins
        Enforcer::addRoleForUser('U1', 'T2'); // teachers
    }
}
