import os, csv
path = 'engineering/MAP_V2/03_Source/frontend-mvp'
routes = []
services = []
pages = []
components = []
other_api = []
for root, dirs, files in os.walk(path):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, path)
        lower = f.lower()
        if lower.endswith('.tsx') or lower.endswith('.ts') or lower.endswith('.jsx') or lower.endswith('.js'):
            if 'route' in lower or 'routes' in lower:
                routes.append(rel)
            elif 'service' in lower or 'api' in lower:
                services.append(rel)
            elif 'page' in lower or lower.endswith('page.tsx') or lower.endswith('page.ts'):
                pages.append(rel)
            elif 'component' in lower or lower.endswith('component.tsx') or lower.endswith('component.ts'):
                components.append(rel)
            else:
                other_api.append(rel)
all_files = routes + services + pages + components + other_api
with open('mvp_api_inventory.csv', 'w', newline='') as csvfile:
    w = csv.writer(csvfile)
    w.writerow(['category', 'relative_path'])
    for r in routes: w.writerow(['route', r])
    for s in services: w.writerow(['service', s])
    for p in pages: w.writerow(['page', p])
    for c in components: w.writerow(['component', c])
    for o in other_api: w.writerow(['other_api', o])
print(f'Total MVP files (ts/tsx/js/jsx): {len(all_files)}')
print(f'  Routes: {len(routes)}')
print(f'  Services: {len(services)}')
print(f'  Pages: {len(pages)}')
print(f'  Components: {len(components)}')
print(f'  Other API: {len(other_api)}')
print()
print('=== Routes ===')
for r in sorted(routes): print(f'  {r}')
print()
print('=== Services ===')
for s in sorted(services): print(f'  {s}')
print()
print('=== Pages ===')
for p in sorted(pages): print(f'  {p}')