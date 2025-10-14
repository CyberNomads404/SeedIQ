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
        $sortColumn = request()->get('sort_column', 'name');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterCategoriesExternalId = request()->get('filter_categories_external_id', '');
        $filterStatus = request()->get('filter_status', '');

        $allowedSortColumns = ['name', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $classifications = $this->model::query()
            ->when($filterCategoriesExternalId, function ($query) use ($filterCategoriesExternalId) {
                $query->whereHas('categories', function ($q) use ($filterCategoriesExternalId) {
                    $q->where('external_id', $filterCategoriesExternalId);
                });
            })
            ->when($filterStatus, function ($query) use ($filterStatus) {
                $query->where('status', $filterStatus);
            })
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

        if ($classification->file) {
            deleteFile($classification->file, 's3');
        }

        $classification->result()->delete();
        $classification->delete();

        session()->flash('success', 'Classificação deletada com sucesso');
    }
}
