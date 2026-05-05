$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

$fixes = @{
    "📧" = "&#128231;"
    "🔑" = "&#128273;"
    "⚡" = "&#9889;"
    "→" = "&#8594;"
    "←" = "&#8592;"
    "ðŸ“§" = "&#128231;"
    "ðŸ”‘" = "&#128273;"
    "âš¡" = "&#9889;"
    "â†’" = "&#8594;"
    "â† " = "&#8592;"
}

foreach ($bad in $fixes.Keys) {
    $content = $content.Replace($bad, $fixes[$bad])
}

# Guardar como UTF-8 puro
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

Write-Output "Emojis converted to HTML entities and saved as UTF-8."
