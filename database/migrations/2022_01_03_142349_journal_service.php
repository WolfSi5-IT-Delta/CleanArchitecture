<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class JournalService extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        // Learning journal
        Schema::create('learn_journal_lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('lesson_id');
            $table->unsignedInteger('tries')->default(0);
            $table->enum('status', ['new', 'pending', 'fail', 'done', 'blocked'])->default('new');
            $table->json('answers')->nullable();
            $table->unsignedBigInteger('instructor_id')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('course_id')->references('id')->on('learn_courses')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('lesson_id')->references('id')->on('learn_lessons')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('instructor_id')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::create('learn_journal_courses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedInteger('tries')->default(0);
            $table->enum('status', ['new', 'pending', 'fail', 'done', 'blocked'])->default('new');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('course_id')->references('id')->on('learn_courses')->onDelete('cascade')->onUpdate('cascade');
        });
//
//        Schema::create('learn_journal_text_answers', function (Blueprint $table) {
//            $table->id();
//            $table->unsignedBigInteger('user_id');
//            $table->unsignedBigInteger('question_id');
//            $table->unsignedBigInteger('instructor_id')->nullable();
//            $table->text('message')->nullable();
//            $table->timestamps();
//
//            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
//            $table->foreign('question_id')->references('id')->on('learn_questions')->onDelete('cascade')->onUpdate('cascade');
//            $table->foreign('instructor_id')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
//
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('learn_journal_lessons');
        Schema::dropIfExists('learn_journal_courses');
    }
}
