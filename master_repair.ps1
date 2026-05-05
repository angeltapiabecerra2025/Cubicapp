$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

# 1. Limpieza de caracteres rotos (reemplazo directo de las secuencias UTF-8 mal interpretadas)
$fixes = @{
    "ðŸ“§" = "📧"
    "ðŸ”‘" = "🔑"
    "âš¡" = "⚡"
    "â†’" = "→"
    "â† " = "←"
    "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" = "••••••••"
    "GestiÃ³n" = "Gestión"
    "ContraseÃ±a" = "Contraseña"
    "electrÃ³nico" = "electrónico"
}

foreach ($bad in $fixes.Keys) {
    if ($content.Contains($bad)) {
        $content = $content.Replace($bad, $fixes[$bad])
    }
}

# 2. Asegurarnos de que el archivo termine en </html>
$htmlEnd = $content.IndexOf("</html>")
if ($htmlEnd -gt 0) {
    $content = $content.Substring(0, $htmlEnd + 7)
}

# 3. Guardar como UTF-8 SIN BOM (Puro y compatible)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

Write-Output "Reparación maestra de codificación completada."
