<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLearnTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('learn_course_group', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(100);
            $table->text('description')->nullable();;
            $table->timestamps();
        });

        Schema::create('learn_courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(100);
            $table->text('description')->nullable();
            $table->string('image', 500)->nullable();
            $table->unsignedBigInteger('course_group_id')->nullable();
            $table->json('options')->nullable();
            $table->timestamps();

            $table->foreign('course_group_id')->references('id')->on('learn_course_group')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::create('learn_lessons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(100);
            $table->text('description')->nullable();
            $table->text('detail_text')->nullable();
            $table->string('image', 500)->nullable();
            $table->timestamps();
        });

        Schema::create('learn_course_lesson', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('lesson_id');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('learn_courses')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('lesson_id')->references('id')->on('learn_lessons')->onDelete('cascade')->onUpdate('cascade');

        });

        Schema::create('learn_questions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->nullable()->default(true);
            $table->unsignedInteger('sort')->nullable()->default(100);
            $table->enum('type', ['radio', 'checkbox', 'text']);
            $table->unsignedInteger('point')->nullable()->default(10);
            $table->unsignedBigInteger('lesson_id');
            $table->timestamps();

            $table->foreign('lesson_id')->references('id')->on('learn_lessons')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('learn_answers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->nullable()->default(true);
            $table->unsignedInteger('sort')->nullable()->default(100);
            $table->boolean('correct')->nullable()->default(false);
            $table->unsignedBigInteger('question_id');
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('learn_questions')->onDelete('cascade')->onUpdate('cascade');
        });

        // Curriculum,  contains several courses
        Schema::create('learn_curriculums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort')->default(100);
            $table->timestamps();
        });

        Schema::create('learn_course_curriculum', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('curriculum_id');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('learn_courses')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('curriculum_id')->references('id')->on('learn_curriculums')->onDelete('cascade')->onUpdate('cascade');

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('learn_answers');
        Schema::dropIfExists('learn_questions');
        Schema::dropIfExists('learn_course_lesson');
        Schema::dropIfExists('learn_lessons');
        Schema::dropIfExists('learn_course_curriculum');
        Schema::dropIfExists('learn_courses');
        Schema::dropIfExists('learn_course_group');
        Schema::dropIfExists('learn_curriculums');
    }
}
