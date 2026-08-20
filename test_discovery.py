import sys
sys.path.insert(0, '.')

from app.services.discovery_service_api import DiscoveryService
from app.db.connection import get_db_connection

svc = DiscoveryService()
result = svc.trigger_discovery("cd738f5f-2be0-4ca1-9762-32c0444c311c")
print("Result:", result)