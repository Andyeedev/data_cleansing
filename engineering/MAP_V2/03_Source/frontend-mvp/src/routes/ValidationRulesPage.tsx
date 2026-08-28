import { useState, lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { ErrorState } from '../components/shared/ErrorState';
import { TabBar } from '../components/shared/TabBar';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { RuleMappingsUsageTab } from './RuleMappingsUsageTab';
import { RuleDefinitionsTab } from './RuleDefinitionsTab';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';

const ControlDependenciesPage = lazy(() => import('./ControlDependenciesPage').then(m => ({ default: m.ControlDependenciesPage })));

const TABS = [
  { key: 'mappings', label: 'Rule Mappings & Usage' },
  { key: 'definitions', label: 'Rule Definitions' },
  { key: 'dependencies', label: 'Control Dependencies' },
];

export function ValidationRulesPage() {
  const { userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState('mappings');

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Validation Rules</h1>
        </div>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validation Rules</h1>
          <p className="text-sm text-gray-500 mt-1">Rule definitions, dataset mappings, and execution usage</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CascadeDropdowns showBatch={false} />
        </div>
      </div>

      {/* ========== TAB BAR ========== */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ========== TAB PANEL ========== */}
      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'mappings' && <RuleMappingsUsageTab />}
        {activeTab === 'definitions' && <RuleDefinitionsTab />}
        {activeTab === 'dependencies' && (
          <Suspense fallback={<LoadingSkeleton rows={4} variant="card" />}>
            <ControlDependenciesPage />
          </Suspense>
        )}
      </div>
    </PageContainer>
  );
}
