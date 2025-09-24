<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class UnAuthController extends Controller
{
    public function faq(){
        return Inertia::render('quest/faq');
    }

    public function userManual() {
        return Inertia::render('quest/user_manual');
    }

    public function privacy() {
        return Inertia::render('quest/privacy');
    }

    public function termsOfUse() {
        return Inertia::render('quest/terms_of_use');
    }
}
