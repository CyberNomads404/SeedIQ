<?php

namespace App\Http\Resources\Api\Classification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassificationResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
        */
    public function toArray(Request $request): array
    {
        $resultData = $this->payload['data']['result'] ?? [];

        return [
            'external_id' => $this->external_id,
            'payload' => $this->payload,
            'good' => $this->good ?? $resultData['good'] ?? null,
            'bad_detection' => $this->bad_detection ?? $resultData['bad_detection'] ?? null,
            'unknown' => $this->unknown ?? $resultData['unknown'] ?? null,
            'burned' => $this->burned ?? $resultData['burned'] ?? null,
            'greenish' => $this->greenish ?? $resultData['greenish'] ?? null,
            'small' => $this->small ?? $resultData['small'] ?? null,
            'created_at' => $this->created_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at,
            'updated_at_human' => $this->updated_at->diffForHumans(),
        ];
    }
}
