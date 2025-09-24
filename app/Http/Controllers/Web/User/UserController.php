<?php

namespace App\Http\Controllers\Web\User;

use App\Enums\ActiveRoleUserEnum;
use App\Http\Controllers\Web\AuthController;
use App\Http\Requests\Web\User\UserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;
use Str;

class UserController extends AuthController
{
    protected $model = User::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'role');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterName = request()->get('filter_name', '');
        $filterEmail = request()->get('filter_email', '');
        $filterRole = request()->get('filter_role', '');
        $filterStatus = request()->get('filter_status', '');
        $filterCreatedAtStart = request()->get('filter_created_at_start', '');
        $filterCreatedAtEnd = request()->get('filter_created_at_end', '');

        $allowedSortColumns = ['name', 'email', 'role', 'status', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $users = $this->model::query()
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->when($search, fn($query) => $query->where('users.name', 'like', "%$search%")->orWhere('users.email', 'like', "%$search%"))
            ->when($filterName, fn($query) => $query->where('users.name', 'like', "%$filterName%"))
            ->when($filterEmail, fn($query) => $query->where('users.email', 'like', "%$filterEmail%"))
            ->when($filterRole, fn($query) => $query->where('roles.name', 'like', "%$filterRole%"))
            ->when($filterStatus, fn($query) => $query->where('users.active', $filterStatus === 'active' ? 1 : 0))
            ->when($filterCreatedAtStart, fn($query) => $query->where('users.created_at', '>=', $filterCreatedAtStart))
            ->when($filterCreatedAtEnd, fn($query) => $query->where('users.created_at', '<=', $filterCreatedAtEnd))
            ->whereHas('roles', function ($query) {
                $query->where('hierarchy_level', $this->authUser->hierarchyLevel() == ActiveRoleUserEnum::SUPPORT->hierarchyLevel() ? '>=' : '>', $this->authUser->hierarchyLevel());
            })
            ->orderBy($sortColumn === 'role' ? 'roles.hierarchy_level' : ($sortColumn === 'status' ? 'users.active' : "users.$sortColumn"), $sortDirection)
            ->when($sortColumn !== 'role', fn($query) => $query->orderBy('roles.hierarchy_level', 'asc'))
            ->when($sortColumn !== 'name' && $sortColumn !== 'role', fn($query) => $query->orderBy('users.name', 'asc'))
            ->select('users.*')
            ->paginate($perPage);

        return Inertia::render('auth/painel/user/index', [
            'users' => $users,
            'rolesForCreateOptions' => $this->getRolesForCreateOptions(),
            'queryParams' => [
                'search' => $search,
                'sort_column' => $sortColumn,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'filter_name' => $filterName,
                'filter_email' => $filterEmail,
                'filter_role' => $filterRole,
                'filter_status' => $filterStatus,
                'filter_created_at_start' => $filterCreatedAtStart,
                'filter_created_at_end' => $filterCreatedAtEnd,
            ]
        ]);
    }

    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $role = Role::findOrFail($data['role_id']);
        $this->authorize('store', [User::class, $role]);

        $data['password'] = bcrypt($data['password']);

        if (isset($data['active'])) {
            $data['active'] = (bool) $data['active'] ? 1 : 0;
        }

        if ($request->hasFile('avatar')) {
            $data['avatar'] = uploadFile($request->file('avatar'), 'users/avatar', 's3');
        }

        $user = $this->model::create($data);
        $user->assignRole($role);

        session()->flash('success', 'Usuário criado com sucesso');
    }

    public function update(UserRequest $request, string $uuid)
    {
        $user = $this->findBy(new $this->model, $uuid);
        $this->authorize('update', $user);
        $data = $request->validated();
        $oldRole = $user->roles->first();

        if (isset($data['active'])) {
            if ($user->id == $this->authUser->id) {
                session()->flash('error', 'Você não pode desativar sua própria conta');
                return redirect()->back();
            }

            $data['active'] = (bool) $data['active'] ? 1 : 0;
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        if (array_key_exists('avatar', $data)) {
            if ($data['avatar'] === null) {
                deleteFile($user->getRawOriginal('avatar'), 's3');
                $data['avatar'] = null;
            } elseif ($request->file('avatar') instanceof \Illuminate\Http\UploadedFile) {
                $data['avatar'] = getFile($request->file('avatar'), 'users/avatar', 's3', $user->getRawOriginal('avatar'));
            } elseif (is_string($data['avatar'])) {
                $data['avatar'] = getFile($data['avatar'], 'users/avatar', 's3', $user->getRawOriginal('avatar'));
            }
        }

        $user->update($data);

        $roleChanged = false;

        if (isset($data['role_id'])) {
            $newRole = Role::findOrFail($data['role_id']);
            if (!$oldRole || $oldRole->id !== $newRole->id) {
                $user->syncRoles($newRole);
                $roleChanged = true;
            }
        }

        if ($roleChanged) {
            Audit::create([
                'user_type' => get_class(auth()->user()),
                'user_id' => auth()->id(),
                'event' => 'updated',
                'auditable_type' => User::class,
                'auditable_id' => $user->id,
                'old_values' => ['role' => $oldRole ? $oldRole->name : null],
                'new_values' => ['role' => $newRole->name],
                'url' => request()->fullUrl(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        session()->flash('success', 'Usuário atualizado com sucesso');
    }

    public function destroy(string $uuid)
    {
        $user = $this->findBy(new $this->model, $uuid);
        $this->authorize('delete', $user);

        if ($user->avatar) {
            deleteFile($user->avatar, 's3');
        }
        $user->delete();

        session()->flash('success', 'Usuário deletado com sucesso');
    }

    public function resetPassword(string $uuid)
    {
        $user = $this->findBy(new $this->model, $uuid);
        $this->authorize('update', $user);

        $newPassword = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
        $user->update(['password' => bcrypt($newPassword)]);

        session()->flash('success', "Senha redefinida com sucesso.");

        return redirect()->route('users.index')->with('newPassword', $newPassword);
    }


    public function show(string $uuid)
    {
        $user = $this->findBy(new $this->model, $uuid);
        $this->authorize('view', $user);

        $logsPerPage = request()->get('logs_per_page', 10);
        $logsPage = request()->get('logs_page', 1);

        $logsSearch = request()->get('logs_search', '');
        $logsEvent = request()->get('logs_event', '');
        $logsType = request()->get('logs_type', '');
        $logsDateFrom = request()->get('logs_date_from', '');
        $logsDateTo = request()->get('logs_date_to', '');
        $logsSortColumn = request()->get('logs_sort_column', 'created_at');
        $logsSortDirection = request()->get('logs_sort_direction', 'desc');

        $allowedLogsSortColumns = ['created_at', 'event', 'auditable_type', 'ip_address'];
        if (!in_array($logsSortColumn, $allowedLogsSortColumns)) {
            $logsSortColumn = 'created_at';
        }

        if (!in_array($logsSortDirection, ['asc', 'desc'])) {
            $logsSortDirection = 'desc';
        }

        $logs = Audit::where('user_id', $user->id)
            ->with('user:id,name')
            ->when($logsSearch, function ($query) use ($logsSearch) {
                $query->where(function ($q) use ($logsSearch) {
                    $q->where('event', 'like', "%$logsSearch%")
                        ->orWhere('auditable_type', 'like', "%$logsSearch%")
                        ->orWhere('ip_address', 'like', "%$logsSearch%")
                        ->orWhereHas('user', function ($userQuery) use ($logsSearch) {
                            $userQuery->where('name', 'like', "%$logsSearch%");
                        });
                });
            })
            ->when($logsEvent, fn($query) => $query->where('event', $logsEvent))
            ->when($logsType, fn($query) => $query->where('auditable_type', 'like', "%$logsType%"))
            ->when($logsDateFrom, fn($query) => $query->whereDate('created_at', '>=', $logsDateFrom))
            ->when($logsDateTo, fn($query) => $query->whereDate('created_at', '<=', $logsDateTo))
            ->orderBy($logsSortColumn, $logsSortDirection)
            ->paginate($logsPerPage, ['*'], 'logs_page', $logsPage)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'user_id' => $log->user_id,
                    'user_name' => $log->user->name ?? 'Sistema',
                    'auditable_type' => class_basename($log->auditable_type),
                    'auditable_id' => $log->auditable_id,
                    'event' => $log->event,
                    'old_values' => $log->old_values ?? [],
                    'new_values' => $log->new_values ?? [],
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->format('d/m/Y H:i:s'),
                ];
            });

        $availableEvents = Audit::where('user_id', $user->id)
            ->distinct()
            ->pluck('event')
            ->filter()
            ->sort()
            ->values();

        $availableTypes = Audit::where('user_id', $user->id)
            ->distinct()
            ->pluck('auditable_type')
            ->map(fn($type) => class_basename($type))
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('auth/painel/user/[uuid]/index', [
            'user' => $user,
            'rolesForCreateOptions' => $this->getRolesForCreateOptions(),
            'logs' => $logs,
            'logsQueryParams' => [
                'logs_search' => $logsSearch,
                'logs_event' => $logsEvent,
                'logs_type' => $logsType,
                'logs_date_from' => $logsDateFrom,
                'logs_date_to' => $logsDateTo,
                'logs_sort_column' => $logsSortColumn,
                'logs_sort_direction' => $logsSortDirection,
                'logs_per_page' => $logsPerPage,
            ],
            'logsFilters' => [
                'events' => $availableEvents,
                'types' => $availableTypes,
            ]
        ]);
    }

    public function active(string $uuid)
    {
        $user = $this->findBy(new $this->model, $uuid);
        $this->authorize('update', $user);

        if ($user->id == $this->authUser->id) {
            session()->flash('error', 'Você não pode desativar sua própria conta');
            return redirect()->back();
        }

        $user->update(['active' => !$user->active]);

        session()->flash('success', 'Usuário atualizado com sucesso');
    }

    private function getRolesForCreateOptions()
    {
        return Role::query()
            ->where('hierarchy_level', $this->authUser->hierarchyLevel() == ActiveRoleUserEnum::SUPPORT->hierarchyLevel() ? '>=' : '>', $this->authUser->hierarchyLevel())
            ->orderBy('hierarchy_level', 'asc')
            ->get(['id as value', 'name as label']);
    }
}
