import sys
import uuid
sys.path.insert(0, 'C:/Users/devwork/Desktop/projects/Financial_services_Migration_product/ver1.4/fs-migration-validation-engine')

from app.db.connection import get_db_connection
from app.controls.rule_adapter_control import RuleAdapterControl

with get_db_connection() as db:
    from app.services.system_service import SystemService
    ss = SystemService(db)
    
    src_sys = ss.get_system('802e6b8d-b5d5-4815-b7ee-1f1a3d0cc944')
    tgt_sys = ss.get_system('bc3950e3-3301-4a02-9bc6-8b37c552a7c4')
    
    print('Source system:', src_sys['system_name'], src_sys['database_type'])
    print('Target system:', tgt_sys['system_name'], tgt_sys['database_type'])
    
    from app.services.credential_service import CredentialService
    cred_service = CredentialService(db)
    src_creds = cred_service.get_decrypted_credentials('802e6b8d-b5d5-4815-b7ee-1f1a3d0cc944')
    tgt_creds = cred_service.get_decrypted_credentials('bc3950e3-3301-4a02-9bc6-8b37c552a7c4')
    
    from app.services.system_service import DB_TYPE_MAP
    from app.config import SQLServerConfig
    from app.adapters.registry import AdapterRegistry
    
    src_config = SQLServerConfig(
        host=src_sys['connection_config']['host'],
        port=src_sys['connection_config'].get('port', 1433),
        database=src_sys['connection_config']['database'],
        username=src_creds.get('username', ''),
        password=src_creds.get('password', ''),
        encrypt=True
    )
    
    tgt_config = SQLServerConfig(
        host=tgt_sys['connection_config']['host'],
        port=tgt_sys['connection_config'].get('port', 1433),
        database=tgt_sys['connection_config']['database'],
        username=tgt_creds.get('username', ''),
        password=tgt_creds.get('password', ''),
        encrypt=True
    )
    
    src_adapter = AdapterRegistry.get('sqlserver')()
    src_adapter.connect(src_config)
    
    tgt_adapter = AdapterRegistry.get('sqlserver')()
    tgt_adapter.connect(tgt_config)
    
    # Create context with valid UUID
    test_batch_id = str(uuid.uuid4())
    
    ctx = type('TestContext', (), {
        'engine_db': db,
        'batch_id': test_batch_id,
        'project_id': '819ee182-288f-4aff-a3bd-4b9459d4ba61',
        'config': {},
        'source_connections': {},
        'target_connections': {},
        'source_db': src_adapter,
        'target_db': tgt_adapter
    })()
    
    from app.controls.rule_adapter_control import RuleAdapterControl
    control = RuleAdapterControl(ctx, control_id='C02')
    result = control.execute()
    print('Result:', result)
    print('Status:', result.status)
    print('Message:', result.message)
    print('Error:', result.error)