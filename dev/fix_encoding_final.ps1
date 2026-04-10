$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

$fixes = @{
    "ðŸ“§" = "📧"
    "ðŸ”‘" = "🔑"
    "âš¡" = "⚡"
    "â†’" = "→"
    "â† " = "←"
    "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" = "••••••••"
    "GestiÃ³n" = "Gestión"
    "electrÃ³nico" = "electrónico"
    "ContraseÃ±a" = "Contraseña"
}

foreach ($bad in $fixes.Keys) {
    $content = $content.Replace($bad, $fixes[$bad])
}

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Encoding fixed successfully."
