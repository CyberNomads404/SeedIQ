<?php

namespace App\Jobs;

use App\Services\Http\HttpRequestService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendRequestHttpWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $url;
    protected array $body;
    protected array $headers;
    protected string $method;

    public function __construct(
        string $url,
        array $body = [],
        array $headers = [],
        string $method = 'POST'
    ) {
        $this->url = $url;
        $this->body = $body;
        $this->headers = $headers;
        $this->method = $method;
    }

    public function handle(HttpRequestService $http)
    {
        $http->send(
            url: $this->url,
            body: $this->body,
            headers: $this->headers,
            method: $this->method
        );
    }
}
