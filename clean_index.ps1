$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$lines = [System.IO.File]::ReadAllLines($path)
$newContent = New-Object System.Collections.Generic.List[string]

$seenAuth = $false
foreach($line in $lines) {
    if ($line -match "const \[isAuthenticated, setIsAuthenticated\]") {
        if ($seenAuth) { continue } # Skip duplicates
        $seenAuth = $true
    }
    $newContent.Add($line)
}

[System.IO.File]::WriteAllLines($path, $newContent)
Write-Output "Cleaned duplicates successfully."
