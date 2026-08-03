import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer/PageContainer';

export function AccessDeniedPage() {
  return (
    <PageContainer maxWidth="var(--container-md)">
      <div style={containerStyle}>
        <div style={iconStyle}>🔒</div>
        <h1 style={titleStyle}>Access Denied</h1>
        <p style={messageStyle}>
          You do not have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        <div style={actionsStyle}>
          <Link to="/" style={buttonStyle}>
            Go to Dashboard
          </Link>
          <Link to="/login" style={linkStyle}>
            Sign in with different account
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '80px',
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

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
  alignItems: 'center',
};

const buttonStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-lg)',
  background: 'var(--color-primary)',
  color: 'white',
  borderRadius: 'var(--radius)',
  fontWeight: 'var(--font-weight-semibold)',
  textDecoration: 'none',
};

const linkStyle: React.CSSProperties = {
  color: 'var(--color-primary)',
  fontSize: 'var(--font-size-sm)',
  textDecoration: 'none',
};
