<?php

namespace App\Services\Url;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class UrlService
{
    private static string $baseUrl;

    /**
     * Inicializa as variáveis estáticas da classe.
     */
    public static function init()
    {
        $local = rtrim(
            config('constants.urls.front_end_local', env('APP_URL_FRONTEND_LOCAL', 'http://localhost:3000')),
            '/'
        );
        $prod = rtrim(
            config('constants.urls.front_end_production', env('APP_URL_FRONTEND_PRODUCTION', 'https://seusite.com')),
            '/'
        );

        self::$baseUrl = env('APP_ENV') === 'local'
            ? ($local ?? 'http://localhost:3000')
            : ($prod ?? 'https://seusite.com');
    }


    /**
     * Gera um link assinado para o frontend a partir de uma rota nomeada do Laravel.
     *
     * @param string $route        Nome da rota Laravel
     * @param array  $parameters   Parâmetros da rota
     * @param int    $expiration   Tempo de expiração em minutos
     * @param string $frontendPath Caminho no frontend para redirecionar
     *
     * @return string URL formatada para o frontend
     */
    public static function generateSignedVerifyEmailFrontEndUrl(
        string $route,
        array $parameters = [],
        int $expiration = 60,
        string $frontendPath = ''
    ): string {
        $originalRootUrl = config('app.url');

        if (app()->environment('local')) {
            $port = config('app.port', '8080');
            if (strpos($originalRootUrl, ':' . $port) === false) {
                $originalRootUrl .= ':' . $port;
            }
        }

        $originalScheme = config('app.url_scheme', 'http');

        URL::forceRootUrl($originalRootUrl);
        URL::forceScheme($originalScheme);

        $url = URL::temporarySignedRoute(
            $route,
            now()->addMinutes($expiration),
            $parameters
        );

        return self::formattedSignedVerifyEmailFrontEndUrl($url, $frontendPath);
    }

    public static function formattedSignedVerifyEmailFrontEndUrl(
        string $url,
        string $frontendPath = ''
    ): string {
        self::init();

        \Log::debug("URL original para verificação de email: {$url}");

        $urlPath = parse_url($url, PHP_URL_PATH);
        $queryString = parse_url($url, PHP_URL_QUERY);

        $segments = explode('/', trim($urlPath, '/'));
        $parts = array_slice($segments, -2); // pega [id, hash]

        if (count($parts) !== 2) {
            \Log::warning("URL inválida para verificação de email: {$url}");
            return self::$baseUrl . $frontendPath;
        }

        [$userId, $hash] = $parts;

        return self::$baseUrl . $frontendPath . "?user={$userId}&hash={$hash}&{$queryString}";
    }

    public static function formattedSignedResetPasswordFrontEndUrl(
        string $frontendPath = '',
        string $userId = '',
        string $token = '',
    ): string {
        self::init();
        $finalUrl = self::$baseUrl . $frontendPath . "?user={$userId}&token={$token}";

        return $finalUrl;
    }
}
