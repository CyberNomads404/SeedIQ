<?php

use App\Http\Controllers\Api\Classification\ClassificationController;

Route::prefix('/analyze')->middleware('validate.api.token:seediq-ai')->group(function () {
    Route::post('/', [ClassificationController::class, 'set_result'])->name('webhook.analyze.set_result');
});

