<?php

namespace App\Http\Requests\Web\Category;

use App\Http\Requests\Web\Traits\CrudRequest;
use App\Models\Category;

class CategoryRequest extends CrudRequest
{
    protected $type = Category::class;

    /**
     * Regras para atualização (editar).
     */
    protected function editRules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'tag' => ['sometimes', 'required', 'string', 'max:255'],
            'icon' => ['sometimes', 'nullable', 'string_or_file'],
        ];
    }

    /**
     * Regras para criação.
     */
    protected function createRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'tag' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string_or_file'],

        ];
    }

    /**
     * Regras comuns a create/edit.
     */
    public function baseRules(): array
    {
        return [];
    }
}
