import logging

logger = logging.getLogger(__name__)


class SafeSQL:

    @staticmethod
    def execute(db, query, params=None):

        try:

            if params:
                return db.execute(query, params)

            return db.execute(query)

        except Exception as e:

            logger.warning(f"SQL execution failed: {e}")

            return None