from google.cloud import bigquery
import logging
from app.db.adapters.base_adapter import BaseAdapter

logger = logging.getLogger(__name__)


class BigQueryAdapter(BaseAdapter):

    def __init__(self, config):
        super().__init__(config)
        self.connect()  # uses retry logic


    def connect_current_1(self):
        logger.info("Connecting to BigQuery...")

        self.connection = bigquery.Client()

    def _connect(self):
        self.connection = psycopg2.connect(
            host=self.config.get("host"),
            port=self.config.get("port"),
            database=self.config.get("database"),
            user=self.config.get("user"),
            password=self.config.get("password")
        )

    def execute(self, query, params=None):
        query_job = self.connection.query(query)
        results = query_job.result()
        return [tuple(row.values()) for row in results]


    def _validation_query(self):
        return "SELECT 1"