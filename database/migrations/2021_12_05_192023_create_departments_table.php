<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('portal_id');
            $table->string('name');
            $table->unsignedBigInteger('head')->nullable();
            $table->unsignedBigInteger('parent')->nullable();
            $table->timestamps();

            $table->foreign('portal_id')->references('id')->on('portals')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('head')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('parent')->references('id')->on('departments')->onDelete('restrict')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        $table->dropForeign(['portal_id', 'head', 'parent']);
        Schema::dropIfExists('departments');
    }
}
