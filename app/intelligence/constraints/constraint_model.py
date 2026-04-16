class ConstraintModel:
    """
    Unified FK representation across ALL databases
    """

    @staticmethod
    def normalize_fk(row):
        """
        Input (adapter-specific):
        (src_schema, src_table, src_col, tgt_schema, tgt_table, tgt_col)

        Output:
        ("schema.table.col", "schema.table.col")
        """
        return (
            f"{row[0]}.{row[1]}.{row[2]}",
            f"{row[3]}.{row[4]}.{row[5]}"
        )

    @staticmethod
    def to_set(rows):
        return set([ConstraintModel.normalize_fk(r) for r in rows])