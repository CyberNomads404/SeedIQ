<?php

namespace App\Http\Controllers\Web\Classification;

use App\Models\Classification;
use Inertia\Inertia;
use App\Http\Controllers\Web\AuthController;

class ClassificationController extends AuthController
{
    protected $model = Classification::class;

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

        $classifications = $this->model::query()
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->when($filterName, fn($q) => $q->where('name', 'like', "%$filterName%"))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return Inertia::render('auth/painel/classification/index', [
            'classifications' => $classifications,
            'query_params' => request()->all(),
        ]);
    }

    public function destroy(string $externalId)
    {
        $classification = $this->model::where('external_id', $externalId)->firstOrFail();

        if ($classification->icon) {
            deleteFile($classification->icon, 's3');
        }

        $classification->delete();

        session()->flash('success', 'Classificação deletada com sucesso');
    }
}
