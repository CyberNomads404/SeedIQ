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

                $this->markAs(StatusTypeEnum::FAILED->value);
                return;
            }

            $this->markAs(StatusTypeEnum::COMPLETED->value);

            Log::info('Análise enviada com sucesso', [
                'classification_id' => $this->classification->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Erro ao enviar análise', [
                'classification_id' => $this->classification->id,
                'error' => $e->getMessage(),
            ]);

            $this->markAs(StatusTypeEnum::FAILED->value);
        }
    }

    private function buildPayload(): array
    {
        return [
            'callback_url' => "https://webhook.site/42c76dba-1db2-496f-8ce2-411b4f181c93",
            'payload' => [
                'external_id' => $this->classification->external_id,
                'image_url' => $this->classification->file_url,
                'seed_category' => $this->classification->category_for_display->tag,
            ],
        ];
    }

    private function markAs(string $status): void
    {
        $this->classification->update(['status' => $status]);
    }
}
