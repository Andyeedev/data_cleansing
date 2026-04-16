try:
    import networkx as nx
    GRAPH_ENABLED = True
except ImportError:
    GRAPH_ENABLED = False


class RelationshipGraphEngine:

    def __init___old(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.graph = nx.DiGraph() if GRAPH_ENABLED else None

    def __init___current_1(self, source_db, target_db, engine_db, batch_id):
        self.source_db = source_db
        self.target_db = target_db
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.graph = nx.DiGraph() if GRAPH_ENABLED else None

    def __init___current_1(self, engine_db, batch_id, source_db=None, target_db=None):
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.source_db = source_db
        self.target_db = target_db
        self.graph = nx.DiGraph() if GRAPH_ENABLED else None

    def __init___current_2(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id

    
    def __init__(self, source_adapter, target_adapter, engine_db, batch_id):
        self.source_adapter = source_adapter
        self.target_adapter = target_adapter
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.graph = nx.DiGraph() if GRAPH_ENABLED else None
            

    def build_graph(self):

        if not GRAPH_ENABLED:
            return

        rows = self.engine_db.execute("""
            SELECT source_column, target_column, confidence
            FROM engine.fk_inference_results
            WHERE batch_id = %s
        """, (self.batch_id,))

        for src, tgt, conf in rows:
            self.graph.add_edge(src, tgt, weight=conf)

    def calculate_score_legacy(self):

        if not GRAPH_ENABLED:
            return 0.5

        if len(self.graph.nodes) == 0:
            return 0

        density = nx.density(self.graph)
        connectivity = len(list(nx.weakly_connected_components(self.graph)))

        return round((density * 70 + (1 / connectivity) * 30) * 100, 2)
    
    def calculate_score(self):

        if not GRAPH_ENABLED:
            return 50

        if len(self.graph.nodes) == 0:
            return 0

        density = nx.density(self.graph)
        connectivity = len(list(nx.weakly_connected_components(self.graph)))

        score = (density * 0.7 + (1 / max(connectivity, 1)) * 0.3) * 100

        return round(min(score, 100), 2)  # ✅ CAP AT 100


    def run(self):

        if not GRAPH_ENABLED:
            self._persist(0.5)
            return 0.5

        self.build_graph()
        score = self.calculate_score()
        self._persist(score)

        return score

    def _persist(self, score):

        self.engine_db.execute("""
        INSERT INTO engine.relationship_graph_results
        (batch_id, graph_score)
        VALUES (%s,%s)
        """, (self.batch_id, score))