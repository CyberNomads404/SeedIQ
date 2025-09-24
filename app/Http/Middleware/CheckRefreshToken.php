<?php

namespace App\Http\Middleware;

use App\Enums\TokenTypeEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\Traits\ExceptionResponse;

class CheckRefreshToken
{
    use ExceptionResponse;

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $token = $request->bearerToken();

        if ($user && $token) {
            $tokenParts = explode('|', $token, 2);
            $plainToken = count($tokenParts) === 2 ? $tokenParts[1] : $token;

            $tokenHash = hash('sha256', $plainToken);

            $refreshToken = $user->tokens()
                ->where('token', $tokenHash)
                ->where('name', TokenTypeEnum::REFRESH_TOKEN->value)
                ->first();

            if (!$refreshToken) {
                return $this->responseMessage('error', trans('responses.error.token_invalid_or_expired'), 401);
            }

            if ($refreshToken->expires_at && now()->greaterThan($refreshToken->expires_at)) {
                $refreshToken->delete();

                return $this->responseMessage('error', trans('responses.error.token_invalid_or_expired'), 401);
            }
        }

        return $next($request);
    }
}
