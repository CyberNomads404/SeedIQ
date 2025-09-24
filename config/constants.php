<?php

return [
    'files' => [
        'default_avatar' => env('DEFAULT_AVATAR', 'https://bjjqkcvxfnxrcsxtrsai.supabase.co/storage/v1/object/public/base-images/storage/v1/s3/base-images/base-images/static/default-avatar-icon-of-social-media-user-vector.jpg'),
        'logo_url' => env('LOGO_URL', 'https://bjjqkcvxfnxrcsxtrsai.supabase.co/storage/v1/object/public/base-images/storage/v1/s3/base-images/base-images/static/logo.png'),
    ],

    'urls' => [
        'front_end_local' => env('APP_URL_FRONTEND_LOCAL', 'http://localhost:3000'),
        'front_end_production' => env('APP_URL_FRONTEND_PRODUCTION', 'https://base-laravel.vercel.app'),
    ],
];
