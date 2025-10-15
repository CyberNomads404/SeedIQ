<?php

namespace Database\Seeders;

use App\Enums\ActiveRoleUserEnum;
use App\Enums\OptionPermissionEnum;
use App\Enums\TableNameEnum;
use DB;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = $this->getAllTables();

        $permissions = [];
        foreach ($tables as $table) {
            $permissions[$table] = ['list', 'create', 'edit', 'delete'];
        }

        $this->createRoleWithPermissions(ActiveRoleUserEnum::SUPPORT->value, [
            ...$permissions,
            // 'report' => [
            //     [
            //         'pay_roll' => "Relatório de Folha de Pagamento",
            //     ]
            // ],
            'login' => [
                [
                    'web' => 'Authorization Panel Access',
                ]
            ],
        ]);

        $this->createRoleWithPermissions(ActiveRoleUserEnum::ADMIN->value, [
            'users' => ['list', 'create', 'edit', 'delete'],
            'permissions' => ['list'],
            'roles' => ['list', 'create', 'edit', 'delete'],
            'login' => [
                [
                    'web' => 'Authorization Panel Access',
                ]
            ],
            'categories' => ['list', 'create', 'edit', 'delete'],
            'classifications' => ['list', 'edit', 'delete'],
        ]);

        $this->createRoleWithPermissions(ActiveRoleUserEnum::OPERATOR->value, [
            'login' => [
                [
                    'mobile' => 'Authorization Panel Access',
                ]
            ],
            'categories' => ['list'],
            'classifications' => ['list', 'create', 'edit', 'delete'],
        ]);
    }

    protected function createRoleWithPermissions(string $roleName, array $permissions)
    {
        $role = Role::updateOrCreate(['name' => $roleName], ['hierarchy_level' => ActiveRoleUserEnum::from($roleName)->hierarchyLevel()]);

        $permissionModels = collect();

        foreach ($permissions as $model => $actions) {
            $newPermissionModels = collect($actions)->map(function ($action) use ($model) {
                if (is_array($action)) {
                    $actionKey = key($action);
                    $actionTitle = current($action);
                    return Permission::updateOrCreate(['name' => "{$model}_{$actionKey}"], ['title' => $actionTitle]);
                } else {
                    $modelTitle = TableNameEnum::translate($model);
                    $actionTitle = OptionPermissionEnum::translate($action);
                    return Permission::updateOrCreate(['name' => "{$model}_{$action}"], ['title' => "{$actionTitle} {$modelTitle}"]);
                }

            });

            $permissionModels = $permissionModels->merge($newPermissionModels);
        }

        $role->syncPermissions($permissionModels->pluck('name')->toArray());
    }

    /**
     * Obtém todas as tabelas do banco de dados, ignorando tabelas do sistema
     */
    protected function getAllTables(): array
    {
        return collect(DB::select('SHOW TABLES'))
        ->map(fn($table) => reset($table))
        ->toArray();
    }
}
