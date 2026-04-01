import re
import json
from pathlib import Path

# Ler package.json
with open('package.json', 'r') as f:
    pkg = json.load(f)
    installed = set(pkg.get('dependencies', {}).keys()) | set(pkg.get('devDependencies', {}).keys())

# Padrão regex para imports
import_pattern = r'from ["\']([^"\']+)["\']'

# Extrair imports de todos os arquivos UI
imports_found = set()
ui_path = Path('src/app/components/ui')
for file in ui_path.glob('*.tsx'):
    with open(file, 'r') as f:
        content = f.read()
        matches = re.findall(import_pattern, content)
        for match in matches:
            if not match.startswith('.'):
                imports_found.add(match)

# Achar packages que estão faltando
missing = []
print('=== IMPORTS ENCONTRADOS ===')
for imp in sorted(imports_found):
    base = imp.split('/')[0]
    installed_str = '✓' if base in installed else 'X'
    print(f'{installed_str} {imp}')
    if base not in installed:
        missing.append(base)

# Remover duplicatas
missing = sorted(set(missing))

if missing:
    print(f'\n=== FALTANDO ({len(missing)}) ===')
    for m in missing:
        print(f'{m}')
    print(f'\n=== COMANDO PARA INSTALAR ===')
    print(f'npm install {" ".join(missing)} --legacy-peer-deps')
else:
    print('\n✓ Todos os imports estão instalados!')
