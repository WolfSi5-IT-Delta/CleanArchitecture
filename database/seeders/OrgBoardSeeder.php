<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class OrgBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Departments
         */
        DB::table('departments')->insert([
            'name' => 'Marketing',
        ]);
        DB::table('departments')->insert([
            'name' => 'Sales',
        ]);
        DB::table('departments')->insert([
            'name' => 'IT',
        ]);

        DB::table('department_user')->insert([
            'department_id' => 1,
            'user_id' => 1,
        ]);

        /*
         * Posts, connecting user & department
         */
        DB::table('orgboard_posts')->insert([
            'name' => 'Post 1',
            'description' => fake()->realText(maxNbChars: 200, indexSize: 2), // 'Post1 description',
            'active' => true,
            'department_id' => 1,
        ]);
        DB::table('orgboard_posts')->insert([
            'name' => 'Post 2',
            'description' => fake()->realText(maxNbChars: 200, indexSize: 2),
            'active' => true,
            'department_id' => 1,
            'user_id' => 1,
        ]);

    }
}
