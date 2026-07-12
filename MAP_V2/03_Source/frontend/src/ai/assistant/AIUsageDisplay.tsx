import { useAI } from '../hooks/useAI';

export const AIUsageDisplay: React.FC = () => {
  const { lastResponse, quotaStatus } = useAI();

  const sessionTokens = lastResponse?.usage?.totalTokens ?? 0;
  const sessionCost = lastResponse?.usage?.estimatedCost ?? 0;

  if (sessionTokens === 0 && !quotaStatus) return null;

  return (
    <div style={{
      padding: '8px 16px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#9ca3af'
    }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        {sessionTokens > 0 && (
          <span>
            Session: {sessionTokens.toLocaleString()} tokens
          </span>
        )}
        {sessionCost > 0 && (
          <span>
            Cost: ${sessionCost.toFixed(4)}
          </span>
        )}
      </div>
      {quotaStatus && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <span>
            {quotaStatus.usage.requestsLastMinute}/{quotaStatus.limits.requestsPerMinute} req/min
          </span>
          <span>
            ${quotaStatus.usage.costToday.toFixed(2)}/day
          </span>
        </div>
      )}
    </div>
  );
};

export default AIUsageDisplay;
