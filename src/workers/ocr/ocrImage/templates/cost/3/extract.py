import json
import os
from PIL import Image

SIZE = (47, 47)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_EXTS = {'.png'}

def extract_template(filepath):
    img = Image.open(filepath).resize(SIZE).convert('RGBA')
    return list(img.tobytes())

def run():
    cost_templates = {}

    for filename in os.listdir(SCRIPT_DIR):
        ext = os.path.splitext(filename)[1].lower()
        if ext not in IMAGE_EXTS:
            continue
        name = os.path.splitext(filename)[0]
        print(f'Extracting: {filename}')
        cost_templates[name] = extract_template(os.path.join(SCRIPT_DIR, filename))

    output = f'export const COST_TEMPLATES = {json.dumps(cost_templates, indent=2)};\n'

    out_path = os.path.join(SCRIPT_DIR, 'templates.js')
    with open(out_path, 'w') as f:
        f.write(output)

    print(f'Written to {out_path}')

run()
