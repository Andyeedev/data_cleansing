-- MAP Nexus Enterprise Platform
-- Audit Schema Creation Script
-- Target: migration_engine database
-- Note: All audit records are append-only and immutable

-- Create audit schema
CREATE SCHEMA IF NOT EXISTS audit;

-- =====================================================
-- AUDIT EVENTS
-- =====================================================

CREATE TABLE audit.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id UUID,
    user_email VARCHAR(255),
    user_name VARCHAR(200),
    session_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    resource_name VARCHAR(200),
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'success'
        CHECK (status IN ('success', 'failure', 'error')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_audit_events_timestamp ON audit.audit_events (timestamp DESC);
CREATE INDEX idx_audit_events_user_id ON audit.audit_events (user_id);
CREATE INDEX idx_audit_events_action ON audit.audit_events (action);
CREATE INDEX idx_audit_events_resource_type ON audit.audit_events (resource_type);
CREATE INDEX idx_audit_events_resource_id ON audit.audit_events (resource_id);

-- =====================================================
-- SECURITY EVENTS
-- =====================================================

CREATE TABLE audit.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    event_type VARCHAR(100) NOT NULL
        CHECK (event_type IN (
            'login_success', 'login_failure', 'logout',
            'password_change', 'password_reset_request', 'password_reset_complete',
            'mfa_enable', 'mfa_disable', 'mfa_challenge_success', 'mfa_challenge_failure',
            'account_locked', 'account_unlocked', 'account_deactivated',
            'role_assigned', 'role_removed',
            'permission_granted', 'permission_revoked',
            'session_created', 'session_expired', 'session_revoked',
            'token_refreshed', 'token_revoked',
            'unauthorized_access_attempt', 'rate_limit_exceeded',
            'suspicious_activity', 'brute_force_detected'
        )),
    user_id UUID,
    user_email VARCHAR(255),
    severity VARCHAR(20) DEFAULT 'info'
        CHECK (severity IN ('info', 'warning', 'critical')),
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    risk_score NUMERIC(5,2),
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_security_events_timestamp ON audit.security_events (timestamp DESC);
CREATE INDEX idx_audit_security_events_user_id ON audit.security_events (user_id);
CREATE INDEX idx_audit_security_events_event_type ON audit.security_events (event_type);
CREATE INDEX idx_audit_security_events_severity ON audit.security_events (severity);

-- =====================================================
-- LOGIN HISTORY
-- =====================================================

CREATE TABLE audit.login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('success', 'failure', 'locked', 'blocked')),
    ip_address INET NOT NULL,
    user_agent TEXT,
    geo_location JSONB,
    failure_reason TEXT,
    login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_login_history_user_id ON audit.login_history (user_id);
CREATE INDEX idx_audit_login_history_login_at ON audit.login_history (login_at DESC);
CREATE INDEX idx_audit_login_history_status ON audit.login_history (status);

-- =====================================================
-- API LOGS
-- =====================================================

CREATE TABLE audit.api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    request_id VARCHAR(255),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    query_params JSONB,
    request_headers JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_body JSONB,
    response_time_ms INTEGER,
    user_id UUID,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    content_length INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_api_logs_timestamp ON audit.api_logs (timestamp DESC);
CREATE INDEX idx_audit_api_logs_user_id ON audit.api_logs (user_id);
CREATE INDEX idx_audit_api_logs_method ON audit.api_logs (method);
CREATE INDEX idx_audit_api_logs_path ON audit.api_logs (path);
CREATE INDEX idx_audit_api_logs_response_status ON audit.api_logs (response_status);

-- =====================================================
-- CONFIGURATION HISTORY
-- =====================================================

CREATE TABLE audit.configuration_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id UUID,
    user_email VARCHAR(255),
    setting_category VARCHAR(100) NOT NULL,
    setting_key VARCHAR(200) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    change_reason TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_config_history_timestamp ON audit.configuration_history (timestamp DESC);
CREATE INDEX idx_audit_config_history_user_id ON audit.configuration_history (user_id);
CREATE INDEX idx_audit_config_history_setting_key ON audit.configuration_history (setting_key);
