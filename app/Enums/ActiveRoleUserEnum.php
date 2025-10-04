<?php

namespace App\Enums;

use App\Enums\Traits\EnumTrait;

enum ActiveRoleUserEnum: string
{
    use EnumTrait;

    case SUPPORT = 'Suporte';
    case ADMIN = 'Administrador(a)';
    case OPERATOR = 'Operador(a)';

    // .....

    case DEFAULT = 'Default';

    public function hierarchyLevel(): string
    {
        return match ($this) {
            self::SUPPORT => '0',
            self::ADMIN => '1',
            self::OPERATOR => '100',
            // ....

            self::DEFAULT => '99999',
        };
    }
}
