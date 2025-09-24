<?php

require __DIR__ . '/web/unauth/routes.php';
require __DIR__ . '/web/auth/routes.php';
require __DIR__ . '/web/auth.php';

Route::get('/', function () {
    return redirect()->route('login');
});

