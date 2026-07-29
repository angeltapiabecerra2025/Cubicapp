$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $lines = Get-Content -Path $file -Encoding UTF8
    $newLines = @()
    
    # We want to remove lines 12447 and 12448. In 0-indexed arrays, that is index 12446 and 12447.
    # BUT line numbers can shift. So let's look for the exact sequence:
    # "                                             )}"
    # "                                         </div>"
    # "                                             )}"
    # "                                         </div>"
    # "                                     ) : ("
    
    $i = 0
    while ($i -lt $lines.Count) {
        if ($i -lt ($lines.Count - 4) -and
            $lines[$i] -match "^\s*}\)\s*$" -and
            $lines[$i+1] -match "^\s*</div>\s*$" -and
            $lines[$i+2] -match "^\s*}\)\s*$" -and
            $lines[$i+3] -match "^\s*</div>\s*$" -and
            $lines[$i+4] -match "^\s*\) : \(\s*$") {
            
            # Found the sequence!
            # Keep the first two, skip the duplicate two, keep the rest
            $newLines += $lines[$i]
            $newLines += $lines[$i+1]
            # Skip $i+2 and $i+3
            $newLines += $lines[$i+4]
            $i += 5
            continue
        }
        
        $newLines += $lines[$i]
        $i++
    }
    
    $raw = $newLines -join "`r`n"
    [IO.File]::WriteAllText("$PWD\$file", $raw, [System.Text.Encoding]::UTF8)
    Write-Output "Fixed extra syntax lines in $file"
}
