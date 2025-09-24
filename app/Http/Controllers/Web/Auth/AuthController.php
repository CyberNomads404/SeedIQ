<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function verifyEmail(){
        return Inertia::render('auth/verify-email');
    }

    public function forgotPassword(): Response
    {
        return Inertia::render('auth/forgot-password');
    }
}
