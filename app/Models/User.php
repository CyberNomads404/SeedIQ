<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\ActiveRoleUserEnum;
use DB;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use OwenIt\Auditing\Contracts\Auditable;
use Session;
use Spatie\Permission\Traits\HasRoles;
use Str;

class User extends Authenticatable implements Auditable, MustVerifyEmail
{
    use \OwenIt\Auditing\Auditable;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes, HasApiTokens;

    protected $guarded = ['id'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'active',
        'avatar',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $auditExclude = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->external_id)) {
                $user->external_id = Str::uuid()->toString();
            }
        });
    }

    protected $appends = ['role_user', 'role_id', 'hierarchy_level', 'avatar_url', 'last_session_web', 'last_session_api'];

    public function role()
    {
        return $this->roles()->first();
    }

    public function getRoleUserAttribute()
    {
        return $this->roles()->first()?->name ?? ActiveRoleUserEnum::DEFAULT ->name;
    }

    public function getRoleIdAttribute()
    {
        return $this->roles()->first()?->id ?? null;
    }

    public function hierarchyLevel()
    {
        return $this->roles()->first()?->hierarchy_level ?? ActiveRoleUserEnum::DEFAULT ->hierarchyLevel();
    }

    public function getHierarchyLevelAttribute()
    {
        return $this->roles()->first()?->hierarchy_level ?? ActiveRoleUserEnum::DEFAULT ->hierarchyLevel();
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return config('constants.files.default_avatar', "");
        }

        $baseUrl = config('filesystems.disks.s3.url', env('AWS_URL', 'https://your-default-s3-url.com'));
        return rtrim($baseUrl, '/') . '/' . ltrim($this->avatar, '/');
    }

    public function sessions()
    {
        return DB::table('sessions')->where('user_id', $this->id);
    }

    public function getLastSessionWebAttribute()
    {
        $session = $this->sessions()
            ->orderBy('last_activity', 'desc')
            ->first();

        if (!$session) {
            return null;
        }

        return [
            'last_activity' => $session->last_activity
                ? \Carbon\Carbon::createFromTimestamp($session->last_activity)->utc()->toISOString()
                : null,
            'ip_address' => $session->ip_address ?? null,
            'user_agent' => $session->user_agent ?? null,
        ];
    }

    public function getLastSessionApiAttribute()
    {
        $token = $this->tokens()
            ->latest('created_at')
            ->first();

        if (!$token) {
            return null;
        }

        $date = $token->last_used_at ?? $token->created_at;

        return [
            'last_used_at' => $date ? $date->utc()->toISOString() : null,
            'token_name' => $token->name ?? null,
            'created_at' => $token->created_at ? $token->created_at->utc()->toISOString() : null,
        ];
    }

    public function classifications()
    {
        return $this->hasMany(Classification::class);
    }
}
