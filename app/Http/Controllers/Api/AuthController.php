<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ExceptionResponse;
use App\Http\Controllers\Traits\RepositoryTrait;
use Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class AuthController extends Controller
{
    use \App\Http\Controllers\Traits\ValidatesRequests;
    use AuthorizesRequests;
    use RepositoryTrait;
    use ExceptionResponse;

    protected $model;

    protected $authUser;

    public function __construct()
    {
        $user = Auth::guard('sanctum')->user();

        $this->authUser = $user;
    }
}
