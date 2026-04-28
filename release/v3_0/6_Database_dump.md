🗄️ Database Dumps

Run exactly:

pg_dump -U postgres -d migration_engine -F c -f migration_engine_v3_0.dump
pg_dump -U postgres -d migration_source -F c -f migration_source_v3_0.dump
pg_dump -U postgres -d migration_target -F c -f migration_target_v3_0.dump