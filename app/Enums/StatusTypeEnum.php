<?php

namespace App\Enums;

use App\Enums\Traits\EnumTrait;

enum StatusTypeEnum: string
{
    use EnumTrait;

    case REGISTERED = 'registered';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
    case CANCELED = 'canceled';

    public function label(): string
    {
        return match ($this) {
            self::REGISTERED => 'Registrado',
            self::IN_PROGRESS => 'Em Progresso',
            self::COMPLETED => 'Concluído',
            self::FAILED => 'Falhou',
            self::CANCELED => 'Cancelado',
        };
    }
}
