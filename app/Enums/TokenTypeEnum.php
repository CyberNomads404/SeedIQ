<?php

namespace App\Enums;

use App\Enums\Traits\EnumTrait;

enum TokenTypeEnum: string
{
    use EnumTrait;

    case ACCESS_TOKEN = 'access_token';
    case REFRESH_TOKEN = 'refresh_token';

    public function label(): string
    {
        return match ($this) {
            self::ACCESS_TOKEN => 'Access Token',
            self::REFRESH_TOKEN => 'Refresh Token',
        };
    }
}
