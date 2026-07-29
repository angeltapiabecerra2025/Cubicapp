$lines = Get-Content index.html
for ($i = 9000; $i -lt 10126; $i++) {
    if ($lines[$i] -match "activeTab ===") {
        $line = $lines[$i].Trim()
        Write-Output "${i}: $line"
    }
}
