$enc = new-object System.Text.UTF8Encoding $false
$files = @('index.html', 'vista_previa2.html')
foreach ($file in $files) {
    $c = [System.IO.File]::ReadAllText($file, $enc)
    $c = $c -replace 'border-2 border-slate-800', 'border border-slate-800'
    $c = $c -replace 'border-b-2 border-slate-800', 'border-b border-slate-800'
    $c = $c -replace 'border-b-2 border-slate-400', 'border-b border-slate-400'
    [System.IO.File]::WriteAllText($file, $c, $enc)
}
