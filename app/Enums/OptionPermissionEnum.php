<?php

namespace App\Enums;

enum OptionPermissionEnum: string
{
    case LIST = 'list';
    case CREATE = 'create';
    case EDIT = 'edit';
    case DELETE = 'delete';
    case SHOW = 'show';

    public function label(): string
    {
        return match ($this) {
            self::LIST => 'Listar',
            self::CREATE => 'Criar',
            self::EDIT => 'Editar',
            self::DELETE => 'Deletar',
            self::SHOW => 'Visualizar',
        };
    }

    public static function optionsForTables(): array
    {
        return [
            self::LIST,
            self::CREATE,
            self::EDIT,
            self::DELETE,
        ];
    }

    public static function translate(string $option): string
    {
        foreach (self::cases() as $case) {
            if ($case->value === $option) {
                return $case->label();
            }
        }

        return $option;
    }
}
