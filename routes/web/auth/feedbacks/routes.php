<?php

use App\Http\Controllers\Web\Feedback\FeedbackController;
use App\Models\Feedback;
use Illuminate\Support\Facades\Route;

Route::prefix('feedbacks')->group(function () {
    Route::get("/", [FeedbackController::class, 'index'])->middleware('permission:feedbacks_list')->name('feedbacks.index');
    Route::put("/{external_id}/switch", [FeedbackController::class, 'switch'])->middleware('permission:feedbacks_edit')->name('feedbacks.switch');
    Route::get("/{external_id}", [FeedbackController::class, 'show'])->middleware('permission:feedbacks_list')->name('feedbacks.show');
    Route::delete("/{external_id}", [FeedbackController::class, 'destroy'])->middleware('permission:feedbacks_delete')->name('feedbacks.destroy');
});
