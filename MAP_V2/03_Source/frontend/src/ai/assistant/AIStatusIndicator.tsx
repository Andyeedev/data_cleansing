import { useAI } from '../hooks/useAI';

export interface AIStatusIndicatorProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  showLabel = true,
  size = 'medium'
}) => {
  const { isLoading, error, quotaStatus } = useAI();

  const getStatusColor = (): string => {
    if (error) return '#ef4444';
    if (isLoading) return '#f59e0b';
    if (quotaStatus && !quotaStatus.withinLimits) return '#ef4444';
    return '#22c55e';
  };

  const getStatusText = (): string => {
    if (error) return 'Error';
    if (isLoading) return 'Processing';
    if (quotaStatus && !quotaStatus.withinLimits) return 'Quota Exceeded';
    return 'Ready';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { dot: 6, text: '10px', gap: 4 };
      case 'large':
        return { dot: 12, text: '14px', gap: 8 };
      default:
        return { dot: 8, text: '12px', gap: 6 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: `${sizeStyles.gap}px`
    }}>
      <div
        style={{
          width: `${sizeStyles.dot}px`,
          height: `${sizeStyles.dot}px`,
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          animation: isLoading ? 'pulse 1.5s infinite' : 'none'
        }}
      />
      {showLabel && (
        <span style={{
          fontSize: sizeStyles.text,
          color: '#6b7280',
          fontWeight: 500
        }}>
          AI: {getStatusText()}
        </span>
      )}
    </div>
  );
};

export default AIStatusIndicator;
