<?php

namespace App\Http\Controllers\Web;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\RepositoryTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class AuthController extends Controller
{
    use \App\Http\Controllers\Traits\ValidatesRequests;
    use AuthorizesRequests;
    use RepositoryTrait;

    protected $model;

    protected $authUser;

    public function __construct()
    {
        $this->authUser = auth()->user();
    }
}
