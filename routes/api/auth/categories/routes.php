<?php

use App\Http\Controllers\Api\Category\CategoryController;

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->middleware('permission:categories_list')->name('categories.api.index');
});
