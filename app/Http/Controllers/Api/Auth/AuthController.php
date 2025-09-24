<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\ActiveRoleUserEnum;
use App\Enums\TokenTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\AuthRequest;
use App\Http\Resources\Api\AuthResource;
use App\Http\Resources\User\UserResource;
use App\Models\Role;
use App\Models\User;
use Aws\Token\Token;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends \App\Http\Controllers\Api\AuthController
{
    protected $model = User::class;
    protected $roleDefault = ActiveRoleUserEnum::CLIENT;

    public function register(AuthRequest $request)
    {
        $data = $request->validated();
        $role = Role::updateOrCreate(['name' => $this->roleDefault->value], ['hierarchy_level' => $this->roleDefault->hierarchyLevel()]);

        $data['password'] = bcrypt($data['password']);
        $data['active'] = (bool) 1;

        if ($request->hasFile('avatar')) {
            $data['avatar'] = uploadFile($request->file('avatar'), 'users/avatar', 's3');
        }

        $user = $this->model::create($data);
        $user->assignRole($role);

        event(new Registered($user));

        return $this->responseMessage('success', trans('responses.auth.register'), 201);
    }

    public function login(Request $request)
    {
        $validated = $this->validateRequest($request, [
            'email' => [
                'required',
                'string',
                'email',
            ],
            'password' => [
                'required',
                'string',
            ],
            'remember_me' => [
                'nullable',
                'boolean',
            ],
        ]);

        $credentials = [
            'email' => $validated['email'],
            'password' => $validated['password'],
        ];

        if (!Auth::attempt($credentials)) {
            return $this->responseMessage('error', trans('responses.error.credentials_invalid'), 401);
        }

        $user = $request->user();

        if (!$user->active) {
            return $this->responseMessage('error', trans('responses.error.user_inactive'), 403);
        }

        if (!$user->hasPermissionTo('login_mobile')) {
            return $this->responseMessage('error', trans('responses.error.permission_denied'), 403);
        }

        $accessTokenTtl = config('sanctum.ttl', 3600);
        $accessTokenResult = $user->createToken(TokenTypeEnum::ACCESS_TOKEN->value);
        $accessTokenResult->accessToken->expires_at = now()->addSeconds($accessTokenTtl);
        $accessTokenResult->accessToken->save();

        $refreshTokenTtl = config('sanctum.refresh_ttl', 604800);
        $refreshTokenResult = $user->createToken(TokenTypeEnum::REFRESH_TOKEN->value);
        $refreshTokenResult->accessToken->expires_at = now()->addSeconds($refreshTokenTtl);
        $refreshTokenResult->accessToken->save();

        return $this->responseMessage('success', trans('responses.auth.login'), 200, [
            'access_token' => $accessTokenResult->plainTextToken,
            'refresh_token' => $refreshTokenResult->plainTextToken,
            'user' => new AuthResource($user),
        ]);
    }

    public function updateProfile(AuthRequest $request)
    {
        $data = $request->validated();
        $user = $this->authUser;

        if (array_key_exists('avatar', $data)) {
            if ($data['avatar'] === null) {
                deleteImage($user->getRawOriginal('avatar'), 's3');
                $data['avatar'] = null;
            } elseif ($request->file('avatar') instanceof \Illuminate\Http\UploadedFile) {
                $data['avatar'] = getFile($request->file('avatar'), 'users/avatar', 's3', $user->getRawOriginal('avatar'));
            } elseif (is_string($data['avatar'])) {
                $data['avatar'] = getFile($data['avatar'], 'users/avatar', 's3', $user->getRawOriginal('avatar'));
            }
        }
        $user->update($data);

        return $this->responseMessage('success', trans('responses.auth.updated_profile'), 200, [
            'user' => new AuthResource($user),
        ]);
    }

    public function logout()
    {
        $this->authUser->tokens()->delete();

        return $this->responseMessage('success', trans('responses.auth.logout'), 200);
    }

    public function refresh()
    {
        $user = $this->authUser;

        $user->tokens()->where('name', TokenTypeEnum::ACCESS_TOKEN->value)->delete();

        $accessTokenTtl = config('sanctum.ttl', 3600);
        $accessTokenResult = $user->createToken(TokenTypeEnum::ACCESS_TOKEN->value);
        $accessTokenResult->accessToken->expires_at = now()->addSeconds($accessTokenTtl);
        $accessTokenResult->accessToken->save();

        return $this->responseMessage('success', trans('responses.auth.refresh'), 200, [
            'access_token' => $accessTokenResult->plainTextToken,
            'user' => new AuthResource($user),
        ]);
    }

    public function me()
    {
        $user = $this->authUser;

        return $this->responseMessage('success', trans('responses.auth.me'), 200, [
            'user' => new AuthResource($user),
        ]);
    }

    public function confirmRegister(Request $request, $id, $hash)
    {
        if (!$request->hasValidSignature()) {
            return $this->responseMessage('error', trans('responses.error.verification_link_invalid'), 403);
        }

        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return $this->responseMessage('error', trans('responses.error.verification_link_invalid'), 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->responseMessage('error', trans('responses.error.email_already_verified'), 409);
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));

            return $this->responseMessage('success', trans('responses.auth.email_verified_success'), 200);
        }

        return $this->responseMessage('error', trans('responses.error.email_verification_error'), 500);
    }

    public function resendVerifyEmail(Request $request)
    {
        $validated = $this->validateRequest($request, [
            'email' => [
                'required',
                'string',
                'email',
            ],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->responseMessage('error', trans('responses.error.user_not_found'), 404);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->responseMessage('error', trans('responses.error.email_already_verified'), 409);
        }

        $user->sendEmailVerificationNotification();

        return $this->responseMessage('success', trans('responses.auth.verification_link_sent'), 200);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $this->validateRequest($request, [
            'email' => [
                'required',
                'email',
            ],
        ]);

        if (User::where('email', $validated['email'])->doesntExist()) {
            return $this->responseMessage('error', trans('responses.error.email_not_registered'), 404);
        }

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        return $status === Password::RESET_LINK_SENT
            ? $this->responseMessage('success', trans('responses.auth.password_reset_sent'))
            : $this->responseMessage('error', trans('responses.error.too_many_attempts'), 500);
    }

    public function validateResetPasswordToken(Request $request)
    {
        $validated = $this->validateRequest($request, [
            'token' => [
                'required',
            ],
            'user_id' => [
                'required',
                'exists:users,id',
            ],
        ]);

        $user = User::find($validated['user_id']);

        if (!$user) {
            return $this->responseMessage('error', trans('responses.error.user_not_found'), 404);
        }

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $user->email)
            ->first();

        if (!$tokenData || !Hash::check($validated['token'], $tokenData->token)) {
            return $this->responseMessage('error', trans('responses.error.invalid_token'), 422);
        }

        return $this->responseMessage('success', trans('responses.auth.valid_token'), 200);
    }

    public function resetPassword(Request $request)
    {
        $validated = $this->validateRequest($request, [
            'token' => [
                'required',
            ],
            'email' => [
                'required',
                'email',
            ],
            'password' => [
                'required',
                'string',
                'confirmed',
            ],
        ]);

        if (!$user = User::where('email', $validated['email'])->first()) {
            return $this->responseMessage('error', trans('responses.error.user_not_found'), 404);
        }


        $tokenData = DB::table('password_reset_tokens')
        ->where('email', $validated['email'])
        ->first();

        if (!$tokenData || !Hash::check($validated['token'], $tokenData->token)) {
            return $this->responseMessage('error', trans('responses.error.invalid_token'), 422);
        }

        if ($user && Hash::check($validated['password'], $user->password)) {
            return $this->responseMessage('error', trans('responses.error.error_password_same'), 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        return $status == Password::PASSWORD_RESET
            ? $this->responseMessage('success', trans('responses.auth.password_reset_success'))
            : $this->responseMessage('error', trans('responses.error.too_many_attempts'), 500);
    }

}
