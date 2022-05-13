<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Multitenancy\Models\Tenant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Tenant::checkCurrent()
            ? $this->runTenantSpecificSeeders()
            : $this->runLandlordSpecificSeeders();
    }

    public function runTenantSpecificSeeders()
    {
        $this->call([
            UserSeeder::class
        ]);

        $this->call([
            OrgBoardSeeder::class,
            AuthorizationRulesSeeder::class,
            LearnSeeder::class
        ]);
    }

    private function runLandlordSpecificSeeders()
    {
        DB::table('tenants')->insert([
            'name' => 'tenant1',
            'domain' => 'tenant1.localhost',
            'database' => 'db_tenant1',
            'options' => json_encode([
                'integration' => [
                    'type' => 'bitrix24',
                    'endpoint' => env('BITRIX24_ENDPOINT_URI'),
                    'client_id' => env('BITRIX24_CLIENT_ID'),
                    'client_secret' => env('BITRIX24_CLIENT_SECRET'),
                    'redirect' => env('BITRIX24_REDIRECT_URI')
                ],
                'modules' => ['LC', 'OB', 'OP']
            ])
        ]);
        DB::table('tenants')->insert([
            'name' => 'tenant2',
            'domain' => 'tenant2.localhost',
            'database' => 'db_tenant2',
            'options' => json_encode([
                'modules' => ['LC', 'OB', 'OP']
            ])
        ]);
    }
}
