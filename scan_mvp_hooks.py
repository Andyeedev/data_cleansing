import os, re

path = 'engineering/MAP_V2/03_Source/frontend-mvp/src/hooks'
for f in sorted(os.listdir(path)):
    if not (f.endswith('.ts') or f.endswith('.tsx')):
        continue
    full = os.path.join(path, f)
    try:
        content = open(full, 'r', encoding='utf-8', errors='ignore').read()
    except:
        continue
    urls = re.findall(r'["\x27](/api/v[^"\x27]+)["\x27]', content)
    if urls:
        print(f'hooks/{f}: {sorted(set(urls))}')