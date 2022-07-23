<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Multitenancy\Models\Tenant;

class LearnSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Learning center
         */

        // course curriculums
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum №1',
            'description' => fake()->paragraph(),
        ]);
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum №2',
            'description' => fake()->paragraph(),
        ]);
        DB::table('learn_curriculums')->insert([
            'name' => 'Curriculum №3 (hidden)',
            'description' => fake()->paragraph(),
            'active' => 0,
        ]);

        // course groups
        DB::table('learn_course_group')->insert([
            'name' => 'Marketing',
            'description' => fake()->paragraph()
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Sales',
            'description' => fake()->paragraph()
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Development',
            'description' => fake()->paragraph()
        ]);
        DB::table('learn_course_group')->insert([
            'name' => 'Hidden group',
            'description' => fake()->paragraph()
        ]);

        /*
         * Courses
         */
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
        DB::table('learn_courses')->insert([
            'name' => 'Course 3',
            'description' => fake()->paragraph(),
            'image' => '/img/test_course.jpg',
            'course_group_id' => 2
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 4',
            'description' => fake()->paragraph(),
            'image' => '/img/test_course.jpg',
            'course_group_id' => 1
        ]);
        DB::table('learn_courses')->insert([
            'name' => 'Course 5 (hidden)',
            'description' => fake()->paragraph(),
            'image' => '/img/test_course.jpg',
            'course_group_id' => 1,
            'active' => 0,
        ]);

        /*
         * Lessons
         */
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 1',
            'sort' => 100,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->paragraph(),
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 2',
            'sort' => 200,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->paragraph(),
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 3 (hidden)',
            'sort' => 10,
            'active' => 0,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->paragraph(),
        ]);
        DB::table('learn_lessons')->insert([
            'name' => 'Lesson 4',
            'sort' => 300,
            'description' => fake()->paragraph(),
            'detail_text' => fake()->paragraph(),
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

        DB::table('learn_questions')->insert([
            'name' => 'Question 2_1',
            'lesson_id' => 2,
            'type' => 'text',
            'sort' => 1,
        ]);

        DB::table('learn_questions')->insert([
            'name' => 'Question 4_1',
            'lesson_id' => 4,
            'type' => 'text',
            'sort' => 1,
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
}
