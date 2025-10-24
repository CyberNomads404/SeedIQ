<?php

return [
    "application_keys" => [
        'seediq-ai' => env('SEEDIQ_AI_API_KEY', 'your-seediq-ai-api-key'),
    ],

    'application_access' => [
        'seediq-ai' => [
            'url' => env('SEEDIQ_AI_API_URL', 'http://192.168.0.127:8000/api/'),
            'token' => env('SEEDIQ_AI_API_ACCESS_TOKEN', 'your-seediq-ai-access-token'),
        ],
    ],
];
