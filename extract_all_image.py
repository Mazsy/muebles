import os
import zipfile
from pathlib import Path
import shutil

# Directorios origen
muebleria_dir = r"c:\Users\maximiliano.tejerina\Documents\muebles\muebleria"
colchoneria_dir = r"c:\Users\maximiliano.tejerina\Documents\muebles\colchoneria"

# Directorios de destino separados por categoría
muebleria_output = r"c:\Users\maximiliano.tejerina\Documents\muebles\imagenes_muebleria"
colchoneria_output = r"c:\Users\maximiliano.tejerina\Documents\muebles\imagenes_colchoneria"

# Crear directorios de salida si no existen
os.makedirs(muebleria_output, exist_ok=True)
os.makedirs(colchoneria_output, exist_ok=True)

# Extensiones de imagen a buscar
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff'}

def extract_images_from_zip(zip_path, output_folder):
    """Extrae todas las imágenes de un archivo ZIP"""
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            for file_info in zip_ref.filelist:
                file_ext = Path(file_info.filename).suffix.lower()
                
                # Si es una imagen, extraerla
                if file_ext in image_extensions:
                    # Obtener solo el nombre del archivo
                    filename = os.path.basename(file_info.filename)
                    
                    # Leer el contenido del archivo
                    file_content = zip_ref.read(file_info.filename)
                    
                    # Guardar en la carpeta de salida
                    output_path = os.path.join(output_folder, filename)
                    
                    # Si el archivo ya existe, agregar un contador
                    if os.path.exists(output_path):
                        name, ext = os.path.splitext(filename)
                        counter = 1
                        while os.path.exists(os.path.join(output_folder, f"{name}_{counter}{ext}")):
                            counter += 1
                        output_path = os.path.join(output_folder, f"{name}_{counter}{ext}")
                    
                    with open(output_path, 'wb') as f:
                        f.write(file_content)
                    
                    print(f"✓ Extraída: {filename}")
    except Exception as e:
        print(f"✗ Error al procesar {zip_path}: {e}")

def process_directory(directory, output_folder):
    """Procesa todos los archivos ZIP en un directorio"""
    if not os.path.exists(directory):
        print(f"⚠ Directorio no encontrado: {directory}")
        return
    
    zip_files = [f for f in os.listdir(directory) if f.endswith('.zip')]
    
    if not zip_files:
        print(f"⚠ No se encontraron archivos ZIP en: {directory}")
        return
    
    print(f"\nProcesando {len(zip_files)} archivos en: {directory}")
    for zip_file in zip_files:
        zip_path = os.path.join(directory, zip_file)
        print(f"\n📦 Procesando: {zip_file}")
        extract_images_from_zip(zip_path, output_folder)

# Procesamiento
print("=" * 60)
print("Extracción de imágenes de archivos ZIP")
print("=" * 60)

# Procesar muebleria
process_directory(muebleria_dir, muebleria_output)

# Procesar colchoneria
process_directory(colchoneria_dir, colchoneria_output)

# Contar imágenes extraídas
muebleria_count = len([f for f in os.listdir(muebleria_output) if Path(f).suffix.lower() in image_extensions])
colchoneria_count = len([f for f in os.listdir(colchoneria_output) if Path(f).suffix.lower() in image_extensions])
total_count = muebleria_count + colchoneria_count

print("\n" + "=" * 60)
print(f"✓ Proceso completado!")
print(f"✓ Imágenes de Mueblería: {muebleria_count}")
print(f"   Guardadas en: {muebleria_output}")
print(f"✓ Imágenes de Colchonería: {colchoneria_count}")
print(f"   Guardadas en: {colchoneria_output}")
print(f"✓ Total de imágenes extraídas: {total_count}")
print("=" * 60)
