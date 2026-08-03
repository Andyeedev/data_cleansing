import os, fnmatch

print("=== MVP API routes ===")
for f in sorted(os.listdir('app/api/routes')):
    if f.endswith('_routes.py'):
        print(' ', f)

print()
print("=== MVP models ===")
for f in sorted(os.listdir('app/api/models')):
    if f.endswith('_models.py'):
        print(' ', f)

print()
print("=== MVP services ===")
for f in sorted(os.listdir('app/services')):
    if f.endswith('_service.py'):
        print(' ', f)

print()
print("=== Frozen frontend pages ===")
frontend_pages = 'MAP_V2/03_Source/frontend/src/pages'
if os.path.exists(frontend_pages):
    for f in sorted(os.listdir(frontend_pages)):
        if f.endswith('.tsx'):
            print(' ', f)

print()
print("=== Frozen frontend components ===")
frontend_components = 'MAP_V2/03_Source/frontend/src/components'
if os.path.exists(frontend_components):
    for f in sorted(os.listdir(frontend_components)):
        if f.endswith('.tsx'):
            print(' ', f)