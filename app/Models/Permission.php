<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Spatie\Permission\Models\Permission as SpatiePermission;


class Permission extends SpatiePermission implements Auditable
{
    use \OwenIt\Auditing\Auditable;
}
