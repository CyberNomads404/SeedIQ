<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} - {{ $project_name }}</title>
</head>

<body style="margin: 0; padding: 0; background-color: #F9F4FE; font-family: Arial, sans-serif; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background: white; margin: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding: 20px 0; background-color: white;">
                            <img src="{{ $logo_url }}"
                                alt="{{ $project_name }}" style="width: 150px;">
                        </td>
                    </tr>

                    <!-- Conteúdo Dinâmico -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                        <td align="center" style="background-color: #1A1A1A; padding: 15px;">
                            <p style="font-size: 14px; color: white; font-weight: 700;">
                                &copy; {{ date('Y') }} {{ $project_name }}. Todos os direitos reservados.<br>
                                {{ $project_name }} é uma marca registrada.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
