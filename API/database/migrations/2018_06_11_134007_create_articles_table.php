<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->unique();
            $table->text('description');
            $table->string('photo');
            $table->timestamps();
        });

        Schema::table("articles", function(Blueprint $table){
            $table->integer("user_id")->unsigned()->index();
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("articles", function(Blueprint $table){
            $table->dropForeign("villes_region_id_foreign");
        });
        Schema::dropIfExists('articles');
    }
}
