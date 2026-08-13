export interface ConnectionConfig {
  host: string;
  port?: number;
  database: string;
  ssl_mode?: string;
  encrypt?: boolean;
  trust_server_certificate?: boolean;
  additional_params?: Record<string, string>;
}

export interface System {
  system_id: string;
  system_name: string;
  system_role: string;
  database_type: string;
  credential_id: string | null;
}

export interface SystemDetail extends System {
  connection_config: ConnectionConfig;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  latency_ms?: number;
  server_version?: string;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  latency_ms?: number;
  server_version?: string;
}

export interface ConnectionProfile {
  max_connections: number;
  active_connections: number;
  idle_connections: number;
  avg_query_time_ms: number;
  uptime_percent: number;
}

export interface TestHistoryEntry {
  diagnostic_id: string;
  check_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  latency_ms: number | null;
  server_version: string | null;
  checked_at: string | null;
}

export interface DiagnosticResult {
  system_id: string;
  system_name: string;
  database_type: string;
  system_role: string;
  health_checks: HealthCheck[];
  overall_status: 'healthy' | 'unhealthy' | 'unknown';
}

export interface DiagnosticSummary {
  total_systems: number;
  healthy_systems: number;
  unhealthy_systems: number;
  overall_health_percent: number;
}

export interface SystemCreateRequest {
  project_id: string;
  system_name: string;
  system_role: 'SOURCE' | 'TARGET';
  database_type: string;
  connection_config: ConnectionConfig;
}

export interface UpdateSystemRequest {
  system_name?: string;
  system_role?: string;
  database_type?: string;
  connection_config?: ConnectionConfig;
}
