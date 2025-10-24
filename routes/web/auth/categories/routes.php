<?php

use App\Http\Controllers\Web\Category\CategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('categories')->group(function () {
    Route::get("/", [CategoryController::class, 'index'])->middleware('permission:categories_list')->name('categories.index');
    Route::post("/", [CategoryController::class, 'store'])->middleware('permission:categories_create')->name('categories.store');
    Route::put("/{external_id}", [CategoryController::class, 'update'])->middleware('permission:categories_edit')->name('categories.update');
    Route::delete("/{external_id}", [CategoryController::class, 'destroy'])->middleware('permission:categories_delete')->name('categories.destroy');
});
