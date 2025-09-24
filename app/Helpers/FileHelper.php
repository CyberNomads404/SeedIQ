<?php

if (!function_exists('uploadFile')) {
    /**
     * Faz upload de um arquivo genérico.
     *
     * @param Illuminate\Http\UploadedFile $file
     * @param string                       $path
     * @param string                       $disk
     *
     * @return string|null
     */
    function uploadFile($file, $path = 'files', $disk = 's3')
    {
        if (!$file || !$file instanceof Illuminate\Http\UploadedFile) {
            return null;
        }

        try {
            return Storage::disk($disk)->putFile($path, $file);
        } catch (\Exception $e) {
            \Log::error("Erro ao fazer upload do arquivo: {$e->getMessage()}");
            return null;
        }
    }
}

if (!function_exists('getFile')) {
    /**
     * Pega arquivo vindo no editar, mantém o antigo ou faz upload do novo.
     *
     * @param string|Illuminate\Http\UploadedFile|null $file
     * @param string $path
     * @param string $disk
     * @param string|null $oldFile
     * @return string|null
     */
    function getFile($file, string $path, string $disk = 's3', string $oldFile = null)
    {
        if ($file instanceof Illuminate\Http\UploadedFile) {
            if (isset($oldFile)) {
                deleteFile($oldFile, $disk);
            }
            return uploadFile($file, $path, $disk);
        }

        if ($file && is_string($file) && ($file !== 'null' && $file !== '')) {
            if (str_contains($file, $path)) {
                $pos = strpos($file, $path);
                return substr($file, $pos);
            }

            return $file;
        }

        return null;
    }
}

if (!function_exists('deleteFile')) {
    /**
     * Deleta um arquivo do disco.
     *
     * @param string|null $path
     * @param string      $disk
     *
     * @return bool
     */
    function deleteFile(string $path = null, string $disk = 's3'): bool
    {
        if (!$path) {
            return false;
        }

        try {
            return Storage::disk($disk)->exists($path)
                ? Storage::disk($disk)->delete($path)
                : false;
        } catch (\Throwable $e) {
            \Log::error("Erro ao deletar arquivo: {$e->getMessage()}");
            return false;
        }
    }
}

if (!function_exists('getFileInfo')) {
    /**
     * Retorna informações básicas de um arquivo.
     *
     * @param string|Illuminate\Http\UploadedFile $uploaded
     * @return array
     */
    function getFileInfo($uploaded)
    {
        $isUploadedFile = $uploaded instanceof \Illuminate\Http\UploadedFile;

        if ($isUploadedFile) {
            return [
                'mime' => $uploaded->getClientMimeType(),
                'size' => $uploaded->getSize(),
                'extension' => $uploaded->getClientOriginalExtension(),
            ];
        }

        if (filter_var($uploaded, FILTER_VALIDATE_URL)) {
            try {
                $response = \Http::head($uploaded);
                $mimeType = $response->header('Content-Type');
                $size = $response->header('Content-Length');
            } catch (\Throwable $e) {
                $mimeType = null;
                $size = null;
            }

            $extension = pathinfo(parse_url($uploaded, PHP_URL_PATH), PATHINFO_EXTENSION);

            return [
                'mime' => $mimeType ?? 'application/octet-stream',
                'size' => $size ?? 0,
                'extension' => $extension,
            ];
        }

        return [
            'mime' => mime_content_type($uploaded),
            'size' => filesize($uploaded),
            'extension' => pathinfo($uploaded, PATHINFO_EXTENSION),
        ];
    }
}

