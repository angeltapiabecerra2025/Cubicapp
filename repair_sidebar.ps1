$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

# Character corrections using Unicode points
$content = $content.Replace("â† ", [char]0x2190)  # ←
$content = $content.Replace("â†’", [char]0x2192)  # →
$content = $content.Replace("âš¡", [char]0x26A1)  # ⚡
$content = $content.Replace("GestiÃ³n", "Gestión")

# Removing the specific duplicate footer block
$duplicatePart = @"
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                    <Icon name="user" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-black text-slate-800">Usuario Demo</p>
                                    <p class="text-[10px] font-bold text-red-600/60 uppercase tracking-tighter">Super Usuario</p>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-50 flex justify-between items-center">
                                <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">v1.2 Stable</span>
                                <span class="text-[9px] font-black text-red-100 bg-red-500 px-1.5 py-0.5 rounded">PRO</span>
                            </div>
                        </div>
"@
# Note: $duplicatePart might have slightly different indentation or line endings in memory
# Safer to just remove by strings that don't change
if ($content.Contains("Usuario Demo")) {
    # Find start of block
    $idx = $content.IndexOf("Usuario Demo")
    $startDiv = $content.LastIndexOf('<div class="flex items-center gap-3 mb-2">', $idx)
    $endDiv = $content.IndexOf('</div>', $content.IndexOf('v1.2 Stable', $idx))
    $endDiv = $content.IndexOf('</div>', $endDiv + 1)
    
    if ($startDiv -gt -1 -and $endDiv -gt -1) {
        $content = $content.Remove($startDiv, $endDiv - $startDiv + 6)
    }
}

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Fixed Successfully."
