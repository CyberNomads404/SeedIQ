<?php

use App\Http\Controllers\Api\Auth\AuthController;

Route::prefix('auth')->middleware(['auth:sanctum', 'check.refresh.token'])->group(function () {
    Route::post('refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
});

Route::prefix('auth')->middleware(['auth:sanctum', 'check.access.token'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::get('me', [AuthController::class, 'me'])->name('auth.me');
    Route::put('update-profile', [AuthController::class, 'updateProfile'])->name('auth.update-profile');
});
