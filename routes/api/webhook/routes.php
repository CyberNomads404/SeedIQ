<?php

Route::prefix('/webhook')->middleware('validate.api.token')->group(function () {
    require __DIR__ . '/analyze/routes.php';
});
