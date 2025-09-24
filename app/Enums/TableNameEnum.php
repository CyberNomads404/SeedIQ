<?php

namespace App\Enums;

enum TableNameEnum: string
{
    case AUDITS = 'audits';
    case CACHE = 'cache';
    case CACHE_LOCKS = 'cache_locks';
    case FAILED_JOBS = 'failed_jobs';
    case JOB_BATCHES = 'job_batches';
    case JOBS = 'jobs';
    case MIGRATIONS = 'migrations';
    case MODEL_HAS_PERMISSIONS = 'model_has_permissions';
    case MODEL_HAS_ROLES = 'model_has_roles';
    case PASSWORD_RESET_TOKENS = 'password_reset_tokens';
    case PERMISSIONS = 'permissions';
    case ROLE_HAS_PERMISSIONS = 'role_has_permissions';
    case ROLES = 'roles';
    case SESSIONS = 'sessions';
    case USERS = 'users';

    /**
     * Retorna a tradução do nome da tabela.
     */
    public function label(): string
    {
        return match ($this) {
            self::AUDITS => 'Auditorias',
            self::CACHE => 'Cache',
            self::CACHE_LOCKS => 'Bloqueios de Cache',
            self::FAILED_JOBS => 'Jobs Falhados',
            self::JOB_BATCHES => 'Lotes de Jobs',
            self::JOBS => 'Jobs',
            self::MIGRATIONS => 'Migrações',
            self::MODEL_HAS_PERMISSIONS => 'Modelos com Permissões',
            self::MODEL_HAS_ROLES => 'Modelos com Papéis',
            self::PASSWORD_RESET_TOKENS => 'Tokens de Reset de Senha',
            self::PERMISSIONS => 'Permissões',
            self::ROLE_HAS_PERMISSIONS => 'Papéis com Permissões',
            self::ROLES => 'Papéis',
            self::SESSIONS => 'Sessões',
            self::USERS => 'Usuários',
        };
    }

    /**
     * Retorna a tradução de uma tabela pelo nome original.
     */
    public static function translate(string $table): string
    {
        foreach (self::cases() as $case) {
            if ($case->value === $table) {
                return $case->label();
            }
        }

        return ucfirst(str_replace('_', ' ', $table));
    }
}
