
class ConstraintLoader:
    """
    SaaS-compliant FK loader using adapters ONLY
    """

    def __init__(self, source_db, target_db):
        self.source_adapter = source_db.adapter
        self.target_adapter = target_db.adapter

    def load(self):
        """
        Returns:
        {
            "source": set(...),
            "target": set(...)
        }
        """

        source_fks = self._normalize(
            self.source_adapter.get_foreign_keys()
        )

        target_fks = self._normalize(
            self.target_adapter.get_foreign_keys()
        )

        return {
            "source": source_fks,
            "target": target_fks
        }

    def _normalize(self, fk_rows):
        """
        Normalize adapter FK format → standard format

        Expected adapter format:
        (schema, table, column, ref_schema, ref_table, ref_column)

        Output:
        ("schema.table.column", "schema.table.column")
        """

        normalized = set()

        for row in fk_rows:

            try:
                src_schema, src_table, src_col, tgt_schema, tgt_table, tgt_col = row

                src = f"{src_schema}.{src_table}.{src_col}"
                tgt = f"{tgt_schema}.{tgt_table}.{tgt_col}"

                normalized.add((src, tgt))

            except Exception as e:
                print(f"[ConstraintLoader ERROR] {row} → {e}")

        return normalized