<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLanguage
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, \Closure $next): Response
    {
        $locale = $request->header('Accept-Language') ?: $request->get('lang') ?: env('APP_LOCALE', 'pt');
        if (in_array($locale, config('app.available_locales'))) {
            App::setLocale($locale);
        } else {
            APP::setLocale(env('APP_LOCALE', 'pt'));
        }

        return $next($request);
    }
}
