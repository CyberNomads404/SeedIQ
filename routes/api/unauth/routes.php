<?php

use App\Http\Controllers\Api\Auth\AuthController;

Route::get('welcome', function () {
    return response()->json([
        'status' => 'success',
        'message' => trans('responses.welcome'),
        'data' => []
    ]);
});

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('login', [AuthController::class, 'login'])->name('auth.login');

    Route::get('/email/verify-email/{id}/{hash}', [AuthController::class, 'confirmRegister'])
        ->name('verification.verify');
    Route::post('/email/resend-verify-email', [AuthController::class, 'resendVerifyEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.resend');

    Route::post('/forgot-password',[AuthController::class, 'forgotPassword'])->name('password.forgot');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
    Route::post('/validation-reset-password', [AuthController::class, 'validateResetPasswordToken'])->name('password.validate-reset-password-token');
});

require 'feedbacks/routes.php';
