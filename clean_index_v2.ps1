$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$lines = [System.IO.File]::ReadAllLines($path)
$newContent = New-Object System.Collections.Generic.List[string]

$seenUser = $false
foreach($line in $lines) {
    if ($line -match "const \[currentUser, setCurrentUser\]") {
        if ($seenUser) { continue }
        $seenUser = $true
    }
    $newContent.Add($line)
}

[System.IO.File]::WriteAllLines($path, $newContent)
Write-Output "Cleaned user duplicates successfully."
