<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('classification_results', function (Blueprint $table) {
            $table->integer('good')->nullable();
            $table->integer('bad_detection')->nullable();
            $table->integer('unknown')->nullable();
            $table->integer('burned')->nullable();
            $table->integer('greenish')->nullable();
            $table->integer('small')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classification_results', function (Blueprint $table) {
            $table->dropColumn(['good', 'bad_detection', 'unknown', 'burned', 'greenish', 'small']);
        });
    }
};
