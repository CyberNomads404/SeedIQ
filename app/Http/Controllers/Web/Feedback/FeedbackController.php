<?php

namespace App\Http\Controllers\Web\Feedback;

use App\Enums\FeedbackTypeEnum;
use App\Http\Controllers\Web\AuthController;
use App\Http\Requests\Web\Feedback\FeedbackRequest;
use App\Models\Feedback;
use Inertia\Inertia;

class FeedbackController extends AuthController
{
    protected $model = Feedback::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');
        $sortColumn = request()->get('sort_column', 'name');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterType = request()->get('filter_type', '');
        $filterMessage = request()->get('filter_message', '');
        $filterHasAttachment = request()->get('filter_has_attachment', '');
        $filterPage = request()->get('filter_page', '');
        $filterDevice = request()->get('filter_device', '');
        $filterReadAt = request()->get('filter_read_at', '');
        $filterCreatedAtStart = request()->get('filter_created_at_start', '');
        $filterCreatedAtEnd = request()->get('filter_created_at_end', '');

        $allowedSortColumns = ['type', 'message', 'device', 'page', 'read_at', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'created_at';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $feedbacks = $this->model::query()
            ->when($search, fn($query) => $query->where('type', 'like', "%$search%")->orWhere('message', 'like', "%$search%"))
            ->when($filterType, fn($query) => $query->where('type', 'like', "%$filterType%"))
            ->when($filterMessage, fn($query) => $query->where('message', 'like', "%$filterMessage%"))
            ->when($filterHasAttachment, fn($query) => $query->whereNotNull('attachment')->orWhere('attachment', '!=', ''))
            ->when($filterPage, fn($query) => $query->where('page', 'like', "%$filterPage%"))
            ->when($filterDevice, fn($query) => $query->where('device', 'like', "%$filterDevice%"))
            ->when($filterReadAt, function ($query) use ($filterReadAt) {
                if ($filterReadAt === 'read') {
                    return $query->whereNotNull('read_at');
                } elseif ($filterReadAt === 'unread') {
                    return $query->whereNull('read_at');
                }
                return $query;
            })
            ->when($filterCreatedAtStart, fn($query) => $query->where('created_at', '>=', $filterCreatedAtStart))
            ->when($filterCreatedAtEnd, fn($query) => $query->where('created_at', '<=', $filterCreatedAtEnd))
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return Inertia::render('auth/painel/feedback/index', [
            'feedbacks' => $feedbacks,
            'queryParams' => [
                'search' => $search,
                'sort_column' => $sortColumn,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'filter_type' => $filterType,
                'filter_message' => $filterMessage,
                'filter_has_attachment' => $filterHasAttachment,
                'filter_page' => $filterPage,
                'filter_device' => $filterDevice,
                'filter_read_at' => $filterReadAt,
                'filter_created_at_start' => $filterCreatedAtStart,
                'filter_created_at_end' => $filterCreatedAtEnd,
            ]
        ]);
    }

    public function store(FeedbackRequest $request)
    {
        $data = $request->validated();

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = uploadFile($request->file('attachment'), 'feedbacks', 's3');
        }

        $this->model::create([
            'user_id' => $this->authUser?->id,
            'type' => $data['type'],
            'message' => $data['message'],
            'attachment' => $attachmentPath,
            'mime_type' => $request->file('attachment')?->getMimeType(),
            'page' => $data['page'] ?? null,
            'device' => $data['device'] ?? null,
            'app_version' => $data['app_version'] ?? null,
            'user_agent' => $data['user_agent'] ?? null,
            'ip_address' => request()->ip(),
        ]);

        session()->flash('success', 'Feedback enviado com sucesso! Obrigado por sua contribuição.');
    }

    public function show(string $uuid)
    {
        $feedback = $this->findBy(new $this->model, $uuid, 'external_id');

        if (!$feedback->isRead()) {
            $feedback->markAsRead();
            session()->flash('success', 'Feedback marcado como lido.');
        }

        return Inertia::render('auth/painel/feedback/[uuid]/index', [
            'feedback' => $feedback,
            'user' => $feedback->user,
        ]);
    }

    public function destroy(string $uuid)
    {
        $feedback = $this->findBy(new $this->model, $uuid, 'external_id');

        if ($feedback->attachment) {
            deleteFile($feedback->attachment, 's3');
        }
        $feedback->delete();

        session()->flash('success', 'Feedback excluído com sucesso.');
    }

    public function switch(string $uuid)
    {
        $feedback = $this->findBy(new $this->model, $uuid, 'external_id');

        $feedback->switchMarkAsRead();

        if ($feedback->isRead()) {
            session()->flash('success', 'Feedback marcado como lido.');
        } else {
            session()->flash('success', 'Feedback marcado como não lido.');
        }
    }

    public function getTypes()
    {
        $types = FeedbackTypeEnum::options();

        return response()->json($types);
    }
}
