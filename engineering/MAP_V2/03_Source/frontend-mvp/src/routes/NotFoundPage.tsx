import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h1 style={{ fontSize: '48px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Page not found.</p>
      <Link to="/" style={{ color: 'var(--color-primary)' }}>Return to Dashboard</Link>
    </div>
  );
}
