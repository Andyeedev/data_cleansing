CREATE TABLE IF NOT EXISTS core.connection_diagnostics (
    diagnostic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID NOT NULL,
    check_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    message TEXT,
    latency_ms DECIMAL(10,2),
    server_version VARCHAR(100),
    checked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnostics_system_id ON core.connection_diagnostics(system_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_checked_at ON core.connection_diagnostics(checked_at DESC);
