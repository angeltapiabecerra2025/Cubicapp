$lines = Get-Content index.html
$startIndex = -1
$endIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "Seleccione un Proyecto" -and $startIndex -eq -1) {
        $startIndex = $i
    } elseif ($lines[$i] -match "Seleccione un Proyecto" -and $startIndex -ne -1) {
        $endIndex = $i
        break
    }
}
Write-Output "First occurrence at line $($startIndex + 1), Second occurrence at line $($endIndex + 1)"
