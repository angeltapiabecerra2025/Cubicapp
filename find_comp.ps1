$lines = Get-Content index.html
$count = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "const HistoricoEDPPage") {
        Write-Output "HistoricoEDPPage at line $($i + 1)"
        $count++
    }
}
Write-Output "Total: $count"
