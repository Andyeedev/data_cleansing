import sys
sys.path.insert(0, 'C:/Users/devwork/Desktop/projects/Financial_services_Migration_product/ver1.4/fs-migration-validation-engine')

from app.db.connection import get_db_connection
from app.services.report_suite_service import ReportSuiteService

with get_db_connection() as db:
    service = ReportSuiteService(db)
    data = service.get_suite(tenant_id='74dff1e4-7684-4fe7-8e38-915627120c8a', batch_id='0e9e0197-3d54-4273-ad79-cec612318d2a')
    
    # Check all sections
    for key in ['executive', 'migration', 'validation', 'governance', 'risk', 'quality', 'readiness', 'issues', 'operational', 'migration_pack', 'validation_pack', 'governance_pack', 'audit_pack']:
        val = data.get(key)
        if val:
            print(f'  {key}: OK - keys: {list(val.keys())}')
        else:
            print(f'  {key}: MISSING')