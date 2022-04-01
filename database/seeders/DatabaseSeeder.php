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

        /*
        * Departments, connecting user & department
        */
        DB::table('departments')->insert([
            'name' => 'Dep 1',
        ]);
        DB::table('departments')->insert([
            'name' => 'Dep 2',
        ]);

        DB::table('department_user')->insert([
            'department_id' => 1,
            'user_id' => 1,
        ]);

        $this->call([
            OrgBoardSeeder::class,
            AuthorizationRulesSeeder::class,
        ]);

        /*
         * Learning center
         */
        DB::table('learn_course_group')->insert([
            'name' => 'Marketing',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Sales',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Development',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Hidden group',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        ]);

        /*
         * Courses
         */
        DB::table('learn_courses')->insert([
            'name' => 'Course 1',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'course_group_id' => 1,
            'image' => '/img/test_course.jpg'
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 2',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 3',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'image' => '/img/test_course.jpg',
            'course_group_id' => 2
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 4',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'image' => '/img/test_course.jpg',
            'course_group_id' => 1
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 5 (hidden)',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'image' => '/img/test_course.jpg',
            'course_group_id' => 1
        ]);

        /*
         * Lessons
         */
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 1',
            'sort' => 100,
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'detail_text' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 2',
            'sort' => 200,
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'detail_text' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 3 (hidden)',
            'sort' => 10,
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'detail_text' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 4',
            'sort' => 300,
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            'detail_text' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
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
        DB::table('learn_course_lesson')->insert([
            'course_id' => 1,
            'lesson_id' => 3,
            'order' => 3,
        ]);
        DB::table('learn_course_lesson')->insert([
            'course_id' => 1,
            'lesson_id' => 4,
            'order' => 4,
        ]);

        // Questions
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_1',
            'lesson_id' => 1
        ]);
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_2',
            'lesson_id' => 1,
            'type' => 'checkbox'
        ]);
        DB::table('learn_questions')->insert([
            'name' => 'Question 1_3',
            'lesson_id' => 1,
            'type' => 'text'
        ]);

        DB::table('learn_questions')->insert([
            'name' => 'Question 2_1',
            'lesson_id' => 2,
            'type' => 'text'
        ]);

        DB::table('learn_questions')->insert([
            'name' => 'Question 4_1',
            'lesson_id' => 4,
            'type' => 'text'
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
        DB::table('learn_answers')->insert([
            'name' => 'Answer 1',
            'question_id' => 2,
            'correct' => true
        ]);
        DB::table('learn_answers')->insert([
            'name' => 'Answer 2',
            'question_id' => 2,
            'correct' => true
        ]);

        /*
         * course curriculums
         */
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum (Программа обучения) №1',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum (Программа обучения) №2',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum №3 (hidden)',
            'description' => "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        ]);

        DB::table('learn_course_curriculum')->insert([
            'course_id' => 1,
            'curriculum_id' => 1,
            'order' => 1,
        ]);
        DB::table('learn_course_curriculum')->insert([
            'course_id' => 2,
            'curriculum_id' => 1,
            'order' => 2,
        ]);
        DB::table('learn_course_curriculum')->insert([
            'course_id' => 1,
            'curriculum_id' => 2,
            'order' => 1,
        ]);
        DB::table('learn_course_curriculum')->insert([
            'course_id' => 1,
            'curriculum_id' => 3,
            'order' => 1,
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
                ]
            ])
        ]);
        DB::table('tenants')->insert([
            'name' => 'tenant2',
            'domain' => 'tenant2.localhost',
            'database' => 'db_tenant2',
        ]);
    }
}
