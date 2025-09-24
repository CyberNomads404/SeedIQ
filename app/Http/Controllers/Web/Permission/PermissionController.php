<?php

namespace App\Http\Controllers\Web\Permission;

use App\Enums\ActiveRoleUserEnum;
use App\Enums\OptionPermissionEnum;
use App\Enums\TableNameEnum;
use App\Http\Controllers\Web\AuthController;
use App\Http\Requests\Web\Permission\PermissionRequest;
use DB;
use Inertia\Inertia;

class PermissionController extends AuthController
{
    protected $model = \App\Models\Permission::class;

    protected $modelRole = \App\Models\Role::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'name');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterName = request()->get('filter_name', '');
        $filterTitle = request()->get('filter_title', '');

        $allowedSortColumns = ['name', 'title', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $permissions = $this->model::query()
            ->when($search, fn($query) => $query->where('name', 'like', "%$search%")->orWhere('title', 'like', "%$search%"))
            ->when($filterName, fn($query) => $query->where('name', 'like', "%$filterName%"))
            ->when($filterTitle, fn($query) => $query->where('title', 'like', "%$filterTitle%"))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        $tables = collect(DB::select('SHOW TABLES'))
            ->map(fn($table) => reset($table))
            ->toArray();

        return Inertia::render('auth/painel/permission/index', [
            'permissions' => $permissions,
            'tables' => $tables,
            'queryParams' => [
                'search' => $search,
                'sort_column' => $sortColumn,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'filter_name' => $filterName,
                'filter_title' => $filterTitle,
            ]
        ]);
    }

    public function store(PermissionRequest $request)
    {
        $data = $request->validated();

        if (!$data['is_for_table']) {
            $permission = $this->model::create([
                'name' => $data['name'],
                'title' => $data['title'],
            ]);

            $this->modelRole::where('name', ActiveRoleUserEnum::SUPPORT)->first()->givePermissionTo($permission);
        } else if ($data['is_for_table']) {
            $options = collect(OptionPermissionEnum::optionsForTables())->map(fn($perm) => $perm->value);

            $permissions = [];
            foreach ($options as $option) {
                $permissions[] = $this->model::firstOrCreate([
                    'name' => $data['table_name'] . '_' . $option,
                    'title' =>  OptionPermissionEnum::translate($option) . ' ' . TableNameEnum::translate($data['table_name']),
                ]);
            }
            $this->modelRole::where('name', ActiveRoleUserEnum::SUPPORT)->first()->givePermissionTo($permissions);
        }

        session()->flash('success', 'Permissão criada com sucesso');
    }

    public function update(PermissionRequest $request, $id)
    {
        $permission = $this->model::findOrFail($id);
        $permission->update($request->validated());

        session()->flash('success', 'Permissão atualizada com sucesso');
    }

    public function destroy($id)
    {
        $permission = $this->model::findOrFail($id);
        $permission->delete();
        $this->modelRole::where('name', ActiveRoleUserEnum::SUPPORT)->first()->revokePermissionTo($permission);

        session()->flash('success', 'Permissão deletada com sucesso');
    }
}
