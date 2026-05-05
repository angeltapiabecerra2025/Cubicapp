import os

path = r"c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"

# Intentamos leerlo detectando la codificación o forzando la limpieza
try:
    # Leemos el archivo en binario para ver si tiene BOM o es UTF-16
    with open(path, 'rb') as f:
        raw_data = f.read()
    
    # Intentamos decodificarlo. Si tiene espacios entre caracteres, es probablemente UTF-16
    try:
        content = raw_data.decode('utf-16')
    except:
        content = raw_data.decode('utf-8', errors='ignore')

    # Limpiamos el contenido de posibles caracteres fantasmas y quitamos el cache bust al final
    # Buscamos la etiqueta </html> y cortamos lo que haya después
    if "</html>" in content:
        content = content.split("</html>")[0] + "</html>"
    
    # Nos aseguramos de que no haya basura al inicio
    if "<!DOCTYPE html>" in content:
         content = content[content.find("<!DOCTYPE html>"):]

    # Guardamos como UTF-8 puro (sin BOM)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Archivo index.html normalizado y guardado como UTF-8 con éxito.")

except Exception as e:
    print(f"Error al procesar el archivo: {e}")
