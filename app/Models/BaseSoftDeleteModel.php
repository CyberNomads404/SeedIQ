<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class BaseSoftDeleteModel extends BaseModel
{
    use SoftDeletes;
}
