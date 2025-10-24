<?php

namespace App\Services\Http;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Throwable;

class HttpRequestService
{
    protected Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Envia uma requisição HTTP genérica.
     *
     * @param string $url
     * @param array $body
     * @param array $headers
     * @param string $method
     * @return array|null
     */
    public function send(string $url, array $body = [], array $headers = [], string $method = 'POST'): ?array
    {
        try {
            $response = $this->client->request($method, $url, [
                'headers' => $headers,
                'json' => $body,
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            Log::info('Requisição HTTP enviada com sucesso', [
                'url' => $url,
                'method' => $method,
                'status' => $response->getStatusCode(),
                'body' => $body,
                'response' => $responseData,
            ]);

            return $responseData;
        } catch (Throwable $e) {
            Log::error('Erro ao enviar requisição HTTP', [
                'url' => $url,
                'method' => $method,
                'body' => $body,
                'headers' => $headers,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
