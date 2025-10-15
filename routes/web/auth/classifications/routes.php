<?php

use App\Http\Controllers\Web\Classification\ClassificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('classifications')->group(function () {
    Route::get("/", [ClassificationController::class, 'index'])->middleware('permission:classifications_list')->name('classifications.index');
    Route::get("/{external_id}", [ClassificationController::class, 'show'])->middleware('permission:classifications_list')->name('classifications.show');
    Route::delete("/{external_id}", [ClassificationController::class, 'destroy'])->middleware('permission:classifications_delete')->name('classifications.destroy');
});
