import { useAIContext } from '../framework/AIContext';
import { useAI } from '../hooks/useAI';

export const AIContextPanel: React.FC = () => {
  const context = useAIContext();
  const { quotaStatus } = useAI();

  const contextItems = [
    { label: 'User', value: context.user?.name ?? 'Not authenticated', icon: '👤' },
    { label: 'Email', value: context.user?.email ?? 'N/A', icon: '📧' },
    { label: 'Role', value: context.user?.role ?? 'N/A', icon: '🔑' },
    { label: 'Tenant', value: context.tenantId ?? 'Default', icon: '🏢' },
    { label: 'Portal', value: context.portal ?? 'None', icon: '🌐' },
    { label: 'Report', value: context.report ?? 'None', icon: '📊' },
    { label: 'Dataset', value: context.dataset ?? 'None', icon: '💾' },
    { label: 'Session', value: context.sessionId.slice(0, 16) + '...', icon: '🔗' },
    { label: 'Active Module', value: context.activeModule ?? 'copilot', icon: '🤖' },
    { label: 'Permissions', value: `${context.permissions.length} granted`, icon: '🛡️' }
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>
        Current Context
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {contextItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #f3f4f6'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{item.icon}</span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quota Status */}
      {quotaStatus && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>
            Usage Quota
          </h4>
          <div style={{
            padding: '12px',
            backgroundColor: quotaStatus.withinLimits ? '#f0fdf4' : '#fef2f2',
            borderRadius: '6px',
            border: `1px solid ${quotaStatus.withinLimits ? '#bbf7d0' : '#fecaca'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Status</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: quotaStatus.withinLimits ? '#16a34a' : '#dc2626'
              }}>
                {quotaStatus.withinLimits ? 'Within Limits' : 'Exceeded'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Requests/min</span>
              <span style={{ fontSize: '12px', color: '#374151' }}>
                {quotaStatus.usage.requestsLastMinute}/{quotaStatus.limits.requestsPerMinute}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Tokens today</span>
              <span style={{ fontSize: '12px', color: '#374151' }}>
                {quotaStatus.usage.tokensLastDay.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Cost today</span>
              <span style={{ fontSize: '12px', color: '#374151' }}>
                ${quotaStatus.usage.costToday.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preferences */}
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>
          Preferences
        </h4>
        <div style={{
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #f3f4f6'
        }}>
          {Object.keys(context.preferences).length === 0 ? (
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
              No preferences set
            </p>
          ) : (
            Object.entries(context.preferences).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{key}</span>
                <span style={{ fontSize: '12px', color: '#374151' }}>{String(value)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContextPanel;
