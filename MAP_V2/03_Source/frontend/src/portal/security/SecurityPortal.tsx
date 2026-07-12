import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { SecurityOverview } from './SecurityOverview';
import { CredentialManagement } from './CredentialManagement';
import { EncryptionManagement } from './EncryptionManagement';
import { KeyManagement } from './KeyManagement';
import { CertificateManagement } from './CertificateManagement';
import { IdentityProviders } from './IdentityProviders';
import { AuthenticationPolicies } from './AuthenticationPolicies';
import { MultiFactorAuthentication } from './MultiFactorAuthentication';
import { SessionManagement } from './SessionManagement';
import { ApiSecurity } from './ApiSecurity';
import { AuditLogs } from './AuditLogs';
import { SecurityEvents } from './SecurityEvents';
import { ThreatMonitoring } from './ThreatMonitoring';
import { ComplianceStatus } from './ComplianceStatus';
import { SecurityDashboard } from './SecurityDashboard';

const routeComponents: Record<string, React.ComponentType> = {
  '/security': SecurityOverview,
  '/security/overview': SecurityOverview,
  '/security/credentials': CredentialManagement,
  '/security/encryption': EncryptionManagement,
  '/security/keys': KeyManagement,
  '/security/certificates': CertificateManagement,
  '/security/identity-providers': IdentityProviders,
  '/security/authentication': AuthenticationPolicies,
  '/security/mfa': MultiFactorAuthentication,
  '/security/sessions': SessionManagement,
  '/security/api-security': ApiSecurity,
  '/security/audit-logs': AuditLogs,
  '/security/security-events': SecurityEvents,
  '/security/threat-monitoring': ThreatMonitoring,
  '/security/compliance': ComplianceStatus,
  '/security/dashboard': SecurityDashboard,
};

export const SecurityPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('security');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Security Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || SecurityOverview;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
