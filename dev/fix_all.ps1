$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

# Correct encoding issues in LoginPage
$content = $content.Replace("Por favor, ingrece su correo electrÃ³nico.", "Por favor, ingrese su correo electrónico.")
$content = $content.Replace("Por favor, ingrese su correo electrÃ³nico.", "Por favor, ingrese su correo electrónico.")
$content = $content.Replace("ContraseÃ±a incorrecta.", "Contraseña incorrecta.")
$content = $content.Replace("ðŸ“§", "📧")
$content = $content.Replace("ðŸ”‘", "🔑")
$content = $content.Replace("â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", "••••••••")

# Correct encoding and remove duplicate in Sidebar
$oldSubStr = 'askConfirm("Cerrar SesiÃ³n", "Â¿EstÃ¡s seguro que deseas salir del sistema?", () => {'
$newSubStr = 'askConfirm("Cerrar Sesión", "¿Estás seguro que deseas salir del sistema?", () => {'
$content = $content.Replace($oldSubStr, $newSubStr)

$oldArrow = 'â† '
$newArrow = '←'
$content = $content.Replace($oldArrow, $newArrow)

# Remove the duplicate User Demo block
$duplicateStart = '                            <div class="flex items-center gap-3 mb-2">'
$duplicateEnd = '                                <span class="text-[9px] font-black text-red-100 bg-red-500 px-1.5 py-0.5 rounded">PRO</span>'
# We need to find the one after the new sidebar
$index = $content.IndexOf("Usuario Demo")
if ($index -gt -1) {
    # Find the start of the block containing "Usuario Demo"
    $blockStart = $content.LastIndexOf('<div class="flex items-center gap-3 mb-2">', $index)
    # Find the end of that block’s container
    $blockEnd = $content.IndexOf('</div>', $content.IndexOf('v1.2 Stable', $index))
    $blockEnd = $content.IndexOf('</div>', $blockEnd + 1)
    
    # Actually, the duplicate block is from 3499 to 3511
    # Let's just remove the specific lines if matching works
}

# Safer way: replace a long string
$badBlock = @"
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
"@
if ($content.Contains($badBlock)) {
    $content = $content.Replace($badBlock, "")
}

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Fixed."
