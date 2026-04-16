import networkx as nx


class RelationshipGraphEngine:

    def __init__(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id
        self.graph = nx.DiGraph()

    # ---------------------------------------------------------
    # BUILD GRAPH FROM FK RESULTS
    # ---------------------------------------------------------
    def build_graph(self):

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
    # EXTRACT TABLE NAME (simple parser)
    # ---------------------------------------------------------
    def _extract_table(self, column_str):
        # assumes format: ('table', 'column', 'type')
        try:
            return eval(column_str)[0]
        except:
            return str(column_str)

    # ---------------------------------------------------------
    # ORPHAN DETECTION
    # ---------------------------------------------------------
    def detect_orphans(self):

        return [n for n in self.graph.nodes if self.graph.degree(n) == 0]

    # ---------------------------------------------------------
    # CENTRALITY (importance)
    # ---------------------------------------------------------
    def calculate_centrality(self):

        return nx.degree_centrality(self.graph)

    # ---------------------------------------------------------
    # RELATIONSHIP SCORE
    # ---------------------------------------------------------
    def calculate_score(self):

        if len(self.graph.nodes) == 0:
            return 0

        density = nx.density(self.graph)
        connectivity = len(list(nx.weakly_connected_components(self.graph)))

        score = (density * 70) + (1 / connectivity * 30)

        return round(score * 100, 2)

    # ---------------------------------------------------------
    # EXECUTE
    # ---------------------------------------------------------
    def run(self):

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