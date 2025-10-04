<?php

namespace App\Providers;

use App\Services\Url\UrlService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // if (str_contains(request()->getHost(), 'trycloudflare.com')) {
        //     URL::forceScheme('https');
        // }

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            $finalUrl = UrlService::formattedSignedVerifyEmailFrontEndUrl($url, '/auth/verify-email');
            $projectName = config('app.name', 'Seed IQ');
            $logoUrl = config('constants.files.logo_url', 'https://bjjqkcvxfnxrcsxtrsai.supabase.co/storage/v1/object/public/base-images/storage/v1/s3/base-images/base-images/static/logo.png');

            return (new MailMessage())
                ->from(config('mail.from.address'), $projectName)
                ->subject('Email de Verificação de Conta')
                ->view('emails.verify-email', [
                    'title' => 'Verificação de E-mail',
                    'project_name' => $projectName,
                    'logo_url' => $logoUrl,
                    'user' => $notifiable,
                    'url' => $finalUrl,
                ]);
        });

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $finalUrl = UrlService::formattedSignedResetPasswordFrontEndUrl(
                '/auth/forgot-password',
                $notifiable->id,
                $token
            );
            $projectName = config('app.name', 'Seed IQ');
            $logoUrl = config('constants.files.logo_url', 'https://bjjqkcvxfnxrcsxtrsai.supabase.co/storage/v1/object/public/base-images/storage/v1/s3/base-images/base-images/static/logo.png');

            return (new MailMessage())
                ->from(config('mail.from.address'), $projectName)
                ->subject('Redefinição de Senha')
                ->view('emails.reset-password', [
                    'title' => 'Redefinir Senha',
                    'project_name' => $projectName,
                    'logo_url' => $logoUrl,
                    'user' => $notifiable,
                    'url' => $finalUrl,
                ]);
        });
    }
}
