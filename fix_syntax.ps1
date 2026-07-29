$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    
    # We are going to replace the messed up block.
    # We find:
    # "                                        </div>         <tr><td colSpan="3" class="p-8 text-center text-slate-400">No hay caÃ±erÃ­as registradas.</td></tr>"
    # and everything up to the duplicate "                                        </div>"
    
    $regex = '(?s)                                        </div>         <tr><td colSpan="3" class="p-8 text-center text-slate-400">No hay caÃ±erÃ­as registradas\.</td></tr>.*?                                        </div>'
    
    $content = $content -replace $regex, '                                        </div>'
    
    [IO.File]::WriteAllText("$PWD\$file", $content, [System.Text.Encoding]::UTF8)
    Write-Output "Fixed syntax in $file"
}
