# -*- coding: utf-8 -*-
import os

path = r"c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"

fixes = {
    "ðŸ“§": "📧",
    "ðŸ”‘": "🔑",
    "âš¡": "⚡",
    "â†’": "→",
    "â† ": "←",
    "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢": "••••••••",
    "GestiÃ³n": "Gestión",
    "electrÃ³nico": "electrónico",
    "ContraseÃ±a": "Contraseña"
}

if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for bad, good in fixes.items():
        content = content.replace(bad, good)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Correcciones de codificación aplicadas con éxito.")
else:
    print("Error: No se encontró el archivo index.html")
