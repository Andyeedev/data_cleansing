export type InsightCategory = 'executive' | 'operations' | 'migration' | 'governance' | 'security' | 'audit' | 'validation' | 'financial';

export interface InsightCategoryConfig {
  id: InsightCategory;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export const INSIGHT_CATEGORIES: InsightCategoryConfig[] = [
  { id: 'executive', label: 'Executive', icon: '👔', color: '#3b82f6', count: 24 },
  { id: 'operations', label: 'Operations', icon: '⚙️', color: '#8b5cf6', count: 31 },
  { id: 'migration', label: 'Migration', icon: '🔄', color: '#22c55e', count: 45 },
  { id: 'governance', label: 'Governance', icon: '📋', color: '#f59e0b', count: 18 },
  { id: 'security', label: 'Security', icon: '🔒', color: '#ef4444', count: 12 },
  { id: 'audit', label: 'Audit', icon: '📝', color: '#6b7280', count: 28 },
  { id: 'validation', label: 'Validation', icon: '✅', color: '#06b6d4', count: 52 },
  { id: 'financial', label: 'Financial', icon: '💰', color: '#10b981', count: 15 }
];

export interface InsightCategoriserProps {
  selectedCategory?: InsightCategory | null;
  onCategorySelect?: (category: InsightCategory) => void;
}

export const InsightCategoriser: React.FC<InsightCategoriserProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {INSIGHT_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategorySelect?.(cat.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: selectedCategory === cat.id ? cat.color : '#ffffff',
            color: selectedCategory === cat.id ? 'white' : '#374151',
            border: `1px solid ${selectedCategory === cat.id ? cat.color : '#e5e7eb'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          <span>{cat.icon}</span>
          {cat.label}
          <span style={{
            padding: '1px 6px',
            backgroundColor: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
            borderRadius: '10px',
            fontSize: '10px'
          }}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default InsightCategoriser;
