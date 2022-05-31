<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // users
        DB::table('users')->insert([
            'name' => 'user1',
            'last_name' => 'fam1',
            'email' => 'user@aa.com',
            'phone' => '+7 (999) 999-99-99',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'password' => Hash::make('123', ['rounds' => 12]),
        ]);
        DB::table('users')->insert([
            'name' => 'user2',
            'last_name' => 'Fam2',
            'email' => 'user2@aa.com',
            'phone' => '+7 (999) 999-99-99',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'password' => Hash::make('123', [
                'rounds' => 12,
            ])
        ]);
        DB::table('users')->insert([
            'name' => 'user3',
            'last_name' => 'Fam3',
            'email' => 'user3@aa.com',
            'phone' => '+7 (999) 999-99-99',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'password' => Hash::make('123', [
                'rounds' => 12,
            ])
        ]);
        DB::table('users')->insert([
            'name' => 'user4',
            'last_name' => 'Fam4',
            'email' => 'user4aa.com',
            'phone' => '+7 (999) 999-99-99',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'password' => Hash::make('123', [
                'rounds' => 12,
            ])
        ]);

        // teams - Heads, Teachers
        DB::table('teams')->insert([
            'name' => __('Heads')
        ]);
        DB::table('teams')->insert([
            'name' => __('Teachers')
        ]);
        DB::table('team_user')->insert([
            'team_id' => 1,
            'user_id' => 1,
        ]);
        DB::table('team_user')->insert([
            'team_id' => 2,
            'user_id' => 1,
        ]);

    }
}
