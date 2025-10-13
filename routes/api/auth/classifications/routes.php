<?php

use App\Http\Controllers\Api\Classification\ClassificationController;

Route::prefix('classifications')->group(function () {
    Route::get('/', [ClassificationController::class, 'index'])->middleware('permission:classifications_list')->name('classifications.api.index');
    Route::get('/get-status', [ClassificationController::class, 'getClassificationStatus'])->middleware('permission:classifications_create')->name('classifications.api.get_status');
});
