import { useState } from 'react';

interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap' | 'treemap' | 'funnel';
  title: string;
  data: { label: string; value: number }[];
}

const DEMO_CHARTS: ChartConfig[] = [
  {
    id: 'chart-001',
    type: 'bar',
    title: 'Migration Progress by Table',
    data: [
      { label: 'Users', value: 95 },
      { label: 'Orders', value: 88 },
      { label: 'Products', value: 92 },
      { label: 'Transactions', value: 78 },
      { label: 'Logs', value: 65 },
    ],
  },
  {
    id: 'chart-002',
    type: 'line',
    title: 'Daily Migration Volume',
    data: [
      { label: 'Mon', value: 12000 },
      { label: 'Tue', value: 15000 },
      { label: 'Wed', value: 18000 },
      { label: 'Thu', value: 16000 },
      { label: 'Fri', value: 20000 },
    ],
  },
  {
    id: 'chart-003',
    type: 'pie',
    title: 'Record Status Distribution',
    data: [
      { label: 'Completed', value: 75 },
      { label: 'In Progress', value: 15 },
      { label: 'Pending', value: 7 },
      { label: 'Failed', value: 3 },
    ],
  },
];

const CHART_TYPES = ['bar', 'line', 'pie', 'scatter', 'heatmap', 'treemap', 'funnel'] as const;

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4', '#6366f1'];

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '16px 0' }}>
      {data.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{item.value}</span>
          <div style={{
            width: '100%',
            height: `${(item.value / max) * 150}px`,
            background: CHART_COLORS[i % CHART_COLORS.length],
            borderRadius: '4px 4px 0 0',
          }} />
          <span style={{ fontSize: '11px', color: '#64748b' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ position: 'relative', height: '200px', padding: '16px 0' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${data.length * 60} 200`}>
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          points={data.map((d, i) => `${i * 60 + 30},${200 - (d.value / max) * 180}`).join(' ')}
        />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={i * 60 + 30} cy={200 - (d.value / max) * 180} r="5" fill="#3b82f6" />
            <text x={i * 60 + 30} y="195" textAnchor="middle" fontSize="11" fill="#64748b">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px' }}>
      <svg width="150" height="150" viewBox="0 0 100 100">
        {data.map((item, i) => {
          const start = cumulative;
          cumulative += (item.value / total) * 100;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth="20"
              strokeDasharray={`${item.value / total * 251.2} 251.2`}
              strokeDashoffset={`${-start / total * 251.2}`}
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ fontSize: '12px', color: '#475569' }}>{item.label}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartGenerator() {
  const [charts] = useState<ChartConfig[]>(DEMO_CHARTS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? charts
    : charts.filter(c => c.type === typeFilter);

  const renderChart = (chart: ChartConfig) => {
    switch (chart.type) {
      case 'bar':
        return <BarChart data={chart.data} />;
      case 'line':
        return <LineChart data={chart.data} />;
      case 'pie':
        return <PieChart data={chart.data} />;
      default:
        return <BarChart data={chart.data} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Chart Generator</h2>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTypeFilter('all')}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: typeFilter === 'all' ? '#3b82f6' : '#fff',
            color: typeFilter === 'all' ? '#fff' : '#64748b',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          All
        </button>
        {CHART_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: typeFilter === type ? '#3b82f6' : '#fff',
              color: typeFilter === type ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {filtered.map(chart => (
          <div key={chart.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{chart.title}</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                background: '#f1f5f9',
                color: '#64748b',
                textTransform: 'capitalize',
              }}>
                {chart.type}
              </span>
            </div>
            {renderChart(chart)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChartGenerator;
