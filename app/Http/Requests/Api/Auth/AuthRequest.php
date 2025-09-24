<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\Api\Traits\CrudRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\User;

class AuthRequest extends CrudRequest
{
    protected $type = User::class;

    /**
     * Rules when editing resource.
     *
     * @return array
     */
    protected function editRules()
    {
        $rules = [
            'name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'avatar' => [
                'sometimes',
                'nullable',
                'string_or_image',
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],
        ];

        return $rules;
    }

    /**
     * Rules when creating resource.
     *
     * @return array
     */
    protected function createRules()
    {
        $rules = [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
            'avatar' => [
                'sometimes',
                'nullable',
                'string_or_image',
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],
        ];

        return $rules;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function baseRules()
    {
        return [];
    }
}
