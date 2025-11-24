<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\DashboardController;


Route::prefix('/')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    require 'permissions/routes.php';
    require 'roles/routes.php';
    require 'users/routes.php';
    require 'feedbacks/routes.php';
    require 'categories/routes.php';
    require 'classifications/routes.php';
});
