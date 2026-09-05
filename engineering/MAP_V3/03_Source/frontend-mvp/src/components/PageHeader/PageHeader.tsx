import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backLink?: { path: string; label: string };
}

export function PageHeader({ title, description, actions, backLink }: PageHeaderProps) {
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {backLink && (
          <a
            href={backLink.path}
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              marginBottom: 'var(--space-sm)',
              display: 'inline-block',
            }}
          >
            ← {backLink.label}
          </a>
        )}
        <div style={titleRowStyle}>
          <div>
            <h1 style={titleStyle}>{title}</h1>
            {description && <p style={descriptionStyle}>{description}</p>}
          </div>
          {actions && <div style={actionsStyle}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  marginBottom: 'var(--space-lg)',
};

const contentStyle: React.CSSProperties = {};

const titleRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-md)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h1)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  margin: 0,
  lineHeight: 1.2,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-text-secondary)',
  marginTop: 'var(--space-xs)',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-sm)',
  flexShrink: 0,
};
