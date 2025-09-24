<?php

use App\Http\Controllers\Api\Feedback\FeedbackController;
use Illuminate\Support\Facades\Route;

Route::prefix('feedbacks')->group(function () {
    Route::get("/types", [FeedbackController::class, 'getTypes'])->name('feedbacks.types');
    Route::post("/", [FeedbackController::class, 'store'])->name('feedbacks.store');
});
