import os, re

path = 'engineering/MAP_V2/03_Source/frontend-mvp/src/routes'
results = {}
for root, dirs, files in os.walk(path):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.vite', 'dist']]
    for f in sorted(files):
        if not (f.endswith('.tsx') or f.endswith('.ts')):
            continue
        full = os.path.join(root, f)
        try:
            content = open(full, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        # Find all API calls: apiGet('/api/v...'), apiPost('/api/v...'), etc.
        urls = re.findall(r'api(?:Get|Post|Put|Delete)\s*\(\s*["\x27](/api/v[^"\x27]+)["\x27]', content)
        if not urls:
            urls = re.findall(r'["\x27](/api/v[^"\x27]+)["\x27]', content)
        if urls:
            rel = os.path.relpath(full, path)
            unique = sorted(set(urls))
            results[rel] = unique

for rel in sorted(results):
    print(f'{rel}: {results[rel]}')
