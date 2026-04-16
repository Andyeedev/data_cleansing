# ---------------------------------------------------------
# SAFE IMPORT (PRODUCTION READY)
# ---------------------------------------------------------
try:
    import networkx as nx
    GRAPH_ENABLED = True
except ImportError:
    GRAPH_ENABLED = False


class RelationshipGraphEngine:

    def __init___legacy(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id

        if GRAPH_ENABLED:
            self.graph = nx.DiGraph()
        else:
            self.graph = None

    def __init__(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id

        if GRAPH_ENABLED:
            self.graph = nx.DiGraph()
        else:
            self.graph = None



    # ---------------------------------------------------------
    # BUILD GRAPH FROM FK RESULTS
    # ---------------------------------------------------------
    def build_graph(self):

        if not GRAPH_ENABLED:
            return

        query = """
        SELECT source_column, target_column, confidence
        FROM engine.fk_inference_results
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (self.batch_id,))

        for src, tgt, conf in rows:

            src_table = self._extract_table(src)
            tgt_table = self._extract_table(tgt)

            self.graph.add_edge(src_table, tgt_table, weight=conf)

    # ---------------------------------------------------------
    # SAFE PARSER (NO eval)
    # ---------------------------------------------------------
    def _extract_table(self, column_str):
        try:
            # safer than eval
            return column_str.split(",")[0].replace("(", "").replace("'", "").strip()
        except:
            return str(column_str)

    # ---------------------------------------------------------
    # SCORE
    # ---------------------------------------------------------
    def calculate_score(self):

        if not GRAPH_ENABLED:
            return 0.5  # fallback neutral score

        if len(self.graph.nodes) == 0:
            return 0

        density = nx.density(self.graph)
        connectivity = len(list(nx.weakly_connected_components(self.graph)))

        score = (density * 70) + (1 / connectivity * 30)

        return round(score * 100, 2)

    # ---------------------------------------------------------
    # RUN
    # ---------------------------------------------------------
    def run(self):

        if not GRAPH_ENABLED:
            self._persist(0.5)
            return 0.5

        self.build_graph()
        score = self.calculate_score()
        self._persist(score)

        return score

    # ---------------------------------------------------------
    # STORE
    # ---------------------------------------------------------
    def _persist(self, score):

        query = """
        INSERT INTO engine.relationship_graph_results
        (batch_id, graph_score)
        VALUES (%s,%s)
        """

        self.engine_db.execute(query, (self.batch_id, score))