<?php

use Illuminate\Support\Str;

if (!function_exists('generatePassword')) {
    function generatePassword($lenght = 10)
    {
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $lenght);
    }
}

if (!function_exists('detectDateFormat')) {
    function detectDateFormat($date)
    {
        if (preg_match('/\d{2}\/\d{2}\/\d{4}/', $date)) {
            return 'd/m/Y';
        } elseif (preg_match('/\d{4}-\d{2}-\d{2}/', $date)) {
            return 'Y-m-d';
        }

        return 'd/m/Y';
    }
}

if (!function_exists('generateUuid')) {
    function generateUuid()
    {
        return Str::uuid()->toString();
    }
}
