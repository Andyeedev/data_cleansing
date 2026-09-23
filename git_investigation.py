import subprocess

# Search git log for plans
result = subprocess.run(
    ['git', 'log', '--all', '--oneline', '--grep=plans'],
    capture_output=True, text=True, cwd='C:\\Users\\devwork\\Desktop\\projects\\Financial_services_Migration_product\\ver1.4\\fs-migration-validation-engine'
)
print('=== Git log with plans ===')
print('STDOUT:', result.stdout)
print('STDERR:', result.stderr)

# Search for /api/v1/public/plans
result2 = subprocess.run(
    ['git', 'log', '--all', '--oneline', '-S', '/api/v1/public/plans'],
    capture_output=True, text=True, cwd='C:\\Users\\devwork\\Desktop\\projects\\Financial_services_Migration_product\\ver1.4\\fs-migration-validation-engine'
)
print('=== Git log with /api/v1/public/plans ===')
print('STDOUT:', result2.stdout)
print('STDERR:', result2.stderr)

# Search for plans in public_routes
result3 = subprocess.run(
    ['git', 'log', '--all', '--oneline', '-S', 'plans'],
    capture_output=True, text=True, cwd='C:\\Users\\devwork\\Desktop\\projects\\Financial_services_Migration_product\\ver1.4\\fs-migration-validation-engine'
)
print('=== Git log with plans (anywhere) ===')
print('STDOUT:', result3.stdout)
print('STDERR:', result3.stderr)