def _schema_similarity(self, source_table, target_table):

    s_cols = {c[1] for c in self.source.get_columns() if c[0] == source_table}
    t_cols = {c[1] for c in self.target.get_columns() if c[0] == target_table}

    if not s_cols or not t_cols:
        return 0

    intersection = len(s_cols & t_cols)
    union = len(s_cols | t_cols)

    return (intersection / union) * 100