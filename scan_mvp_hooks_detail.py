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
    # Find all apiGet/apiPost/apiPut/apiDelete calls
    calls = re.findall(r'(api(?:Get|Post|Put|Delete)\s*\(\s*["\x27]([^"\x27]+)["\x27]', content)
    if calls:
        print(f'=== hooks/{f} ===')
        for func, url in calls:
            print(f'  {func}("{url}")')
        # Also find any URL construction
        urls = re.findall(r'[/][/]*["\x27](/api/[^"\x27]+)["\x27]', content)
        if urls:
            print(f'  string literals: {sorted(set(urls))}')
        print()