<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Traits\ExceptionResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateWebhookKey
{
    use ExceptionResponse;

    public function handle(Request $request, \Closure $next, ...$allowedSessions): Response
    {
        $incomingKey = $request->header('WEBHOOK-API-KEY');
        $mapKeys = config("webhook.application_keys", []);
        $sessionName = array_search($incomingKey, $mapKeys, true);

        if (!$sessionName) {
            return $this->responseMessage(
                'error',
                trans('responses.error.unauthorized_webhook_api_key'),
                401,
            );
        }

        if (
            count($allowedSessions) > 0
            && !in_array($sessionName, $allowedSessions, true)
        ) {
            return $this->responseMessage(
                'error',
                trans('responses.error.forbidden_invalid_session'),
                403,
            );
        }

        $request->attributes->set('webhook_session', $sessionName);

        return $next($request);
    }
}
