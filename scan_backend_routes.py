import os, re

results = {}
for root, dirs, files in os.walk('src'):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '__pycache__', '.pytest_cache']]
    for f in sorted(files):
        if not f.endswith('.py'):
            continue
        full = os.path.join(root, f)
        try:
            content = open(full, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        urls = re.findall(r'["\x27](/api/v[^\x27"\s]+)["\x27]', content)
        if urls:
            rel = os.path.relpath(full, '.')
            for u in sorted(set(urls)):
                if rel not in results:
                    results[rel] = []
                results[rel].append(u)

for rel in sorted(results):
    for u in sorted(set(results[rel])):
        print(f'{rel}: {u}')