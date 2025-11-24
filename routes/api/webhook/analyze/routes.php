<?php

use App\Http\Controllers\Api\Classification\ClassificationController;

Route::prefix('/analyze')->middleware('validate.api.token:seediq-ai')->group(function () {
    Route::post('/', [ClassificationController::class, 'setResult'])->name('webhook.analyze.setResult');
});

