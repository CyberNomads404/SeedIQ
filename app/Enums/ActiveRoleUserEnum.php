<?php

namespace App\Enums;

use App\Enums\Traits\EnumTrait;

enum ActiveRoleUserEnum: string
{
    use EnumTrait;

    case SUPPORT = 'Suporte';
    case ADMIN = 'Administrador(a)';
    case CLIENT = 'Cliente';

    // .....

    case DEFAULT = 'Default';

    public function hierarchyLevel(): string
    {
        return match ($this) {
            self::SUPPORT => '0',
            self::ADMIN => '1',
            self::CLIENT => '1000',
            // ....

            self::DEFAULT => '99999',
        };
    }
}
