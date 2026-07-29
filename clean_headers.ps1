$content = Get-Content -Path "index.html" -Raw -Encoding UTF8

# Replace emerald headers
$content = $content -replace 'bg-emerald-900/40 text-emerald-100', 'bg-slate-50 text-slate-700'
$content = $content -replace 'bg-emerald-800 text-white', 'bg-slate-50 text-slate-700'

# Replace blue headers
$content = $content -replace 'bg-blue-900 text-white', 'bg-slate-50 text-slate-700'

# Replace red/amber header for AVANCE SUB-ACTIVIDADES
$content = $content -replace "\? 'bg-red-600' : 'bg-slate-300'", "? 'bg-slate-50' : 'bg-slate-50'"
$content = $content -replace 'text-slate-800 font-black text-\[9px\] transition-colors', 'text-slate-700 font-black text-[9px] transition-colors'

# Replace fuchsia and teal headers for % Avance
$content = $content -replace 'bg-fuchsia-800 text-white', 'bg-slate-50 text-slate-700'
$content = $content -replace 'bg-teal-900 text-white', 'bg-slate-50 text-slate-700'

# Sub-activities row
$content = $content -replace 'bg-slate-800">', 'bg-slate-50">'

# Sub-activities cells
$content = $content -replace "\? 'bg-slate-900' : 'bg-slate-900'", "? 'bg-slate-50' : 'bg-slate-50'"
$content = $content -replace 'hover:bg-slate-800', 'hover:bg-slate-200'

# Clean borders
$content = $content -replace 'border-slate-700', 'border-slate-200'

# Nueva Sub-Actividad button styling (needs to be dark text since background is now light)
$content = $content -replace 'bg-white/10 hover:bg-white/25 text-white border border-white/30 hover:border-white/60', 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 hover:border-slate-400'

[IO.File]::WriteAllText("$PWD\index.html", $content, [System.Text.Encoding]::UTF8)
[IO.File]::WriteAllText("$PWD\vista_previa2.html", $content, [System.Text.Encoding]::UTF8)

Write-Output "Cleaned headers applied."
