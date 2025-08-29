<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('note')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->string('category')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
            
            // Índices para mejor performance
            $table->index('priority');
            $table->index('category');
            $table->index('completed');
            $table->index(['completed', 'priority']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};