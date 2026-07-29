$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $lines = Get-Content -Path $file -Encoding UTF8
    $newLines = @()
    $skip = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        if ($line -match "</div>\s*<tr><td colSpan=") {
            # We found the start of the bad chunk
            $newLines += "                                        </div>"
            $skip = $true
            continue
        }
        
        if ($skip) {
            if ($line -match "^\s*</div>\s*$") {
                # We found the end of the bad chunk
                $skip = $false
            }
            continue
        }
        
        $newLines += $line
    }
    
    $raw = $newLines -join "`r`n"
    [IO.File]::WriteAllText("$PWD\$file", $raw, [System.Text.Encoding]::UTF8)
    Write-Output "Fixed duplication in $file"
}
