import os, re

path = 'engineering/MAP_V2/03_Source/frontend/src'
fetch_keywords = ['fetch', 'axios', 'apiClient', 'useQuery', 'useSWR', 'react-query', 'swr', 'api/', '/api/']
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
        matches = []
        for kw in fetch_keywords:
            if kw in content:
                matches.append(kw)
        if matches:
            rel = os.path.relpath(full, path)
            urls = re.findall(r'["\x27](/api/v[^"\x27]+)["\x27]', content)
            if urls:
                print(f'{rel}: fetches={matches} urls={urls}')