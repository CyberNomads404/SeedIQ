<?php

namespace App\Jobs;

use App\Enums\StatusTypeEnum;
use App\Models\Classification;
use App\Services\Http\HttpRequestService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendClassificationForAnalyze implements ShouldQueue
{
    use Queueable;

    protected Classification $classification;

    public function __construct(Classification $classification)
    {
        $this->classification = $classification;
    }

    public function handle(HttpRequestService $httpRequestService): void
    {
        $url = rtrim(config('webhook.application_access.seediq-ai.url'), '/') . '/webhook/analyze/enqueue';
        $headers = [
            'Authorization' => 'Bearer ' . config('webhook.application_access.seediq-ai.token'),
            'Content-Type' => 'application/json',
        ];

        $body = $this->buildPayload();

        try {
            $response = $httpRequestService->send($url, $body, $headers);

            if (empty($response) || ($response['status'] ?? null) !== true) {
                Log::warning('Webhook response inválida', [
                    'classification_id' => $this->classification->id,
                    'response' => $response,
                ]);

                $this->classification->markAs(StatusTypeEnum::FAILED->value);
                return;
            }

            $this->classification->markAs(StatusTypeEnum::IN_PROGRESS->value);

            Log::info('Análise enviada com sucesso', [
                'classification_id' => $this->classification->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Erro ao enviar análise', [
                'classification_id' => $this->classification->id,
                'error' => $e->getMessage(),
            ]);

            $this->classification->markAs(StatusTypeEnum::FAILED->value);
        }
    }

    private function buildPayload(): array
    {
        $callback = route('webhook.analyze.set_result');

        return [
            'callback_url' => $this->normalizeCallbackUrl($callback),
            'payload' => [
                'external_id' => $this->classification->external_id,
                'image_url' => $this->classification->file_url,
                'seed_category' => $this->classification->category_for_display->tag,
            ],
        ];
    }

    private function normalizeCallbackUrl(string $url): string
    {
        $parts = parse_url($url);

        if (! $parts || empty($parts['host'])) {
            return $url;
        }

        $host = $parts['host'];

        if (! in_array($host, ['localhost', '127.0.0.1'], true)) {
            return $url;
        }

        $scheme = $parts['scheme'] ?? 'http';
        $path = $parts['path'] ?? '/';
        $query = isset($parts['query']) ? ('?' . $parts['query']) : '';

        $replaceHost = getenv('API_SERVICE_HOST') ?: '172.17.0.1';
        $replacePort = getenv('API_SERVICE_PORT') ?: '80';

        $portPart = $replacePort ? ':' . $replacePort : '';
        return sprintf('%s://%s%s%s%s', $scheme, $replaceHost, $portPart, $path, $query);
    }
}
