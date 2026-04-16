from app.intelligence.constraints.constraint_model import ConstraintModel

class ConstraintLoader:

    def __init___current_1(self, source_db, target_db):
        self.source_db = source_db
        self.target_db = target_db

    def __init__(self, source_adapter, target_adapter):
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter

    def load_legacy(self):

        source_fks = self._normalize(
            self.source_db.adapter.get_foreign_keys()
        )

        target_fks = self._normalize(
            self.target_db.adapter.get_foreign_keys()
        )

        return {
            "source": source_fks,
            "target": target_fks
        }

    def load_current_1(self):

        source_fks = self._normalize(
            self.source_db.adapter.get_foreign_keys()
        )

        target_fks = self._normalize(
            self.target_db.adapter.get_foreign_keys()
        )

        return {
            "source": source_fks,
            "target": target_fks
        }
    
        return set(source_constraints).union(set(target_constraints))
    
    
    def load_current_2(self):

        # ❗ If DB supports constraints → use adapter
        if self.source_adapter.capabilities.get("supports_constraints"):

            return self._load_from_adapter(self.source_adapter)

        # ❗ Otherwise fallback to inference
        return set()
    

    def load(self):

        source_fks = self._load_from_adapter(self.source_adapter)
        target_fks = self._load_from_adapter(self.target_adapter)

        return {
            "source": source_fks,
            "target": target_fks
        }

    

    def _normalize_current_1(self, fks):

        normalized = set()

        for fk in fks:
            normalized.add((
                f"{fk[0]}.{fk[1]}.{fk[2]}",
                f"{fk[3]}.{fk[4]}.{fk[5]}"
            ))

        return normalized
    
    def _load_from_adapter_current_2(self, adapter):

        if hasattr(adapter, "get_foreign_keys"):
            fks = adapter.get_foreign_keys()

            return set([
                (
                    f"{r[0]}.{r[1]}.{r[2]}",
                    f"{r[3]}.{r[4]}.{r[5]}"
                )
                for r in fks
            ])

        return set()


    
    
    def _load_from_adapter(self, adapter):

        if not adapter.capabilities.get("supports_constraints"):
            return set()

        raw_fks = adapter.get_foreign_keys()

        if not raw_fks:
            return set()

        return ConstraintModel.to_set(raw_fks)