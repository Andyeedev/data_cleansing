export interface SecurityCredential {
  id: string;
  name: string;
  type: 'password' | 'api-key' | 'certificate' | 'token' | 'secret';
  status: 'active' | 'expired' | 'rotated' | 'revoked';
  lastRotated: string;
  expiresAt: string;
  owner: string;
}

export interface SecurityCertificate {
  id: string;
  name: string;
  issuer: string;
  status: 'valid' | 'expiring' | 'expired' | 'revoked';
  issuedAt: string;
  expiresAt: string;
  algorithm: string;
}

export interface SecurityKey {
  id: string;
  name: string;
  type: 'RSA' | 'AES' | 'ECDSA' | 'HMAC';
  status: 'active' | 'rotated' | 'expired' | 'disabled';
  createdAt: string;
  expiresAt: string;
  vault: string;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed-login' | 'password-change' | 'mfa-setup' | 'permission-change' | 'api-call';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  timestamp: string;
  description: string;
  ipAddress: string;
}

export interface SecurityMetrics {
  securityHealthScore: number;
  activeSessions: number;
  failedLogins: number;
  mfaAdoption: number;
  credentialStatus: number;
  certificateStatus: number;
  encryptionStatus: number;
  complianceStatus: number;
  threatSummary: string;
  healthTrend: number[];
  threatTrend: number[];
  eventTrend: number[];
}
