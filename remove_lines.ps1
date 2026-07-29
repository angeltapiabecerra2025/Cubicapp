$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $lines = Get-Content -Path $file -Encoding UTF8
    
    # Check if lines 12446 and 12447 (0-indexed) are indeed the ones to delete
    if ($lines[12446] -match "\}" -and $lines[12447] -match "</div>") {
        $newLines = @()
        for ($i = 0; $i -lt $lines.Count; $i++) {
            # Skip 12446 and 12447 (which correspond to line numbers 12447 and 12448)
            if ($i -eq 12446 -or $i -eq 12447) {
                continue
            }
            $newLines += $lines[$i]
        }
        
        $raw = $newLines -join "`r`n"
        [IO.File]::WriteAllText("$PWD\$file", $raw, [System.Text.Encoding]::UTF8)
        Write-Output "Removed lines 12447 and 12448 from $file"
    } else {
        Write-Output "Lines 12447 and 12448 in $file do not match expected duplicate closing tags. Found:"
        Write-Output $lines[12446]
        Write-Output $lines[12447]
    }
}
