export type InsightPriority = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface InsightPriorityConfig {
  id: InsightPriority;
  label: string;
  color: string;
  bgColor: string;
  count: number;
}

export const INSIGHT_PRIORITIES: InsightPriorityConfig[] = [
  { id: 'critical', label: 'Critical', color: '#ef4444', bgColor: '#fef2f2', count: 3 },
  { id: 'high', label: 'High', color: '#f59e0b', bgColor: '#fffbeb', count: 8 },
  { id: 'medium', label: 'Medium', color: '#3b82f6', bgColor: '#eff6ff', count: 15 },
  { id: 'low', label: 'Low', color: '#22c55e', bgColor: '#f0fdf4', count: 22 },
  { id: 'informational', label: 'Informational', color: '#6b7280', bgColor: '#f9fafb', count: 31 }
];

export interface InsightPrioritiserProps {
  selectedPriority?: InsightPriority | null;
  onPrioritySelect?: (priority: InsightPriority) => void;
}

export const InsightPrioritiser: React.FC<InsightPrioritiserProps> = ({
  selectedPriority,
  onPrioritySelect
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {INSIGHT_PRIORITIES.map((pri) => (
        <button
          key={pri.id}
          onClick={() => onPrioritySelect?.(pri.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: selectedPriority === pri.id ? pri.color : pri.bgColor,
            color: selectedPriority === pri.id ? 'white' : pri.color,
            border: `1px solid ${pri.color}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          {pri.label}
          <span style={{
            padding: '1px 6px',
            backgroundColor: selectedPriority === pri.id ? 'rgba(255,255,255,0.2)' : pri.bgColor,
            borderRadius: '10px',
            fontSize: '10px',
            color: selectedPriority === pri.id ? 'white' : pri.color
          }}>
            {pri.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default InsightPrioritiser;
