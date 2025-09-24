<?php

use App\Http\Controllers\Web\Auth\UnAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/faq', [UnAuthController::class, 'faq'])->name('faq');

Route::get('/user-manual', [UnAuthController::class, 'userManual'])->name('user_manual');

Route::get('/privacy', [UnAuthController::class, 'privacy'])->name('privacy');

Route::get('/terms-of-use', [UnAuthController::class, 'termsOfUse'])->name('terms_of_use');

require 'feedbacks/routes.php';
