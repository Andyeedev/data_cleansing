import { useState, lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { PageHeader } from '../components/PageHeader/PageHeader';
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
  const { tenantId } = useValidationFilter();
  const [activeTab, setActiveTab] = useState('mappings');

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Rules</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Validation Rules"
        description="Rule definitions, dataset mappings, and execution usage"
        actions={<CascadeDropdowns showBatch={false} />}
      />

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'mappings' && <RuleMappingsUsageTab selectedTenant={tenantId || ''} />}
        {activeTab === 'definitions' && <RuleDefinitionsTab />}
        {activeTab === 'dependencies' && (
          <Suspense fallback={<LoadingSkeleton rows={4} variant="card" />}>
            <ControlDependenciesPage />
          </Suspense>
        )}
      </div>
    </div>
  );
}
