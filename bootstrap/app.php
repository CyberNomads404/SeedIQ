<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureUserIsActive;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            EnsureUserIsActive::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'check.access.token' => \App\Http\Middleware\CheckAccessToken::class,
            'check.refresh.token' => \App\Http\Middleware\CheckRefreshToken::class,
            'validate.api.token' => \App\Http\Middleware\ValidateWebhookKey::class,
        ]);

        $middleware->append([
            \App\Http\Middleware\SetLanguage::class,
        ]);

        // $middleware->api(append: [

        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('responses.error.token_invalid_or_expired'),
                    'data' => [],
                ], 401);
            }

            return null;
        });

        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => trans('responses.error.too_many_attempts'),
                    'data' => [],
                ], 429);
            }

            return null;
        });

        // $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, $request) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'User does not have the right permissions.',
        //         'errors' => [
        //             'permission' => 'You do not have the required permissions to access this resource.'
        //         ]
        //     ], 403);
        // });
    })->create();
