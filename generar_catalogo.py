import os
import json
from pathlib import Path

# Directorios de imágenes
muebleria_dir = r"c:\Users\maximiliano.tejerina\Documents\muebles\imagenes_muebleria"
colchoneria_dir = r"c:\Users\maximiliano.tejerina\Documents\muebles\imagenes_colchoneria"

# Extensiones de imagen a buscar
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}

def obtener_imagenes(directorio, categoria, carpeta_relativa):
    """Obtiene lista de imágenes de un directorio"""
    imagenes = []
    
    if not os.path.exists(directorio):
        print(f"⚠ Directorio no encontrado: {directorio}")
        return imagenes
    
    archivos = os.listdir(directorio)
    
    for archivo in sorted(archivos):
        ext = Path(archivo).suffix.lower()
        if ext in image_extensions:
            imagenes.append({
                "id": len(imagenes) + 1,
                "nombre": archivo,
                "categoria": categoria,
                "ruta": f"{carpeta_relativa}/{archivo}"
            })
    
    return imagenes

# Generar catálogo
muebleria_imagenes = obtener_imagenes(muebleria_dir, "muebleria", "imagenes_muebleria")
colchoneria_imagenes = obtener_imagenes(colchoneria_dir, "colchoneria", "imagenes_colchoneria")

# Generar archivo JavaScript
js_content = "// Catálogo de imágenes generado automáticamente\n"
js_content += "const catalogoData = {\n"
js_content += "    muebleria: " + json.dumps(muebleria_imagenes, ensure_ascii=False, indent=2) + ",\n"
js_content += "    colchoneria: " + json.dumps(colchoneria_imagenes, ensure_ascii=False, indent=2) + "\n"
js_content += "};\n"

# Guardar archivo JavaScript
output_file = r"c:\Users\maximiliano.tejerina\Documents\muebles\catalogo.js"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("=" * 60)
print("✓ Catálogo generado exitosamente!")
print(f"✓ Imágenes de Mueblería: {len(muebleria_imagenes)}")
print(f"✓ Imágenes de Colchonería: {len(colchoneria_imagenes)}")
print(f"✓ Total: {len(muebleria_imagenes) + len(colchoneria_imagenes)}")
print(f"✓ Guardado en: {output_file}")
print("=" * 60)
