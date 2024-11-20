import os
import json

def generate_json_file():
    # Verfügbare Bildformate
    image_extensions = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}
    current_dir = os.getcwd()
    
    # Alle Dateien im aktuellen Ordner auflisten
    files = os.listdir(current_dir)
    
    # Nur Bilddateien filtern
    images = [f for f in files if os.path.isfile(f) and os.path.splitext(f)[1].lower() in image_extensions]
    
    # JSON-Datei erstellen
    json_filename = "index.json"
    with open(json_filename, "w", encoding="utf-8") as json_file:
        json.dump(images, json_file, indent=4, ensure_ascii=False)
    
    print(f"JSON-Datei '{json_filename}' wurde erfolgreich erstellt mit {len(images)} Einträgen.")

if __name__ == "__main__":
    generate_json_file()
