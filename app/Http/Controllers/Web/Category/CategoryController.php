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
        $filterTag = request()->get('filter_tag', '');

        $allowedSortColumns = ['name', 'tag', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $categories = $this->model::query()
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->when($filterName, fn($q) => $q->where('name', 'like', "%$filterName%"))
            ->when($filterTag, fn($q) => $q->where("tag", "like", "%$filterTag%"))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return Inertia::render('auth/painel/category/index', [
            'categories' => $categories,
            'query_params' => request()->all(),
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();

        if (isset($data['icon']) && $data['icon'] instanceof \Illuminate\Http\UploadedFile){
            $data['icon'] = getFile($data['icon'], 'categories', 's3');
        }

        $this->model::create($data);

        session()->flash('success', 'Categoria criada com sucesso');
    }

    public function update(CategoryRequest $request, string $externalId)
    {
        $category = $this->findBy(new $this->model, $externalId);

        $data = $request->validated();

        if (isset($data['icon']) && $data['icon'] instanceof \Illuminate\Http\UploadedFile){
            $data['icon'] = getFile($data['icon'], 'categories', 's3');
        }

        $category->update($data);

        session()->flash('success', 'Categoria atualizada com sucesso');
    }

    public function destroy(string $externalId)
    {
        $category = $this->model::where('external_id', $externalId)->firstOrFail();

        if ($category->icon) {
            deleteFile($category->icon, 's3');
        }

        $category->delete();

        session()->flash('success', 'Categoria deletada com sucesso');
    }
}
