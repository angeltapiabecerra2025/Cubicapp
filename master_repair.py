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
    "ContraseÃ±a": "Contraseña",
    "electrÃ³nico": "electrónico"
}

try:
    with open(path, 'rb') as f:
        bytes_content = f.read()
    
    # Intentamos diferentes decodificaciones
    try:
        content = bytes_content.decode('utf-8')
    except:
        content = bytes_content.decode('latin-1')

    for bad, good in fixes.items():
        content = content.replace(bad, good)
    
    # Limpieza final
    if "</html>" in content:
        content = content.split("</html>")[0] + "</html>"
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Reparación Python exitosa.")
except Exception as e:
    print(f"Error: {e}")
