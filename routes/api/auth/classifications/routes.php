<?php

use App\Http\Controllers\Api\Classification\ClassificationController;

Route::prefix('classifications')->group(function () {
    Route::get('/', [ClassificationController::class, 'index'])->middleware('permission:classifications_list')->name('classifications.api.index');
    Route::post('/', [ClassificationController::class, 'store'])->middleware('permission:classifications_create')->name('classifications.api.store');
    Route::get('/{externalId}', [ClassificationController::class, 'show'])->middleware('permission:classifications_list')->name('classifications.api.show');
});
