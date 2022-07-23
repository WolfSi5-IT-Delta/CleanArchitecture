<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
        // teams - Heads, Teachers
        DB::table('teams')->insert([
            'name' => __('Heads')
        ]);
        DB::table('teams')->insert([
            'name' => __('Teachers')
        ]);

        /*
         * Learning center
         */

        DB::table('learn_course_group')->insert([
            'name' => 'Marketing',
            'description' => fake()->realText(maxNbChars: 200, indexSize: 2),
        ]);

        DB::table('learn_courses')->insert([
            'name' => 'Course 1',
            'description' => fake()->paragraph(),
            'course_group_id' => 1,
            'image' => '/img/test_course.jpg'
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 2',
            'description' => fake()->paragraph(),
        ]);

        /*
        * Lessons
        */
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 1',
            'sort' => 100,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->text(100),
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 2',
            'sort' => 200,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->text(100),
        ]);

        DB::table('learn_course_lesson')->insert([
            'course_id' => 1,
            'lesson_id' => 1,
            'order' => 1,
        ]);
        DB::table('learn_course_lesson')->insert([
            'course_id' => 1,
            'lesson_id' => 2,
            'order' => 2,
        ]);

        // Questions
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_1',
            'lesson_id' => 1,
            'sort' => 1,
        ]);
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_2',
            'lesson_id' => 1,
            'type' => 'checkbox',
            'sort' => 2,
        ]);
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_3',
            'lesson_id' => 1,
            'type' => 'text',
            'sort' => 3,
        ]);

        // Answers
        DB::table('learn_answers')->insert([
            'name' => 'Answer 1',
            'question_id' => 1,
            'correct' => true
        ]);
        DB::table('learn_answers')->insert([
            'name' => 'Answer 2',
            'question_id' => 1
        ]);


        /*
         * course curriculums
         */
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum №1',
            'description' => fake()->paragraph(),
        ]);
        DB::table('learn_course_curriculum')->insert([
            'course_id' => 1,
            'curriculum_id' => 1,
            'order' => 1,
        ]);

        Enforcer::addRoleForUser('U1', 'AU'); // all users
        Enforcer::addRoleForUser('U1', 'ADMIN'); // all users
        Enforcer::addRoleForUser('U1', 'T1'); // admins
        Enforcer::addRoleForUser('U1', 'T2'); // teachers

        Enforcer::addPolicy('AU', 'LC1', 'read');
        Enforcer::addPolicy('AU', 'LL1', 'read');
        Enforcer::addPolicy('AU', 'LP1', 'read');
    }
}
