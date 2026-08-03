# 06 — Security Architecture

**Phase:** 10.2 — Security  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Architecture                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 1: Authentication                 │   │
│  │  - JWT Token Validation                                   │   │
│  │  - Token Expiry                                           │   │
│  │  - Refresh Token Rotation                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 2: Authorization                  │   │
│  │  - Role-Based Access Control (RBAC)                       │   │
│  │  - Tenant Isolation                                       │   │
│  │  - Resource-Level Permissions                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 3: Data Security                  │   │
│  │  - Encryption at Rest (Fernet/AES)                        │   │
│  │  - Encryption in Transit (TLS)                            │   │
│  │  - Key Management                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Layer 4: Audit                          │   │
│  │  - All CRUD Operations Logged                             │   │
│  │  - Connection Test Logging                                │   │
│  │  - Security Event Tracking                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Layer Architecture

Three separate responsibilities replace the single `EncryptionManager`:

```
SecretsProvider     → Credential retrieval (database, Vault, env vars)
EncryptionProvider  → Encryption/decryption operations (Fernet, AES)
CredentialManager   → Credential lifecycle (CRUD, validation, rotation)
```

### EncryptionProvider

```python
from abc import ABC, abstractmethod

class EncryptionProvider:
    """Single source of truth for encryption operations."""

    def __init__(self, key_source: KeySource):
        self.key_source = key_source
        self._fernet = None

    def _get_fernet(self):
        if self._fernet is None:
            key = self.key_source.get_key()
            self._fernet = Fernet(key)
        return self._fernet

    def encrypt(self, plaintext: str) -> bytes:
        """Encrypt plaintext string."""
        return self._get_fernet().encrypt(plaintext.encode())

    def decrypt(self, ciphertext: bytes) -> str:
        """Decrypt ciphertext to plaintext string."""
        return self._get_fernet().decrypt(ciphertext).decode()

class KeySource(ABC):
    """Abstract key source for encryption key management."""

    @abstractmethod
    def get_key(self) -> bytes:
        pass

class EnvironmentKeySource(KeySource):
    """Key from environment variable (development)."""

    def __init__(self, env_var: str = "FERNET_KEY"):
        self.env_var = env_var

    def get_key(self) -> bytes:
        key = os.environ.get(self.env_var)
        if not key:
            raise ValueError(f"Environment variable {self.env_var} not set")
        return key.encode()

class FileKeySource(KeySource):
    """Key from file (testing)."""

    def __init__(self, key_path: str):
        self.key_path = key_path

    def get_key(self) -> bytes:
        with open(self.key_path, 'r') as f:
            return f.read().strip().encode()

# Future: VaultKeySource, AzureKeyVaultKeySource
```

### CredentialManager

```python
from typing import Dict, Any, Optional
from uuid import uuid4

class CredentialManager:
    """Manages credential lifecycle using SecretsProvider and EncryptionProvider."""

    def __init__(self, secrets_provider: SecretsProvider, encryption_provider: EncryptionProvider):
        self.secrets = secrets_provider
        self.encryption = encryption_provider

    async def create_credential(self, system_id: str, credential_type: str,
                                 credential_data: Dict[str, Any]) -> CredentialResult:
        """Create or update a credential for a system."""
        credential_id = str(uuid4())
        encrypted_value = self.encryption.encrypt(credential_data.get("password", ""))

        # Store via SecretsProvider
        self.secrets.set_secret(credential_id, credential_data.get("password", ""))

        # Persist metadata to database
        await self._save_metadata(credential_id, system_id, credential_type, encrypted_value)

        return CredentialResult(success=True, credential_id=credential_id)

    async def get_credential(self, system_id: str, credential_type: str) -> Optional[Dict[str, Any]]:
        """Retrieve decrypted credential for a system."""
        return self.secrets.get_credential(system_id, credential_type)

    async def rotate_credential(self, credential_id: str, new_value: str) -> bool:
        """Rotate a credential value."""
        return self.secrets.set_secret(credential_id, new_value)

    async def delete_credential(self, credential_id: str) -> bool:
        """Delete a credential."""
        return self.secrets.delete_secret(credential_id)

    async def validate_credential(self, system_id: str, credential_type: str) -> bool:
        """Validate that a credential exists and is accessible."""
        cred = self.secrets.get_credential(system_id, credential_type)
        return bool(cred and cred.get("password"))
```

---

## Audit Logging

```python
class AuditLogger:
    """Logs all security-relevant operations."""

    def __init__(self, db):
        self.db = db

    def log_connection_event(self, event: ConnectionEvent):
        """Log a connection event."""
        query = """
            INSERT INTO core.system_connection_log
            (system_id, action, status, message, duration_ms, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.db.execute(query, (
            event.system_id,
            event.action,
            event.status,
            event.message,
            event.duration_ms,
            event.created_by
        ))

    def log_credential_event(self, event: CredentialEvent):
        """Log a credential event."""
        query = """
            INSERT INTO audit.audit_events
            (action, resource_type, resource_id, user_id, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        self.db.execute(query, (
            event.action,
            'credential',
            event.credential_id,
            event.user_id,
            event.status
        ))
```

---

## Technology Decisions (Awaiting Final Approval)

### Key Management

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Environment Variables** | FERNET_KEY in env vars | Simple, no dependencies | Key in process memory |
| **B: File-Based** | Key stored in secure file | File permissions control access | File management overhead |
| **C: Azure Key Vault** | Azure-native key management | Enterprise-grade, audited | Azure dependency |
| **D: HashiCorp Vault** | HashiCorp Vault | Multi-cloud, enterprise | Additional infrastructure |

**Recommended:** Option A (Development) → Option D or C (Production, depending on customer environment).

The `KeySource` abstraction means either can be plugged in later with zero code changes.

### Connection Pooling Library

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: psycopg2.pool** | Built-in pooling for Postgres | Already in use, simple | Postgres only |
| **B: SQLAlchemy pool** | Database-agnostic pooling | Multi-DB, mature | Heavier dependency |
| **C: Custom pool** | Custom implementation | Full control | Maintenance burden |

**Recommended:** **Option B — SQLAlchemy Pool.**

Reason: Multi-database platform. psycopg2.pool ties you to PostgreSQL. Connection pooling should be infrastructure outside the adapters, using adapter-specific configuration classes for per-database tuning.

### SSL/TLS Certificate Storage

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Filesystem** | Certs stored on disk | Simple | File management |
| **B: Database** | Certs stored in PostgreSQL | Centralized | Larger DB storage |
| **C: Environment** | Certs in env vars | No file management | Size limits |
| **D: Secrets Provider** | Retrieved via SecretsProvider | Unified, Vault-ready | Depends on provider |

**Recommended:** Option A (Development) → Option D (Production).

Avoid storing certificates in PostgreSQL unless there's a strong operational reason.
