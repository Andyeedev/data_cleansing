import { useState } from 'react';
import { RecommendationDashboard } from './RecommendationDashboard';
import { RecommendationExplorer } from './RecommendationExplorer';
import { MigrationRecommendations } from './MigrationRecommendations';
import { OptimizationRecommendations } from './OptimizationRecommendations';
import { GovernanceRecommendations } from './GovernanceRecommendations';
import { SecurityRecommendations } from './SecurityRecommendations';
import { RiskRecommendations } from './RiskRecommendations';
import { WorkflowRecommendations } from './WorkflowRecommendations';
import { ResourceRecommendations } from './ResourceRecommendations';
import { RecommendationGenerator } from './RecommendationGenerator';
import { RecommendationPrioritiser } from './RecommendationPrioritiser';
import { RecommendationDelivery } from './RecommendationDelivery';

type RecommendationTab = 'dashboard' | 'explorer' | 'migration' | 'optimization' | 'governance' | 'security' | 'risk' | 'workflow' | 'resource' | 'generator' | 'prioritiser' | 'delivery';

export function AIRecommendations() {
  const [activeTab, setActiveTab] = useState<RecommendationTab>('dashboard');

  const tabs: { id: RecommendationTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'migration', label: 'Migration' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'governance', label: 'Governance' },
    { id: 'security', label: 'Security' },
    { id: 'risk', label: 'Risk' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'resource', label: 'Resource' },
    { id: 'generator', label: 'Generator' },
    { id: 'prioritiser', label: 'Prioritiser' },
    { id: 'delivery', label: 'Delivery' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <RecommendationDashboard />;
      case 'explorer':
        return <RecommendationExplorer />;
      case 'migration':
        return <MigrationRecommendations />;
      case 'optimization':
        return <OptimizationRecommendations />;
      case 'governance':
        return <GovernanceRecommendations />;
      case 'security':
        return <SecurityRecommendations />;
      case 'risk':
        return <RiskRecommendations />;
      case 'workflow':
        return <WorkflowRecommendations />;
      case 'resource':
        return <ResourceRecommendations />;
      case 'generator':
        return <RecommendationGenerator />;
      case 'prioritiser':
        return <RecommendationPrioritiser />;
      case 'delivery':
        return <RecommendationDelivery />;
    }
  };

  return (
    <div className="ai-recommendations" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', padding: '0 16px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AIRecommendations;
