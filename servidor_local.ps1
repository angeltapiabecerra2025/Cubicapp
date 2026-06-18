# ============================================================
#  EIMI-CUB - Servidor HTTP Local
#  Ejecuta este script para abrir la app correctamente
#  (necesario para que el módulo BIM cargue Power BI)
# ============================================================

$puerto = 8080
$directorio = $PSScriptRoot
$url = "http://localhost:$puerto/"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   EIMI-CUB - Servidor Local Iniciado" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Puerto : $puerto" -ForegroundColor Yellow
Write-Host "  Carpeta: $directorio" -ForegroundColor Yellow
Write-Host "  URL    : $url" -ForegroundColor Green
Write-Host ""
Write-Host "  Abriendo el navegador automaticamente..." -ForegroundColor White
Write-Host "  Presiona CTRL+C para detener el servidor." -ForegroundColor Gray
Write-Host ""

# Iniciar servidor HTTP
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host "ERROR: No se pudo iniciar el servidor en el puerto $puerto." -ForegroundColor Red
    Write-Host "Intenta cambiar el puerto o ejecutar como Administrador." -ForegroundColor Red
    Read-Host "Presiona Enter para cerrar"
    exit
}

# Abrir navegador con la app
Start-Process "$($url)vista_previa2.html"

# Tabla de tipos MIME
$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    '.pdf'  = 'application/pdf'
}

Write-Host "Servidor activo. Esperando solicitudes..." -ForegroundColor Green

while ($listener.IsListening) {
    try {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        # Resolver ruta del archivo solicitado
        $ruta = $request.Url.LocalPath.TrimStart('/')
        if ($ruta -eq '' -or $ruta -eq '/') { $ruta = 'vista_previa2.html' }

        $rutaCompleta = Join-Path $directorio $ruta

        if (Test-Path $rutaCompleta -PathType Leaf) {
            $bytes     = [System.IO.File]::ReadAllBytes($rutaCompleta)
            $extension = [System.IO.Path]::GetExtension($rutaCompleta).ToLower()
            $contentType = if ($mime.ContainsKey($extension)) { $mime[$extension] } else { 'application/octet-stream' }

            $response.ContentType     = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode      = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "  [200] $ruta" -ForegroundColor DarkGray
        } else {
            $msg   = [System.Text.Encoding]::UTF8.GetBytes("404 - Archivo no encontrado: $ruta")
            $response.ContentType     = 'text/plain; charset=utf-8'
            $response.ContentLength64 = $msg.Length
            $response.StatusCode      = 404
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host "  [404] $ruta" -ForegroundColor Red
        }
    } catch {
        # Ignorar errores de conexion cortada (cliente cerro el navegador)
    } finally {
        try { $context.Response.Close() } catch {}
    }
}

$listener.Stop()
Write-Host "Servidor detenido." -ForegroundColor Yellow
