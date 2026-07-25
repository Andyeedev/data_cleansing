export interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
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
  status: 'success' | 'failed';
  message: string;
}
