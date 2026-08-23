import { useReportSuite } from '../../hooks/useReports';
import { useBatchList } from '../../hooks/useControls';
import { useAuth } from '../../context/AuthContext';
import { TenantFilter } from '../../components/shared/TenantFilter';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import {
  ExecutiveSectionView,
  MigrationSectionView,
  ValidationSectionView,
  GovernanceSectionView,
  RiskSectionView,
  QualitySectionView,
  ReadinessSectionView,
  IssuesSectionView,
} from './reportSections';
import { useState, useCallback } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';

const SECTIONS = [
  { key: 'executive', label: 'Executive Summary', title: 'Executive Summary' },
  { key: 'migration', label: 'Migration', title: 'Migration Summary' },
  { key: 'validation', label: 'Validation', title: 'Validation Summary' },
  { key: 'governance', label: 'Governance', title: 'Governance Summary' },
  { key: 'risk', label: 'Risk', title: 'Risk Summary' },
  { key: 'quality', label: 'Quality', title: 'Data Quality Summary' },
  { key: 'readiness', label: 'Readiness', title: 'Readiness Report' },
  { key: 'issues', label: 'Issues', title: 'Issue Register' },
] as const;

const sectionRoleMap: Record<string, string[]> = {
  operational:     ['admin', 'manager'],
  migration:       ['admin', 'manager', 'operator'],
  validation:      ['admin', 'manager', 'operator'],
  governance:      ['admin', 'manager'],
  audit:           ['admin'],
  executive:       ['admin', 'manager', 'operator', 'viewer'],
  risk:            ['admin', 'manager', 'operator', 'viewer'],
  quality:         ['admin', 'manager', 'operator', 'viewer'],
  readiness:       ['admin', 'manager', 'operator', 'viewer'],
  issues:          ['admin', 'manager', 'operator', 'viewer'],
};

export function ReportSuitePage() {
  const { section } = useParams<{ section: string }>();
  const active = SECTIONS.find((s) => s.key === section) ?? SECTIONS[0];
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const { userRoles } = useAuth();

  const { data: batches } = useBatchList(selectedTenant || undefined);
  const { data: suite, loading, error, refetch } = useReportSuite(selectedTenant || undefined, selectedBatchId || undefined);

  const handleTenantChange = useCallback((tenantId: string) => {
    setSelectedTenant(tenantId);
    setSelectedBatchId('');
  }, []);

  const handleBatchChange = useCallback((batchId: string) => {
    setSelectedBatchId(batchId);
  }, []);

  if (!section || !SECTIONS.some((s) => s.key === section)) {
    return <Navigate to="/reports/suite/executive" replace />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-bold text-gray-900">MAP Nexus&#8482; &mdash; Migration Assurance Platform</div>
            <div className="text-xs text-gray-500">Board Pack &mdash; live generated report suite</div>
          </div>
          <div className="flex items-center gap-3">
            <TenantFilter selectedTenant={selectedTenant} onChange={handleTenantChange} />
            <select
              value={selectedBatchId}
              onChange={(e) => handleBatchChange(e.target.value)}
              aria-label="Select batch for report"
              className="px-2.5 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer min-w-[150px] max-w-[260px] truncate hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Latest Batch</option>
              {(batches ?? []).map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name} · {b.created_at ? b.created_at.slice(0, 16).replace('T', ' ') : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors print:hidden"
            >
              Print / PDF
            </button>
          </div>
        </div>

        <nav aria-label="Report sections" className="flex items-center flex-wrap gap-x-1 gap-y-2 pb-3 mb-6 border-b border-gray-200 overflow-x-auto">
          {SECTIONS.map((s, i) => {
            const allowedRoles = sectionRoleMap[s.key];
            const show = allowedRoles?.includes(userRoles[0] ?? 'viewer') ?? true;
            return (
              <span key={s.key} className="flex items-center">
                {i > 0 && <span className="text-gray-300 mx-2 select-none" aria-hidden="true">/</span>}
                {show ? (
                  <NavLink
                    to={`/reports/suite/${s.key}`}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-blue-50 border border-blue-500 text-blue-700 ring-1 ring-blue-300 font-semibold'
                          : 'border border-transparent text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    {s.label}
                  </NavLink>
                ) : (
                  <span className="text-gray-400 ps-2">{s.label}</span>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-red-600 underline hover:text-red-800">Retry</button>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : !suite || !suite.has_data ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
          <p className="text-sm text-gray-500">{suite?.message ?? 'No report data available.'}</p>
        </div>
      ) : (
        <>
          <header className="mb-6">
            <div className="bg-blue-600 rounded-t-lg px-5 py-3">
              <h1 className="text-sm font-bold text-white tracking-wide">MAP Nexus&#8482; &mdash; Migration Assurance Platform</h1>
            </div>
            <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg px-5 py-3">
              <h2 className="text-xl font-bold text-gray-900">{active.title}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {suite.batch?.batch_name}
                {suite.batch?.created_at ? ` · ${suite.batch.created_at.slice(0, 16).replace('T', ' ')}` : ''}
                {' '}· Generated {suite.generated_at.replace('T', ' ')}
              </p>
            </div>
          </header>

          {active.key === 'executive' && suite.executive && <ExecutiveSectionView s={suite.executive} />}
          {active.key === 'migration' && suite.migration && <MigrationSectionView s={suite.migration} />}
          {active.key === 'validation' && suite.validation && <ValidationSectionView s={suite.validation} />}
          {active.key === 'governance' && suite.governance && <GovernanceSectionView s={suite.governance} />}
          {active.key === 'risk' && suite.risk && <RiskSectionView s={suite.risk} />}
          {active.key === 'quality' && suite.quality && <QualitySectionView s={suite.quality} />}
          {active.key === 'readiness' && suite.readiness && <ReadinessSectionView s={suite.readiness} />}
          {active.key === 'issues' && suite.issues && <IssuesSectionView s={suite.issues} />}

          <footer className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400">
            MAP Nexus&#8482; &mdash; Migration Assurance Platform · Board Pack generated from live validation data
          </footer>
        </>
      )}
    </div>
  );
}

export default ReportSuitePage;
