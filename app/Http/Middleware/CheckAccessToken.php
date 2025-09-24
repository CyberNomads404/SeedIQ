<?php

namespace App\Http\Middleware;

use App\Enums\TokenTypeEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\Traits\ExceptionResponse;

class CheckAccessToken
{
    use ExceptionResponse;

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $token = $request->bearerToken();

        if ($user && $token) {

            if (!$user->active) {
                return $this->responseMessage('error', trans('responses.error.user_inactive'), 403);
            }

            if (!$user->hasPermissionTo('login_mobile')) {
                return $this->responseMessage('error', trans('responses.error.permission_denied'), 403);
            }

            $tokenParts = explode('|', $token, 2);
            $plainToken = count($tokenParts) === 2 ? $tokenParts[1] : $token;

            $tokenHash = hash('sha256', $plainToken);

            $accessToken = $user->tokens()
                ->where('token', $tokenHash)
                ->where('name', TokenTypeEnum::ACCESS_TOKEN->value)
                ->first();

            if (!$accessToken) {
                return $this->responseMessage('error', trans('responses.error.token_invalid_or_expired'), 401);
            }

            if ($accessToken->expires_at && now()->greaterThan($accessToken->expires_at)) {
                $accessToken->delete();

                return $this->responseMessage('error', trans('responses.error.token_invalid_or_expired'), 401);
            }
        }

        return $next($request);
    }
}
