<?php

use App\Http\Controllers\Web\Auth\AuthController;
use App\Http\Controllers\Web\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Web\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Web\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Web\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Web\Auth\NewPasswordController;
use App\Http\Controllers\Web\Auth\PasswordController;
use App\Http\Controllers\Web\Auth\PasswordResetLinkController;
use App\Http\Controllers\Web\Auth\RegisteredUserController;
use App\Http\Controllers\Web\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('register', [RegisteredUserController::class, 'create'])
            ->name('register');

        Route::post('register', [RegisteredUserController::class, 'store']);

        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AuthenticatedSessionController::class, 'store']);

    });

    Route::get('verify-email', [AuthController::class, 'verifyEmail'])
        ->name('verify-email');

    Route::get('forgot-password', [AuthController::class, 'forgotPassword'])
        ->name('password.request');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
