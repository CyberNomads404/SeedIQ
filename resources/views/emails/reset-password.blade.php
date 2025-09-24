@extends('emails.layouts.layout-default')

@section('content')
    <h1 style="color: #000;">Redefinição de Senha</h1>
    <p style="font-size: 16px; color: #000; line-height: 1.5; margin: 20px 0;">
        Olá, {{ $user->name }}! Recebemos uma solicitação para redefinir sua senha. Caso não tenha sido você, ignore este e-mail.
    </p>
    <!-- Botão de redefinição -->
    <a href="{{ $url }}" target="_blank" style="display: inline-block; background-color: #1A1A1A; color: white; text-decoration: none; padding: 15px 30px; font-size: 16px; border-radius: 5px; margin: 20px 0; font-weight: bold;">
        Redefinir Senha
    </a>
    <p style="font-size: 14px; color: #666;">
        Caso não consiga clicar no botão, copie e cole o link abaixo em seu navegador:
    </p>
    <p style="font-size: 14px; color: #666; word-break: break-word;">
        <a href="{{ $url }}" style="color: #F2622E;">{{ $url }}</a>
    </p>
    <p style="font-size: 14px; color: #666;">
        — Team {{ $project_name }}
    </p>
@endsection
