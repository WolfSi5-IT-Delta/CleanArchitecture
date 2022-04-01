<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOrderToLearnCourseLessonTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('learn_course_lesson', function (Blueprint $table) {
            $table->unsignedInteger('order')->default(1)->after('lesson_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('learn_course_lesson', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
}
