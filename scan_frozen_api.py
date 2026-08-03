import os, re

print('=== Frozen Frontend Services ===')
path = 'engineering/MAP_V2/03_Source/frontend/src/services'
if os.path.exists(path):
    for f in sorted(os.listdir(path)):
        full = os.path.join(path, f)
        size = os.path.getsize(full)
        print(f'  {f} ({size} bytes)')
        try:
            content = open(full, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        urls = re.findall(r'["\x27](/api/v[^"\x27]+)["\x27]', content)
        if urls:
            print(f'    API endpoints: {urls}')
else:
    print('  Directory not found')
print()

print('=== Frozen Frontend Utils ===')
path = 'engineering/MAP_V2/03_Source/frontend/src/utils'
if os.path.exists(path):
    for f in sorted(os.listdir(path)):
        full = os.path.join(path, f)
        size = os.path.getsize(full)
        print(f'  {f} ({size} bytes)')
else:
    print('  Directory not found')
print()

print('=== Frozen Frontend - All files that mention /api/ ===')
path = 'engineering/MAP_V2/03_Source/frontend/src'
for root, dirs, files in os.walk(path):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.vite', 'dist']]
    for f in sorted(files):
        if not (f.endswith('.tsx') or f.endswith('.ts') or f.endswith('.jsx') or f.endswith('.js')):
            continue
        full = os.path.join(root, f)
        try:
            content = open(full, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        urls = re.findall(r'["\x27](/api/v[^"\x27]+)["\x27]', content)
        if urls:
            rel = os.path.relpath(full, path)
            print(f'  {rel}: {urls}')