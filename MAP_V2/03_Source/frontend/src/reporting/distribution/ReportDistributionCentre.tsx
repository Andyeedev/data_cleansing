import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DistributionDashboard } from './DistributionDashboard';
import { DistributionQueue } from './DistributionQueue';
import { DistributionHistory } from './DistributionHistory';
import { DistributionChannels } from './DistributionChannels';
import { DistributionProfiles } from './DistributionProfiles';
import { DistributionTemplates } from './DistributionTemplates';
import { DistributionNotifications } from './DistributionNotifications';
import { DistributionAudit } from './DistributionAudit';
import { DistributionStatistics } from './DistributionStatistics';
import { DistributionSettings } from './DistributionSettings';
import { DistributionWorkspace } from './DistributionWorkspace';
import { DistributionLogs } from './DistributionLogs';
import { DistributionExplorer } from './DistributionExplorer';

type DistributionTab = 'dashboard' | 'queue' | 'history' | 'channels' | 'profiles' | 'templates' | 'notifications' | 'audit' | 'statistics' | 'settings' | 'workspace' | 'logs' | 'explorer';

const pathToTab: Record<string, DistributionTab> = {
  '/distribution': 'dashboard',
  '/distribution/': 'dashboard',
  '/distribution/explorer': 'explorer',
  '/distribution/queue': 'queue',
  '/distribution/history': 'history',
  '/distribution/channels': 'channels',
  '/distribution/profiles': 'profiles',
  '/distribution/templates': 'templates',
  '/distribution/notifications': 'notifications',
  '/distribution/audit': 'audit',
  '/distribution/logs': 'logs',
  '/distribution/statistics': 'statistics',
  '/distribution/workspace': 'workspace',
  '/distribution/settings': 'settings',
};

export const ReportDistributionCentre = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<DistributionTab>(() => {
    const tab = pathToTab[location.pathname];
    return tab || 'dashboard';
  });

  useEffect(() => {
    const tab = pathToTab[location.pathname];
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  const tabs: Array<{ id: DistributionTab; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'queue', label: 'Queue' },
    { id: 'history', label: 'History' },
    { id: 'channels', label: 'Channels' },
    { id: 'profiles', label: 'Profiles' },
    { id: 'templates', label: 'Templates' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'audit', label: 'Audit' },
    { id: 'logs', label: 'Logs' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'settings', label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DistributionDashboard />;
      case 'explorer': return <DistributionExplorer />;
      case 'queue': return <DistributionQueue />;
      case 'history': return <DistributionHistory />;
      case 'channels': return <DistributionChannels />;
      case 'profiles': return <DistributionProfiles />;
      case 'templates': return <DistributionTemplates />;
      case 'notifications': return <DistributionNotifications />;
      case 'audit': return <DistributionAudit />;
      case 'logs': return <DistributionLogs />;
      case 'statistics': return <DistributionStatistics />;
      case 'workspace': return <DistributionWorkspace />;
      case 'settings': return <DistributionSettings />;
      default: return <DistributionDashboard />;
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary, #1f2937)', margin: 0 }}>Report Distribution Centre</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', margin: '0.25rem 0 0 0' }}>Manage report delivery across enterprise channels</p>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--color-border, #e5e7eb)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? 'var(--color-primary, #2563eb)' : 'var(--color-text-secondary, #6b7280)', borderBottom: activeTab === tab.id ? '2px solid var(--color-primary, #2563eb)' : '2px solid transparent', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};
