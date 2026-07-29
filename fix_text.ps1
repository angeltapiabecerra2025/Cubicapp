$content = Get-Content -Path "index.html" -Raw -Encoding UTF8

$target1 = 'class="w-[120px] bg-transparent border-none text-center font-black text-[10px] text-white outline-none focus:bg-white/20 rounded px-1 uppercase placeholder:text-white/40 resize-none overflow-hidden leading-tight"'
$replacement1 = 'class="w-[120px] bg-transparent border-none text-center font-black text-[10px] text-slate-700 outline-none focus:bg-slate-200 rounded px-1 uppercase placeholder:text-slate-400 resize-none overflow-hidden leading-tight"'
$content = $content.Replace($target1, $replacement1)

$target2 = 'class="w-8 bg-transparent border-none text-center font-black text-[10px] outline-none focus:text-white"'
$replacement2 = 'class="w-8 bg-transparent border-none text-center font-black text-[10px] outline-none focus:text-slate-900 text-slate-700"'
$content = $content.Replace($target2, $replacement2)

[IO.File]::WriteAllText("$PWD\index.html", $content, [System.Text.Encoding]::UTF8)
[IO.File]::WriteAllText("$PWD\vista_previa2.html", $content, [System.Text.Encoding]::UTF8)

Write-Output "Text colors fixed."
