import logging

#from flask import config
from app.utils.logger import get_logger

logger = get_logger(__name__)


class MetadataDiscovery:

    def __init__(self, engine_db, connection_factory, project_id):
        """
        engine_db: connection to metadata DB
        connection_factory: function(system_config) -> db connection
        project_id: current project
        """
        self.engine_db = engine_db
        self.connection_factory = connection_factory
        self.project_id = project_id


    
    def __init___legacy_1(self, engine_db, source_db, project_id):
        self.engine_db = engine_db
        self.source_db = source_db
        self.project_id = project_id

    # -----------------------------------------------------
    # PUBLIC ENTRY
    # -----------------------------------------------------

    def run(self):

        logger.info(f"Starting metadata discovery for project {self.project_id}")

        systems = self._get_systems()

        for system in systems:

            system_id = system["system_id"]
            system_name = system["system_name"]
            #config = system["connection_config"]
            
            config = system["connection_config"].copy()
            config["database_type"] = system["database_type"]


            

            logger.info(f"Discovering system: {system_name}")

            try:
                db_conn = self.connection_factory(config)

                self._discover_tables(system_id, db_conn)
                self._discover_columns(system_id, db_conn)

            except Exception as e:
                logger.error(f"Discovery failed for {system_name}: {str(e)}")

        logger.info("Metadata discovery completed")

    # -----------------------------------------------------
    # FETCH SYSTEMS
    # -----------------------------------------------------

    def _get_systems(self):

        query = """
        SELECT system_id, system_name, connection_config, database_type
        FROM core.system_registry
        WHERE project_id = %s
        """

        rows = self.engine_db.execute(query, (self.project_id,))

        systems = []
        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_name": r[1],
                "connection_config": r[2],
                "database_type": r[3]
            })

        return systems

    # -----------------------------------------------------
    # TABLE DISCOVERY
    # -----------------------------------------------------

    def _discover_tables(self, system_id, db_conn):

        query = """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('information_schema', 'pg_catalog')
        """

        tables = db_conn.execute(query)

        for schema, table in tables:

            self._upsert_dataset(system_id, schema, table)

    def _upsert_dataset(self, system_id, schema, table):

        check_query = """
        SELECT dataset_id
        FROM core.datasets
        WHERE system_id = %s
        AND schema_name = %s
        AND table_name = %s
        """

        exists = self.engine_db.execute(
            check_query,
            (system_id, schema, table)
        )

        if exists:
            return

        insert_query = """
        INSERT INTO core.datasets
        (system_id, schema_name, table_name)
        VALUES (%s, %s, %s)
        """

        self.engine_db.execute(
            insert_query,
            (system_id, schema, table)
        )

        logger.info(f"Registered table: {schema}.{table}")

    # -----------------------------------------------------
    # COLUMN DISCOVERY
    # -----------------------------------------------------

    def _discover_columns(self, system_id, db_conn):

        query = """
        SELECT
            c.table_schema,
            c.table_name,
            c.column_name,
            c.ordinal_position,
            c.data_type,
            c.is_nullable
        FROM information_schema.columns c
        WHERE c.table_schema NOT IN ('information_schema', 'pg_catalog')
        """

        columns = db_conn.execute(query)

        for row in columns:

            schema = row[0]
            table = row[1]
            column = row[2]
            position = row[3]
            data_type = row[4]
            is_nullable = row[5] == 'YES'

            dataset_id = self._get_dataset_id(system_id, schema, table)

            if not dataset_id:
                continue

            self._upsert_column(
                dataset_id,
                column,
                position,
                data_type,
                is_nullable
            )

    def _get_dataset_id(self, system_id, schema, table):

        query = """
        SELECT dataset_id
        FROM core.datasets
        WHERE system_id = %s
        AND schema_name = %s
        AND table_name = %s
        """

        result = self.engine_db.execute(
            query,
            (system_id, schema, table)
        )

        return result[0][0] if result else None

    def _upsert_column_legacy_1(self, dataset_id, column, position, data_type, is_nullable):

        check_query = """
        SELECT 1
        FROM core.dataset_columns
        WHERE dataset_id = %s
        AND column_name = %s
        """

        exists = self.engine_db.execute(
            check_query,
            (dataset_id, column)
        )

        if exists:
            return

        insert_query = """
        INSERT INTO core.dataset_columns
        (
            dataset_id,
            column_name,
            column_position,
            data_type,
            is_nullable
        )
        VALUES (%s, %s, %s, %s, %s)
        """

        self.engine_db.execute(
            insert_query,
            (dataset_id, column, position, data_type, is_nullable)
        )

        logger.info(f"Registered column: {column}")


    def _upsert_column(self, dataset_id, column):

        
        check_query = """
        SELECT 1
        FROM core.dataset_columns
        WHERE dataset_id = %s
        AND column_name = %s
        """

        exists = self.engine_db.execute(
            check_query,
            (dataset_id, column)
        )

        if exists:
            return

        query = """
        INSERT INTO core.dataset_columns
        (dataset_id, column_name, column_position, data_type, is_nullable)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (dataset_id, column_name)
        DO UPDATE SET
            data_type = EXCLUDED.data_type,
            is_nullable = EXCLUDED.is_nullable
        """

        self.engine_db.execute(query, (
            dataset_id,
            column["column_name"],
            column["ordinal_position"],
            column["data_type"],
            column["is_nullable"]
        ))
        logger.info(f"Registered column: {column}")
        