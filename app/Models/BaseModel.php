<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use OwenIt\Auditing\Contracts\Auditable;
use Schema;

class BaseModel extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    use HasFactory;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
        'external_id'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $hasExternalId = Schema::hasColumn($model->getTable(), 'external_id');

            if ($hasExternalId && empty($model->external_id)) {
                $model->external_id = Str::uuid()->toString();
            }
        });
    }
}
