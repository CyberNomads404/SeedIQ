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
            $table->integer('burned')->nullable()->after('payload');
            $table->integer('greenish')->nullable()->after('burned');
            $table->integer('good_grains')->nullable()->after('greenish');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classification_results', function (Blueprint $table) {
            $table->dropColumn(['burned', 'greenish', 'good_grains']);
        });
    }
};
