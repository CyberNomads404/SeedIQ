@extends('emails.layouts.layout-default')

@section('content')
    <h1 style="color: #000;">Bem-vindo(a) ao {{ $project_name }}!</h1>
    <p style="font-size: 16px; color: #000; line-height: 1.5; margin: 10px 0;">
        Olá, {{ $user->name }}! Estamos felizes por você estar aqui. Antes de começar, precisamos verificar seu endereço de e-mail.
    </p>
    <!-- Botão de validação -->
    <a href="{{ $url }}" target="_blank" style="display: inline-block; background-color: #1A1A1A; color: white; text-decoration: none; padding: 15px 30px; font-size: 16px; border-radius: 5px; margin: 20px 0; font-weight: bold;">
        Validar E-mail
    </a>
    <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 20px 0;">
        Caso não consiga clicar no botão, copie e cole o link abaixo em seu navegador:
    </p>
    <p style="font-size: 14px; line-height: 1.5; color: #666; word-break: break-word;">
        <a href="{{ $url }}" style="color: #F2622E;">{{ $url }}</a>
    </p>
    <p style="font-size: 14px; color: #666; margin: 20px 0;">
        — Team {{ $project_name }}
    </p>
@endsection
