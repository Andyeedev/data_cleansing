import { Link } from 'react-router-dom';
import { Lock, Shield, Mail, Phone } from 'lucide-react';
import { PageContainer } from '../components/PageContainer/PageContainer';

export function BlockedTenantPage() {
  return (
    <PageContainer maxWidth="var(--container-md)">
      <div style={containerStyle}>
        <div style={iconStyle}>
          <Lock className="w-16 h-16 text-red-500" />
        </div>
        <h1 style={titleStyle}>Tenant Blocked</h1>
        <p style={messageStyle}>
          Your tenant account has been blocked due to a security policy violation or compliance issue.
        </p>

        <div style={detailsStyle}>
          <h3 style={subtitleStyle}>What this means:</h3>
          <ul style={listStyle}>
            <li>Your tenant account has been blocked for security/compliance reasons</li>
            <li>All access to the platform is permanently denied</li>
            <li>All tenant users are permanently blocked from the system</li>
            <li>No API access or integrations will function</li>
          </ul>
        </div>

        <div style={detailsStyle}>
          <h3 style={subtitleStyle}>Next steps:</h3>
          <ul style={listStyle}>
            <li>Contact MAP Nexus security team immediately</li>
            <li>Request a security review of your tenant account</li>
            <li>Provide any requested compliance documentation</li>
            <li>Await formal review outcome from the security team</li>
          </ul>
        </div>

        <div style={contactStyle}>
          <h3 style={subtitleStyle}>Need help?</h3>
          <div style={contactItemStyle}>
            <Shield className="w-5 h-5" />
            <span>security@mapnexus.co.uk</span>
          </div>
          <div style={contactItemStyle}>
            <span className="w-5 h-5">📞</span>
            <span>+44 (0) 20 7XXX XXXX (Security Team)</span>
          </div>
        </div>

        <div style={actionsStyle}>
          <Link to="/login" style={buttonStyle}>
            <span className="w-4 h-4">🔒</span>
            Back to Login
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '80px',
  maxWidth: '480px',
  margin: '0 auto',
};

const iconStyle: React.CSSProperties = {
  fontSize: '64px',
  marginBottom: 'var(--space-lg)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h1)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-md)',
};

const messageStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  color: 'var(--color-text-secondary)',
  maxWidth: '400px',
  margin: '0 auto',
  lineHeight: 1.6,
  marginBottom: 'var(--space-xl)',
};

const detailsStyle: React.CSSProperties = {
  textAlign: 'left',
  marginBottom: 'var(--space-xl)',
  padding: 'var(--space-lg)',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-sm)',
};

const listStyle: React.CSSProperties = {
  paddingLeft: 'var(--space-lg)',
  lineHeight: 1.8,
  color: 'var(--color-text-secondary)',
};

const contactStyle: React.CSSProperties = {
  marginTop: 'var(--space-xl)',
  paddingTop: 'var(--space-lg)',
  borderTop: '1px solid var(--color-border)',
};

const contactItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-sm)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-xs)',
};

const actionsStyle: React.CSSProperties = {
  marginTop: 'var(--space-xl)',
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-lg)',
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  borderRadius: 'var(--radius)',
  fontWeight: 'var(--font-weight-semibold)',
  textDecoration: 'none',
  fontSize: 'var(--font-size-sm)',
};