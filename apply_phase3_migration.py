import psycopg2

conn = psycopg2.connect(dbname='migration_engine', user='postgres', password='dev123456', host='localhost')
cur = conn.cursor()

# Apply Phase 3 subscription status migration
cur.execute("""
DO $$
BEGIN
    -- Drop the existing CHECK constraint if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_status_check'
        AND conrelid = 'platform.subscriptions'::regclass
    ) THEN
        ALTER TABLE platform.subscriptions DROP CONSTRAINT subscriptions_status_check;
    END IF;

    -- Add the new CHECK constraint with all valid statuses
    ALTER TABLE platform.subscriptions
        ADD CONSTRAINT subscriptions_status_check
        CHECK (status IN ('active','trialing','past_due','pending_cancellation','suspended','cancelled','expired','pending'));

    RAISE NOTICE 'OC-COM-001d Phase 3: subscription status CHECK constraint updated with past_due, pending_cancellation';
END $$;
""")
conn.commit()
print('Phase 3 subscription status migration applied')

# Add list_price column
cur.execute('ALTER TABLE platform.plans ADD COLUMN IF NOT EXISTS list_price NUMERIC(10,2)')
conn.commit()
print('list_price column added')

conn.close()