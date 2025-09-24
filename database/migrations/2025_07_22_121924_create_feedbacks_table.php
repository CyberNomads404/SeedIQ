<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
            $table->string('external_id')->unique();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('type')->default('general'); // 'bug', 'feature_request', 'suggestion', 'praise', 'general'
            $table->text('message');
            $table->string('attachment')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('page')->nullable();
            $table->string('device')->nullable();
            $table->string('app_version')->nullable();
            $table->text('user_agent')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamp('read_at')->nullable();

            $table->index('type');
            $table->index('read_at');
            $table->index('user_id');
            $table->index('created_at');
            $table->index('page');
            $table->index(['type', 'read_at']);
            $table->index(['user_id', 'type']);
            $table->index(['read_at', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
