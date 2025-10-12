<?php

namespace App\Http\Controllers\Web\Category;

use App\Models\Category;
use Inertia\Inertia;
use App\Http\Controllers\Web\AuthController;
use App\Http\Requests\Web\Category\CategoryRequest;

class CategoryController extends AuthController
{
    protected $model = Category::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'name');
        $sortDirection = request()->get('sort_direction', 'asc');

        // Filtros
        $filterName = request()->get('filter_name', '');

        $allowedSortColumns = ['name', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $categories = $this->model::query()
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->when($filterName, fn($q) => $q->where('name', 'like', "%$filterName%"))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        dd($categories);

        return Inertia::render('auth/painel/category/index', [
            'categories' => $categories,
            'query_params' => request()->all(),
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();

        $this->model::create([
            'name' => $data['name'],
            'icon' => $data['icon'],
        ]);

        session()->flash('success', 'Categoria criada com sucesso');
    }

    public function update(CategoryRequest $request, string $externalId)
    {
        $category = $this->findBy(new $this->model, $externalId);

        $data = $request->validated();

        $category->update([
            'name' => $data['name'],
            'icon' => $data['icon'],
        ]);

        session()->flash('success', 'Categoria atualizada com sucesso');
    }

    public function destroy(string $externalId)
    {
        $Category = $this->model::where('external_id', $externalId)->firstOrFail();

        $Category->delete();

        session()->flash('success', 'Categoria deletada com sucesso');
    }
}
