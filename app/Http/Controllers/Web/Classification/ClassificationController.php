<?php

namespace App\Http\Controllers\Web\Classification;

use App\Enums\StatusTypeEnum;
use App\Models\Classification;
use Inertia\Inertia;
use App\Http\Controllers\Web\AuthController;

class ClassificationController extends AuthController
{
    protected $model = Classification::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $sortColumn = request()->get('sort_column', 'created_at');
        $sortDirection = request()->get('sort_direction', 'desc');

        $filterCategories= request()->get('filter_category', '');
        $filterStatus = request()->get('filter_status', '');
        $filterUser = request()->get('filter_user', '');
        $filterMessage = request()->get('filter_message', '');

        $allowedSortColumns = ['status', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'created_at';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $classifications = $this->model::query()
            ->when($filterCategories, function ($query) use ($filterCategories, $filterStatus) {
                $query->whereHas('categories', function ($q) use ($filterCategories) {
                    $q->where('name', 'like', '%' . $filterCategories . '%');
                });
            })
            ->when($filterStatus, function ($query) use ($filterStatus) {
                $query->where('status', $filterStatus);
            })
            ->when($filterUser, function ($query) use ($filterUser) {
                $query->whereHas('user', function ($q) use ($filterUser) {
                    $q->where('name', 'like', '%' . $filterUser . '%');
                });
            })
            ->when($filterMessage, function ($query) use ($filterMessage) {
                $query->where('message', 'like', '%' . $filterMessage . '%');
            })
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return Inertia::render('auth/painel/classification/index', [
            'classifications' => $classifications,
            'status_types' => StatusTypeEnum::options(),
            'query_params' => request()->all(),
        ]);
    }

    public function show(string $externalId)
    {
        $classification = $this->model::where('external_id', $externalId)->firstOrFail();

        return Inertia::render('auth/painel/classification/[uuid]/index', [
            'classification' => $classification,
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
