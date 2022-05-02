<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permission_history', function (Blueprint $table) {
            $table->string('type');
            $table->string('id');
            $table->string('name');
            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['type']);
            $table->index(['type', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permission_history');
    }
}
