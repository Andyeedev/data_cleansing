"""
Adapter Registry

This module provides a registry for dynamic adapter registration and discovery.
"""

from typing import Dict, Type, List, TypeVar

T = TypeVar('T', bound='ConnectionAdapter')
class AdapterRegistry:
    """Registry of available database adapters."""

    _adapters: Dict[str, Type['ConnectionAdapter']] = {}

    @classmethod
    def register(cls, db_type: str, adapter_class: Type['ConnectionAdapter']):
        """Register an adapter class for a database type."""
        cls._adapters[db_type] = adapter_class

    @classmethod
    def get(cls, db_type: str) -> Type['ConnectionAdapter']:
        """Get adapter class for a database type."""
        if db_type not in cls._adapters:
            raise ValueError(f"No adapter registered for {db_type}")
        return cls._adapters[db_type]

    @classmethod
    def supported_types(cls) -> List[str]:
        """Return list of supported database types."""
        return list(cls._adapters.keys())

    @classmethod
    def is_supported(cls, db_type: str) -> bool:
        """Check if a database type is supported."""
        return db_type in cls._adapters

    @classmethod
    def list_adapters(cls) -> Dict[str, Type['ConnectionAdapter']]:
        """Return a copy of the adapters dictionary."""
        return cls._adapters.copy()
