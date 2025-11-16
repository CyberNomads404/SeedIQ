<?php

namespace App\Http\Resources\Api\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $permissions = $this->getAllPermissions()->pluck('name')->toArray();
        $roles = $this->getRoleNames()->toArray();

        return [
            'external_id' => $this->external_id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'active' => $this->active,
            'phone' => $this->phone,
            'role_user' => $this->role_user,
            'roles' => $roles,
            'permissions' => $permissions,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'last_login' => [
                'web' => $this->last_session_web,
                'api' => $this->last_session_api,
            ],
            'dashboard' => [
                'quantity_classifications' => $this->classifications()->count(),
            ]
        ];
    }
}
