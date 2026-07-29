 = @('index.html', 'vista_previa2.html')
foreach ( in ) {
     = Get-Content  -Raw
     =  -replace 'border-2 border-slate-800', 'border border-slate-800'
     =  -replace 'border-b-2 border-slate-800', 'border-b border-slate-800'
     =  -replace 'border-b-2 border-slate-400', 'border-b border-slate-400'
    Set-Content -Path  -Value  -Encoding UTF8
}
