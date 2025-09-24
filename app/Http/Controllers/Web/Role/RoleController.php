<?php

namespace App\Http\Controllers\Web\Role;

use App\Enums\ActiveRoleUserEnum;
use App\Http\Controllers\Web\AuthController;
use App\Http\Requests\Web\Role\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends AuthController
{
    protected $model = Role::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'hierarchy_level');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterName = request()->get('filter_name', '');
        $filterHierarchy = request()->get('filter_hierarchy', '');

        $allowedSortColumns = ['name', 'hierarchy_level', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'hierarchy_level';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $roles = $this->model::query()
            ->when($search, fn($query) => $query->where('name', 'like', "%$search%"))
            ->when($filterName, fn($query) => $query->where('name', 'like', "%$filterName%"))
            ->when($filterHierarchy, fn($query) => $query->where('hierarchy_level', $filterHierarchy))
            ->where('hierarchy_level', $this->authUser->hierarchyLevel() == ActiveRoleUserEnum::SUPPORT->hierarchyLevel() ? '>=' : '>', $this->authUser->hierarchyLevel())
            ->orderBy($sortColumn, $sortDirection)
            ->when($sortColumn !== 'name', fn($query) => $query->orderBy('name', 'asc'))
            ->paginate($perPage);

        return Inertia::render('auth/painel/role/index', [
            'roles' => $roles,
            'queryParams' => [
                'search' => $search,
                'sort_column' => $sortColumn,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'filter_name' => $filterName,
                'filter_hierarchy' => $filterHierarchy,
            ]
        ]);
    }

    public function store(RoleRequest $request)
    {
        $data = $request->validated();

        $role = $this->model::create([...$data, 'hierarchy_level' => ActiveRoleUserEnum::DEFAULT->hierarchyLevel()]);

        session()->flash('success', 'Perfil criado com sucesso');
        return redirect()->route('roles.show', $role->id);
    }

    public function update(RoleRequest $request, $id)
    {
        $role = $this->model::findOrFail($id);
        $this->authorize('update', $role);

        $data = $request->validated();
        $role->update($data);

        session()->flash('success', 'Perfil atualizado com sucesso');
        return redirect()->route('roles.show', $role->id);
    }

    public function destroy($id)
    {
        $role = $this->model::findOrFail($id);
        $this->authorize('delete', $role);

        $role->delete();

        session()->flash('success', 'Perfil deletado com sucesso');
    }

    public function show($id)
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'title');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterTitle = request()->get('filter_title', '');
        $filterName = request()->get('filter_name', '');

        $allowedSortColumns = ['name', 'title', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'title';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $role = $this->model::findOrFail($id);
        $this->authorize('view', $role);

        $permissions = $role
            ->permissions()
            ->when($search, fn($query) => $query->where('title', 'like', "%$search%")->orWhere('name', 'like', "%$search%"))
            ->when($filterTitle, fn($query) => $query->where('title', 'like', "%$filterTitle%"))
            ->when($filterName, fn($query) => $query->where('name', 'like', "%$filterName%"))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        $permissions_select = $this->authUser->hasRole(ActiveRoleUserEnum::SUPPORT->value)
        ? Permission::query()
            ->whereDoesntHave('roles', fn($q) => $q->where('id', $role->id))
            ->get()
            ->map(fn($permission) => ['value' => (string) $permission->id, 'label' => $permission->title])
            ->values()
        : $this->authUser->getAllPermissions()
            ->filter(fn($permission) => !$role->hasPermissionTo($permission))
            ->map(fn($permission) => ['value' => (string) $permission->id, 'label' => $permission->title])
            ->values();

        return Inertia::render('auth/painel/role/[id]/index', [
            'permissions' => $permissions,
            'queryParams' => [
                'search' => $search,
                'sort_column' => $sortColumn,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'filter_title' => $filterTitle,
                'filter_name' => $filterName,
            ],
            'role' => $role,
            'permissions_select' => $permissions_select,
        ]);
    }

    public function attachPermissions(Request $request, $id)
    {
        $data = $this->validateRequest($request, [
            'permissions_id' => ['required', 'array'],
            'permissions_id.*' => ['required', 'exists:permissions,id']
        ]);

        $role = $this->model::findOrFail($id);
        $this->authorize('update', $role);

        $permissions = Permission::findOrFail($data['permissions_id']);
        $role->givePermissionTo($permissions);

        session()->flash('success', 'Permissões atribuídas com sucesso');
    }

    public function detachPermission($id, $permission_id)
    {
        $role = $this->model::findOrFail($id);
        $this->authorize('update', $role);

        $permission = Permission::findOrFail($permission_id);
        $role->revokePermissionTo($permission);

        session()->flash('success', 'Permissão removida com sucesso');
    }
}
