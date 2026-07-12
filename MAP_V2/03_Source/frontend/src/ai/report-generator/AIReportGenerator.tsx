import { useState } from 'react';
import { ReportGeneratorDashboard } from './ReportGeneratorDashboard';
import { ReportGeneratorExplorer } from './ReportGeneratorExplorer';
import { NarrativeGenerator } from './NarrativeGenerator';
import { DataStoryTeller } from './DataStoryTeller';
import { ChartGenerator } from './ChartGenerator';
import { SummaryGenerator } from './SummaryGenerator';
import { ExecutiveSummary } from './ExecutiveSummary';
import { TechnicalReport } from './TechnicalReport';
import { ComplianceReport } from './ComplianceReport';
import { CustomReportBuilder } from './CustomReportBuilder';
import { ReportTemplateEngine } from './ReportTemplateEngine';

type ReportGeneratorTab = 'dashboard' | 'explorer' | 'narrative' | 'storyteller' | 'chart' | 'summary' | 'executive' | 'technical' | 'compliance' | 'builder' | 'templates';

export function AIReportGenerator() {
  const [activeTab, setActiveTab] = useState<ReportGeneratorTab>('dashboard');

  const tabs: { id: ReportGeneratorTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'narrative', label: 'Narrative' },
    { id: 'storyteller', label: 'Story Teller' },
    { id: 'chart', label: 'Chart' },
    { id: 'summary', label: 'Summary' },
    { id: 'executive', label: 'Executive' },
    { id: 'technical', label: 'Technical' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'builder', label: 'Builder' },
    { id: 'templates', label: 'Templates' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ReportGeneratorDashboard />;
      case 'explorer':
        return <ReportGeneratorExplorer />;
      case 'narrative':
        return <NarrativeGenerator />;
      case 'storyteller':
        return <DataStoryTeller />;
      case 'chart':
        return <ChartGenerator />;
      case 'summary':
        return <SummaryGenerator />;
      case 'executive':
        return <ExecutiveSummary />;
      case 'technical':
        return <TechnicalReport />;
      case 'compliance':
        return <ComplianceReport />;
      case 'builder':
        return <CustomReportBuilder />;
      case 'templates':
        return <ReportTemplateEngine />;
    }
  };

  return (
    <div className="ai-report-generator" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

export default AIReportGenerator;
