from app.api.routes.public_routes import router

print("Router prefix:", repr(router.prefix))
print("Number of routes:", len(list(router.routes)))
for route in router.routes:
    path = getattr(route, 'path', None)
    methods = getattr(route, 'methods', None)
    name = getattr(route, 'name', None)
    print(f'Route: path={path}, methods={methods}, name={name}')