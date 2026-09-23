import os
frontend_routes = 'C:/Users/devwork/Desktop/projects/Financial_services_Migration_product/ver1.4/fs-migration-validation-engine/engineering/MAP_V3/03_Source/frontend-mvp/src/routes'
for root, dirs, files in os.walk(frontend_routes):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fh:
                    content = fh.read()
                    if 'userRoles.some(r => r === \'admin\' or r === \'Super Admin\')' in content and 'Tenant Admin' not in content:
                        print(path)
            except UnicodeDecodeError:
                pass