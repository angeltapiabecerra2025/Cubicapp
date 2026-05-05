$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
# Leemos como bytes para detectar el problema
$bytes = [System.IO.File]::ReadAllBytes($path)

# Intentamos decodificar como UTF-16 (que es lo que parece tener el problema de los espacios)
$utf16 = [System.Text.Encoding]::Unicode.GetString($bytes)
$utf8 = [System.Text.Encoding]::UTF8.GetString($bytes)

# Si el UTF-16 parece HTML válido, usamos ese. Si no, usamos el UTF-8.
$content = $utf8
if ($utf16 -match "<!DOCTYPE html>") {
    $content = $utf16
}

# Limpieza: cortamos después de </html>
$htmlEnd = $content.IndexOf("</html>")
if ($htmlEnd -gt 0) {
    $content = $content.Substring(0, $htmlEnd + 7)
}

# Guardamos como UTF-8 SIN BOM (muy importante para navegadores y git)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

Write-Output "Archivo index.html normalizado sin BOM exitosamente."
