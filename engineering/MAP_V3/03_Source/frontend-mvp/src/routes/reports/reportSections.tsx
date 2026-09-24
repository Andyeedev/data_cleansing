import type { ReportSuite } from '../../types/reportSuite';
import { KpiBox, ReportCard, StatusPill, BarList, ScoreBar, EmptyState, LineChart } from '../../components/reports/reportWidgets';

type Suite = ReportSuite;

export function ExecutiveSectionView({ s }: { s: NonNullable<Suite['executive']> }) {
  const cs = s.controls_summary;
  const issueCount = s.validation_findings ?? 0;
  const critCount = s.critical_issues ?? 0;
  const recText = s.executive_recommendation ?? '';
  const findings = s.findings_detail ?? [];
  const scenario = s.scenario;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiBox label="Total Controls" value={cs.total} tone="info" />
        <KpiBox label="Passed" value={cs.passed} tone="success" />
        <KpiBox label="Failed" value={cs.failed} tone={cs.failed > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Error" value={cs.error} tone={cs.error > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Blocked" value={cs.blocked} tone={cs.blocked > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Readiness" value={`${s.readiness_pct}%`} tone={s.readiness_pct >= 80 ? 'success' : 'warning'} />
      </div>
      <ReportCard title="Migration Readiness" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiBox label="Readiness Score" value={`${s.readiness_pct}%`} tone={s.readiness_pct >= 80 ? 'success' : 'warning'} />
          <KpiBox label="Validation Score" value={`${s.validation_score}%`} tone={s.validation_score >= 80 ? 'success' : 'warning'} />
          <KpiBox label="Validation Findings" value={issueCount} tone={issueCount > 0 ? 'error' : 'success'} />
          <KpiBox label="Critical Issues" value={critCount} tone={critCount > 0 ? 'error' : 'success'} />
        </div>
      </ReportCard>
      <ReportCard title="Executive Recommendation" className="mb-6">
        <p className="text-sm text-gray-800 leading-relaxed mb-3">{recText}</p>
        {findings.length > 0 && (
          <ul className="list-disc ml-5 space-y-1">
            {findings.map((f, i) => (
              <li key={i} className="text-sm text-gray-700">{f}</li>
            ))}
          </ul>
        )}
      </ReportCard>
      <ReportCard title="Recommendation" className="mb-6">
        <p className="text-sm text-gray-800 leading-relaxed">{s.recommendation}</p>
      </ReportCard>
      <ReportCard title="Next Steps" className="mb-6">
        <ul className="space-y-2">
          {s.next_steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </ReportCard>
      <ReportCard title="Scenario Details">
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Scenario', (scenario?.name as string) ?? 'N/A'],
              ['Industry', (scenario?.industry as string) ?? 'Financial Services'],
              ['Source Platform', (scenario?.source_platform as string) ?? 'N/A'],
              ['Target Platform', (scenario?.target_platform as string) ?? 'N/A'],
              ['Source Columns', String((scenario?.source_columns as number) ?? 0)],
              ['Target Columns', String((scenario?.target_columns as number) ?? 0)],
              ['Entities Mapped', String((scenario?.entities_mapped as number) ?? 0)],
              ['Execution Duration', (scenario?.duration_seconds as number) ? `${scenario.duration_seconds} seconds` : 'N/A'],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-gray-100">
                <td className="px-3 py-2.5 font-medium text-gray-900 w-[200px]">{label}</td>
                <td className="px-3 py-2.5 text-gray-700">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportCard>
    </>
  );
}

export function MigrationSectionView({ s }: { s: NonNullable<Suite['migration']> }) {
  const em = s.entity_mapping;
  const po = s.platform_overview;
  const dqObs = s.data_quality_observations ?? '';
  return (
    <>
      <ReportCard title="Platform Overview" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiBox label="Source Platform" value={po?.source_platform ?? 'Legacy System'} tone="info" />
          <KpiBox label="Target Platform" value={po?.target_platform ?? 'MAPNEXUS Target'} tone="info" />
          <KpiBox label="Source Columns" value={po?.source_columns ?? 0} tone="info" />
          <KpiBox label="Target Columns" value={po?.target_columns ?? 0} tone="info" />
          <KpiBox label="Entities Mapped" value={po?.entities_mapped ?? em.total} tone="info" />
          <KpiBox label="Projects" value={s.platform.projects} tone="info" />
        </div>
      </ReportCard>
      <ReportCard title="Entity Mapping" subtitle={`${em.total} entities mapped`} className="mb-6">
        {em.entities.length === 0 ? (
          <EmptyState message="No entity mappings available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Source Entity', 'Target Entity', 'Source Records', 'Target Records', 'Match %', 'Status'].map((h, i) => (
                    <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i >= 2 && i <= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {em.entities.map((e, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{e.source}</td>
                    <td className="px-3 py-2.5 text-gray-700">{e.target}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.source_columns}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.target_columns}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.match_pct}</td>
                    <td className="px-3 py-2.5"><StatusPill status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Data Quality Observations">
        <p className="text-sm text-gray-800 leading-relaxed">{dqObs || 'No data quality observations available.'}</p>
      </ReportCard>
    </>
  );
}

export function ValidationSectionView({ s }: { s: NonNullable<Suite['validation']> }) {
  const dist = s.distribution;
  const analysis = s.analysis ?? '';
  const hasCriticalFinding = analysis.toLowerCase().includes('critical finding');
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {Object.entries(dist).map(([label, value]) => (
          <KpiBox key={label} label={label} value={value} tone={label === 'Passed' ? 'success' : label === 'Failed' ? 'error' : 'neutral'} />
        ))}
      </div>
      <ReportCard title="Control Outcomes" subtitle={`${s.controls.length} controls executed`} className="mb-6">
        {s.controls.length === 0 ? (
          <EmptyState message="No control outcomes for this batch." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Control', 'Name', 'Severity', 'Status', 'Total', 'Passed', 'Failed', 'Error', 'Skipped'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.controls.map((c) => (
                  <tr key={c.control_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.control_id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.control_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={c.severity} /></td>
                    <td className="px-3 py-2.5"><StatusPill status={c.status} /></td>
                    <td className="px-3 py-2.5 tabular-nums">{c.total_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-green-700">{c.passed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-red-700">{c.failed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-orange-700">{c.error_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-gray-500">{c.skipped_rules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Analysis">
        {hasCriticalFinding && (
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-4">
            <div className="text-sm font-bold text-red-700 mb-1">CRITICAL FINDING</div>
            <p className="text-sm text-red-800">{analysis.split('CRITICAL FINDING: ')[1]?.split('.')[0] ?? 'Critical issues detected.'}</p>
          </div>
        )}
        <p className="text-sm text-gray-800 leading-relaxed">{analysis}</p>
      </ReportCard>
    </>
  );
}

export function GovernanceSectionView({ s }: { s: NonNullable<Suite['governance']> }) {
  const ov = s.overview;
  
  // Group findings by control + type to avoid duplicates
  const groupedFindings = Object.values(
    s.findings.reduce((acc, f) => {
      const key = `${f.control_id}|${f.type}`;
      if (!acc[key]) {
        acc[key] = {
          control_id: f.control_id,
          control_name: f.control_id, // Will be replaced with proper name if available
          type: f.type,
          description: f.description,
          severity: f.severity,
          owner: f.owner,
          status: f.status,
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, any>)
  ).sort((a, b) => {
    const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (sevOrder[a.severity as keyof typeof sevOrder] ?? 99) - (sevOrder[b.severity as keyof typeof sevOrder] ?? 99);
  });

  // Map control_id to readable names
  const controlNames: Record<string, string> = {
    'C01': 'Row Count Reconciliation',
    'C02': 'Financial Value Integrity & Reconciliation',
    'C03': 'Referential Integrity',
    'C04': 'Column Count Validation',
    'C05': 'Data Type Consistency',
    'C06': 'Nullability Validation',
    'C07': 'Duplicate Detection',
    'C08': 'Schema Drift Detection',
    'C09': 'Referential Coverage',
    'C010': 'Schema Comparison',
  };
  
  groupedFindings.forEach(f => {
    f.control_name = controlNames[f.control_id] || f.control_id;
  });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KpiBox label="Total Findings" value={ov.total_findings} tone="info" />
        <KpiBox label="Open" value={ov.open} tone={ov.open > 0 ? 'error' : 'success'} />
        <KpiBox label="Critical" value={ov.critical} tone={ov.critical > 0 ? 'error' : 'neutral'} />
        <KpiBox label="High" value={ov.high} tone={ov.high > 0 ? 'warning' : 'neutral'} />
        <KpiBox label="Medium" value={ov.medium} tone={ov.medium > 0 ? 'info' : 'neutral'} />
      </div>
      <ReportCard title="Findings (Grouped by Control & Type)" subtitle={`${groupedFindings.length} unique groups from ${s.total} findings`} className="mb-6">
        {groupedFindings.length === 0 ? (
          <EmptyState message="No findings recorded for this batch. Select an earlier batch with exceptions to review its findings." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Control Name', 'Type', 'Description', 'Severity', 'Count', 'Owner', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedFindings.map((f) => (
                  <tr key={`${f.control_id}|${f.type}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 font-medium text-gray-900">{f.control_name || f.control_id}</td>
                    <td className="px-3 py-2 text-gray-700 max-w-[220px] truncate" title={f.type}>{f.type}</td>
                    <td className="px-3 py-2 text-gray-700" title={f.description}>{f.description}</td>
                    <td className="px-3 py-2"><StatusPill status={f.severity} /></td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold">{f.count}</td>
                    <td className="px-3 py-2 text-gray-700">{f.owner}</td>
                    <td className="px-3 py-2"><StatusPill status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard title="Findings by Type">
          <BarList items={s.by_type.slice(0, 8)} colorClass="bg-blue-600" />
        </ReportCard>
        <ReportCard title="Ownership Distribution">
          {s.by_owner.length === 0 ? (
            <EmptyState message="No findings to allocate." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Owner', 'Findings', 'Critical', 'High', 'Medium'].map((h, i) => (
                    <th key={h} className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.by_owner.map((o) => (
                  <tr key={o.owner} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-800">{o.owner}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-gray-900">{o.total}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-red-700">{o.critical}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-yellow-700">{o.high}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-blue-700">{o.medium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ReportCard>
      </div>
    </>
  );
}

export function RiskSectionView({ s }: { s: NonNullable<Suite['risk']> }) {
  const isGo = s.decision === 'GO';
  const ov = s.overview;
  return (
    <>
      <ReportCard title="Go / No-Go Decision" className="mb-6">
        <div className={`rounded-lg border-2 p-5 ${isGo ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
          <div className={`text-xl font-extrabold tracking-tight mb-1 ${isGo ? 'text-green-700' : 'text-red-700'}`}>{s.decision}</div>
          <p className="text-sm text-gray-800">{s.reason}</p>
          <p className="text-xs text-gray-500 mt-2">Overall risk level: <span className="font-semibold text-gray-700">{s.level}</span>{s.score !== null && <> · Rule pass rate <span className="font-semibold text-gray-700">{s.score}%</span></>}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <KpiBox label="Total Risks" value={ov.total_risks} tone={ov.total_risks > 0 ? 'error' : 'success'} />
          <KpiBox label="Critical" value={ov.critical} tone={ov.critical > 0 ? 'error' : 'neutral'} />
          <KpiBox label="High" value={ov.high} tone={ov.high > 0 ? 'warning' : 'neutral'} />
          <KpiBox label="Medium" value={ov.medium} tone={ov.medium > 0 ? 'info' : 'neutral'} />
        </div>
      </ReportCard>
      <ReportCard title="Top Risks">
        {s.risks.length === 0 ? (
          <EmptyState message="No risks identified - all executed controls passed." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['#', 'Risk', 'Severity', 'Impact', 'Mitigation', 'Owner', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.risks.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 align-top">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{r.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[240px]">{r.risk}<div className="text-xs font-normal text-gray-500 mt-0.5">{r.detail}</div></td>
                    <td className="px-3 py-2.5"><StatusPill status={r.severity} /></td>
                    <td className="px-3 py-2.5 text-gray-700 max-w-[180px]">{r.impact}</td>
                    <td className="px-3 py-2.5 text-gray-700 max-w-[260px]">{r.mitigation}</td>
                    <td className="px-3 py-2.5 text-gray-700">{r.owner}</td>
                    <td className="px-3 py-2.5"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
    </>
  );
}

export function QualitySectionView({ s }: { s: NonNullable<Suite['quality']> }) {
  const a = s.analysis;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiBox label="Overall Score" value={s.overall_score !== null ? `${s.overall_score}%` : '-'} tone={(s.overall_score ?? 0) >= 80 ? 'success' : (s.overall_score ?? 0) >= 60 ? 'warning' : 'error'} />
        <KpiBox label="Dimensions Scored" value={`${s.dimensions.filter((d) => d.score !== null).length}/6`} tone="info" />
        <KpiBox label="Best Dimension" value={s.best_dimension ? `${s.best_dimension.name} (${s.best_dimension.score}%)` : '-'} tone="success" />
        <KpiBox label="Worst Dimension" value={s.worst_dimension ? `${s.worst_dimension.name} (${s.worst_dimension.score}%)` : '-'} tone="error" />
      </div>
      <ReportCard title="Quality Dimensions" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Dimension', 'Score', 'Status', 'Assessment'].map((h, i) => (
                  <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i === 1 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.dimensions.map((d) => (
                <tr key={d.name} className="border-b border-gray-100 align-top">
                  <td className="px-3 py-2.5 font-medium text-gray-900">{d.name}</td>
                  <td className="px-3 py-2.5"><ScoreBar score={d.score} /></td>
                  <td className="px-3 py-2.5"><StatusPill status={d.rating} /></td>
                  <td className="px-3 py-2.5 text-gray-700">{d.assessment}<div className="text-xs text-gray-400 mt-0.5">{d.details}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportCard>
      <ReportCard title="Quality Trend" subtitle="Overall score per batch (oldest to newest)" className="mb-6">
        <LineChart points={s.trend} />
      </ReportCard>
      <ReportCard title="Analysis">
        <p className="text-sm text-gray-800 leading-relaxed">{a.narrative}</p>
        <p className="text-sm text-gray-800 leading-relaxed mt-3"><strong>Strengths:</strong> {a.strengths}</p>
        <p className="text-sm text-gray-800 leading-relaxed mt-3"><strong>Remediation Priority:</strong> {a.remediation}</p>
      </ReportCard>
    </>
  );
}

export function ReadinessSectionView({ s }: { s: NonNullable<Suite['readiness']> }) {
  const ready = s.score.ready;
  return (
    <>
      <ReportCard title="Readiness Score" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <KpiBox label="Overall Readiness" value={`${s.score.overall}%`} tone={ready ? 'success' : 'warning'} />
          <KpiBox label="Threshold Required" value={`${s.score.threshold}%`} tone="info" />
          <KpiBox label="Gap to Target" value={`${s.score.gap >= 0 ? '+' : ''}${s.score.gap}%`} tone={s.score.gap >= 0 ? 'success' : 'error'} />
        </div>
      </ReportCard>
      <ReportCard title="Readiness Assessment" subtitle="Weighted category model (threshold 80% per category)" className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Category', 'Score', 'Weight', 'Weighted', 'Status'].map((h, i) => (
                <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.categories.map((c) => (
              <tr key={c.category} className="border-b border-gray-100">
                <td className="px-3 py-2.5 text-gray-800">{c.category}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-gray-700">{c.score}%</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-gray-500">{c.weight}%</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-medium text-gray-900">{c.weighted}%</td>
                <td className="px-3 py-2.5 text-right"><StatusPill status={c.met ? 'MET' : 'BELOW'} /></td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-3 py-2.5 font-bold text-gray-900">Total</td>
              <td />
              <td />
              <td className="px-3 py-2.5 text-right tabular-nums font-bold text-gray-900">{s.score.overall}%</td>
              <td className="px-3 py-2.5 text-right"><StatusPill status={ready ? 'READY' : 'NOT READY'} /></td>
            </tr>
          </tbody>
        </table>
      </ReportCard>
      <ReportCard title="Recommendation" className="mb-6">
        <div className={`rounded-lg border-2 p-5 ${ready ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
          <div className={`text-lg font-extrabold tracking-tight mb-1 ${ready ? 'text-green-700' : 'text-red-700'}`}>{s.verdict_title}</div>
          <p className="text-sm text-gray-800">{s.verdict_text}</p>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-2">Required Actions</h3>
        <ul className="list-disc ml-5 space-y-1">
          {s.required_actions.map((action, i) => (
            <li key={i} className="text-sm text-gray-700">{action}</li>
          ))}
        </ul>
      </ReportCard>
    </>
  );
}

export function IssuesSectionView({ s }: { s: NonNullable<Suite['issues']> }) {
  const sum = s.summary;
  const openCritical = s.issues.filter(f => f.severity === 'CRITICAL' && f.status === 'OPEN');
  const openHigh = s.issues.filter(f => f.severity === 'HIGH' && f.status === 'OPEN');
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KpiBox label="Total Exceptions" value={sum.total} tone={sum.total > 0 ? 'error' : 'success'} />
        <KpiBox label="Open" value={sum.open} tone={sum.open > 0 ? 'warning' : 'success'} />
        <KpiBox label="Critical" value={sum.critical} tone={sum.critical > 0 ? 'error' : 'neutral'} />
        <KpiBox label="High" value={sum.high} tone={sum.high > 0 ? 'warning' : 'neutral'} />
        <KpiBox label="Medium" value={sum.medium} tone={sum.medium > 0 ? 'info' : 'neutral'} />
      </div>
      {(openCritical.length > 0 || openHigh.length > 0) && (
        <ReportCard title="Immediate Action Required" className="mb-6">
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-4">
            <div className="text-sm font-bold text-red-700 mb-2">OPEN CRITICAL/HIGH EXCEPTIONS</div>
            <p className="text-sm text-red-800 mb-3">{openCritical.length} critical and {openHigh.length} high-severity exceptions require immediate remediation before production migration.</p>
            <div className="space-y-2">
              {[...openCritical, ...openHigh].slice(0, 5).map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-sm">
                  <StatusPill status={f.severity} />
                  <span className="font-mono text-xs text-gray-500">{f.id}</span>
                  <span className="text-gray-700">{f.entity}</span>
                  <span className="text-gray-500">-</span>
                  <span className="text-gray-700">{f.type}</span>
                </div>
              ))}
              {(openCritical.length + openHigh.length) > 5 && (
                <p className="text-xs text-gray-500">...and {(openCritical.length + openHigh.length) - 5} more exceptions</p>
              )}
            </div>
          </div>
        </ReportCard>
      )}
      <ReportCard title="Exceptions by Control" subtitle={`${s.issues.length} exceptions (first 200 captured)`} className="mb-6">
        {s.issues.length === 0 ? (
          <EmptyState message="No exceptions recorded for this batch. Select an earlier batch with exceptions to review its exception register." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['ID', 'Source', 'Description', 'Severity', 'Owner', 'Status', 'Date'].map((h, i) => (
                    <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.issues.slice(0, 50).map((f) => (
                  <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">{f.id}</td>
                    <td className="px-3 py-2 text-gray-700">{f.entity ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-700 max-w-[280px] truncate" title={f.type}>{f.type}</td>
                    <td className="px-3 py-2"><StatusPill status={f.severity} /></td>
                    <td className="px-3 py-2 text-gray-700">{f.owner}</td>
                    <td className="px-3 py-2"><StatusPill status={f.status} /></td>
                    <td className="px-3 py-2 text-right text-xs text-gray-500 whitespace-nowrap">{f.date ?? f.created_at ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ReportCard title="Exceptions by Owner">
          {s.by_owner.length === 0 ? (
            <EmptyState message="No findings to allocate." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Owner', 'Exceptions', 'Critical', 'High', 'Medium'].map((h, i) => (
                    <th key={h} className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.by_owner.map((o) => (
                  <tr key={o.owner} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-800">{o.owner}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-gray-900">{o.total}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-red-700">{o.critical}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-yellow-700">{o.high}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-blue-700">{o.medium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ReportCard>
        <ReportCard title="Remediation Summary">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Critical exceptions blocking migration</span>
              <span className="text-sm font-semibold text-red-700">{sum.critical}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">High exceptions requiring attention</span>
              <span className="text-sm font-semibold text-yellow-700">{sum.high}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Medium exceptions for review</span>
              <span className="text-sm font-semibold text-blue-700">{sum.medium}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Exceptions resolved</span>
              <span className="text-sm font-semibold text-green-700">{sum.total - sum.open}</span>
            </div>
          </div>
        </ReportCard>
      </div>
    </>
  );
}

export function OperationalSectionView({ s }: { s: NonNullable<import('../../types/reportSuite').OperationalSection> }) {
  const ov = s.overview;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiBox label="Total Batches" value={ov.total_batches} tone="info" />
        <KpiBox label="Completed" value={ov.completed} tone="success" />
        <KpiBox label="Running" value={ov.running} tone={ov.running > 0 ? 'warning' : 'neutral'} />
        <KpiBox label="Failed" value={ov.failed} tone={ov.failed > 0 ? 'error' : 'neutral'} />
      </div>
      <ReportCard title="Migration Progress" subtitle="10-phase execution timeline" className="mb-6">
        <div className="space-y-3">
          {s.phases.map((p) => (
            <div key={p.phase} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-[220px] shrink-0">{p.phase}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    p.status === 'completed' ? 'bg-green-500' : p.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-[40px] text-right">{p.progress}%</span>
              <StatusPill status={p.status === 'completed' ? 'PASS' : p.status === 'in_progress' ? 'RUNNING' : 'PENDING'} />
            </div>
          ))}
        </div>
      </ReportCard>
      <ReportCard title="Recent Batches" subtitle={`${s.batches.length} most recent batches`} className="mb-6">
        {s.batches.length === 0 ? (
          <EmptyState message="No batches recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Name', 'Status', 'Controls', 'Completed', 'Failed', 'Duration', 'Created'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.batches.map((b) => (
                  <tr key={b.batch_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{b.batch_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={b.status} /></td>
                    <td className="px-3 py-2.5 tabular-nums">{b.total_controls}</td>
                    <td className="px-3 py-2.5 tabular-nums text-green-700">{b.completed_controls}</td>
                    <td className="px-3 py-2.5 tabular-nums text-red-700">{b.failed_controls}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-500">{b.duration_seconds != null ? `${b.duration_seconds}s` : '-'}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{b.created_at ? b.created_at.slice(0, 16).replace('T', ' ') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Control Execution Status">
        {s.control_status.length === 0 ? (
          <EmptyState message="No control status data available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Control', 'Name', 'Severity', 'Status', 'Total', 'Passed', 'Failed', 'Error'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.control_status.map((c) => (
                  <tr key={c.control_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.control_id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.control_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={c.severity} /></td>
                    <td className="px-3 py-2.5"><StatusPill status={c.status} /></td>
                    <td className="px-3 py-2.5 tabular-nums">{c.total_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-green-700">{c.passed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-red-700">{c.failed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-orange-700">{c.error_rules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
    </>
  );
}

export function ValidationPackSectionView({ s }: { s: NonNullable<import('../../types/reportSuite').ValidationPackSection> }) {
  const ov = s.overview;
  const rs = s.rules_summary;
  const hasCriticalFinding = s.analysis.toLowerCase().includes('critical finding');
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiBox label="Total Controls" value={ov.total_controls} tone="info" />
        <KpiBox label="Passed" value={ov.passed} tone="success" />
        <KpiBox label="Failed" value={ov.failed} tone={ov.failed > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Error" value={ov.error} tone={ov.error > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Skipped" value={ov.skipped} tone="neutral" />
        <KpiBox label="Pass Rate" value={`${ov.pass_rate}%`} tone={ov.pass_rate >= 80 ? 'success' : 'warning'} />
      </div>
      <ReportCard title="Rules Summary" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiBox label="Total Rules" value={rs.total_rules} tone="info" />
          <KpiBox label="Passed Rules" value={rs.passed_rules} tone="success" />
          <KpiBox label="Failed Rules" value={rs.failed_rules} tone={rs.failed_rules > 0 ? 'error' : 'neutral'} />
          <KpiBox label="Error Rules" value={rs.error_rules} tone={rs.error_rules > 0 ? 'error' : 'neutral'} />
          <KpiBox label="Skipped Rules" value={rs.skipped_rules} tone="neutral" />
        </div>
      </ReportCard>
      <ReportCard title="Control Results" subtitle={`${s.controls.length} controls executed`} className="mb-6">
        {s.controls.length === 0 ? (
          <EmptyState message="No control outcomes for this batch." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Control', 'Name', 'Severity', 'Status', 'Total', 'Passed', 'Failed', 'Error', 'Pass Rate'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.controls.map((c) => (
                  <tr key={c.control_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.control_id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{c.control_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={c.severity} /></td>
                    <td className="px-3 py-2.5"><StatusPill status={c.status} /></td>
                    <td className="px-3 py-2.5 tabular-nums">{c.total_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-green-700">{c.passed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-red-700">{c.failed_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums text-orange-700">{c.error_rules}</td>
                    <td className="px-3 py-2.5 tabular-nums">{c.pass_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Analysis">
        {hasCriticalFinding && (
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-4">
            <div className="text-sm font-bold text-red-700 mb-1">CRITICAL FINDING</div>
            <p className="text-sm text-red-800">{s.analysis.split('CRITICAL FINDING: ')[1]?.split('.')[0] ?? 'Critical issues detected.'}</p>
          </div>
        )}
        <p className="text-sm text-gray-800 leading-relaxed">{s.analysis}</p>
      </ReportCard>
    </>
  );
}

export function GovernancePackSectionView({ s }: { s: NonNullable<import('../../types/reportSuite').GovernancePackSection> }) {
  const ov = s.overview;
  const hasCritical = ov.critical > 0;
  
  // Group findings by control + entity + type to avoid duplicates
  const groupedFindings = Object.values(
    s.findings.reduce((acc, f) => {
      const key = `${f.control_id}|${f.entity_name}|${f.type}`;
      if (!acc[key]) {
        acc[key] = {
          control_id: f.control_id,
          control_name: f.control_id,
          entity_name: f.entity_name,
          type: f.type,
          owner: f.owner,
          severity: f.severity,
          status: f.status,
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, any>)
  ).sort((a, b) => {
    const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (sevOrder[a.severity as keyof typeof sevOrder] ?? 99) - (sevOrder[b.severity as keyof typeof sevOrder] ?? 99);
  });

  // Map control_id to readable names
  const controlNames: Record<string, string> = {
    'C01': 'Row Count Reconciliation',
    'C02': 'Financial Value Integrity & Reconciliation',
    'C03': 'Referential Integrity',
    'C04': 'Column Count Validation',
    'C05': 'Data Type Consistency',
    'C06': 'Nullability Validation',
    'C07': 'Duplicate Detection',
    'C08': 'Schema Drift Detection',
    'C09': 'Referential Coverage',
    'C010': 'Schema Comparison',
  };
  
  groupedFindings.forEach(f => {
    f.control_name = controlNames[f.control_id] || f.control_id;
  });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KpiBox label="Total Findings" value={ov.total_findings} tone="info" />
        <KpiBox label="Critical" value={ov.critical} tone={ov.critical > 0 ? 'error' : 'neutral'} />
        <KpiBox label="High" value={ov.high} tone={ov.high > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Medium" value={ov.medium} tone={ov.medium > 0 ? 'warning' : 'neutral'} />
        <KpiBox label="Low" value={ov.low} tone="neutral" />
      </div>
      <ReportCard title="Findings (Grouped by Control, Entity & Type)" subtitle={`${groupedFindings.length} unique groups from ${s.findings.length} findings`} className="mb-6">
        {groupedFindings.length === 0 ? (
          <EmptyState message="No governance findings in current batch." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Control Name', 'Entity', 'Type', 'Owner', 'Severity', 'Count', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedFindings.map((f) => (
                  <tr key={`${f.control_id}|${f.entity_name}|${f.type}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{f.control_name}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{f.entity_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.type} /></td>
                    <td className="px-3 py-2.5 text-gray-700">{f.owner}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.severity} /></td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{f.count}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ReportCard title="By Severity">
          {Object.entries(s.severity_distribution).filter(([,v]) => v > 0).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100">
              <StatusPill status={k} />
              <span className="text-sm font-semibold tabular-nums">{v}</span>
            </div>
          ))}
        </ReportCard>
        <ReportCard title="By Type">
          {Object.entries(s.type_distribution).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">{k}</span>
              <span className="text-sm font-semibold tabular-nums">{v}</span>
            </div>
          ))}
        </ReportCard>
        <ReportCard title="By Owner">
          {Object.entries(s.ownership_distribution).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">{k}</span>
              <span className="text-sm font-semibold tabular-nums">{v}</span>
            </div>
          ))}
        </ReportCard>
      </div>
      <ReportCard title="Analysis">
        {hasCritical && (
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-4">
            <div className="text-sm font-bold text-red-700 mb-1">CRITICAL FINDING</div>
            <p className="text-sm text-red-800">{ov.critical} critical-severity governance finding(s) require immediate remediation.</p>
          </div>
        )}
        <p className="text-sm text-gray-800 leading-relaxed">{s.analysis}</p>
      </ReportCard>
    </>
  );
}

export function AuditPackSectionView({ s }: { s: NonNullable<import('../../types/reportSuite').AuditPackSection> }) {
  const ov = s.overview;
  const hasComplianceIssue = ov.compliance_pct < 80;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiBox label="Total Batches" value={ov.total_batches} tone="info" />
        <KpiBox label="Completed" value={ov.completed_batches} tone="success" />
        <KpiBox label="Failed" value={ov.failed_batches} tone={ov.failed_batches > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Compliance" value={`${ov.compliance_pct}%`} tone={ov.compliance_pct >= 80 ? 'success' : 'error'} />
        <KpiBox label="Controls Executed" value={ov.total_controls_executed} tone="info" />
        <KpiBox label="Passed Controls" value={ov.passed_controls} tone="success" />
      </div>
      <ReportCard title="Audit Trail" subtitle={`${s.audit_trail.length} batch(es) recorded`} className="mb-6">
        {s.audit_trail.length === 0 ? (
          <EmptyState message="No audit trail available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Batch Name', 'Status', 'Controls', 'Completed', 'Failed', 'Duration', 'Date'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.audit_trail.map((b) => (
                  <tr key={b.batch_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{b.batch_name}</td>
                    <td className="px-3 py-2.5"><StatusPill status={b.status} /></td>
                    <td className="px-3 py-2.5 tabular-nums">{b.total_controls}</td>
                    <td className="px-3 py-2.5 tabular-nums text-green-700">{b.completed_controls}</td>
                    <td className="px-3 py-2.5 tabular-nums text-red-700">{b.failed_controls}</td>
                    <td className="px-3 py-2.5 text-gray-700">{b.duration}</td>
                    <td className="px-3 py-2.5 text-gray-500">{b.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Batch Status Distribution">
          {Object.entries(s.batch_status_distribution).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100">
              <StatusPill status={k} />
              <span className="text-sm font-semibold tabular-nums">{v}</span>
            </div>
          ))}
        </ReportCard>
        <ReportCard title="Findings by Severity">
          {Object.entries(s.severity_findings).length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No failing findings.</p>
          ) : (
            Object.entries(s.severity_findings).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100">
                <StatusPill status={k} />
                <span className="text-sm font-semibold tabular-nums">{v}</span>
              </div>
            ))
          )}
        </ReportCard>
      </div>
      <ReportCard title="Analysis">
        {hasComplianceIssue && (
          <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-4">
            <div className="text-sm font-bold text-red-700 mb-1">COMPLIANCE ISSUE</div>
            <p className="text-sm text-red-800">Compliance rate of {ov.compliance_pct}% is below the 80% threshold. Remediation required before production migration.</p>
          </div>
        )}
        <p className="text-sm text-gray-800 leading-relaxed">{s.analysis}</p>
      </ReportCard>
    </>
  );
}

export function MigrationPackSectionView({ s }: { s: NonNullable<import('../../types/reportSuite').MigrationPackSection> }) {
  const ov = s.overview;
  const es = s.entity_summary;
  const cs = s.column_summary;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KpiBox label="Projects" value={ov.total_projects} tone="info" />
        <KpiBox label="Entities Mapped" value={ov.total_entities} tone="info" />
        <KpiBox label="Source Columns" value={ov.total_source_columns} tone="info" />
        <KpiBox label="Target Columns" value={ov.total_target_columns} tone="info" />
        <KpiBox label="Overall Match" value={`${ov.overall_match_pct}%`} tone={ov.overall_match_pct >= 80 ? 'success' : 'warning'} />
      </div>
      <ReportCard title="Projects" subtitle={`${s.projects.length} migration projects`} className="mb-6">
        {s.projects.length === 0 ? (
          <EmptyState message="No projects found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Name', 'Type', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.projects.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="px-3 py-2.5 font-medium text-gray-900">{p.name}</td>
                    <td className="px-3 py-2.5 text-gray-700">{p.type}</td>
                    <td className="px-3 py-2.5"><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Entity Mapping" subtitle={`${s.entities.length} entities · ${es.passed} passed, ${es.attention} attention, ${es.failed} failed`} className="mb-6">
        {s.entities.length === 0 ? (
          <EmptyState message="No entity mappings available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Source Schema', 'Source Entity', 'Target Schema', 'Target Entity', 'Src Cols', 'Tgt Cols', 'Matched', 'Match %', 'Status'].map((h, i) => (
                    <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i >= 4 && i <= 7 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.entities.map((e, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-xs text-gray-500">{e.source_schema}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{e.source_table}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-500">{e.target_schema}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{e.target_table}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.source_columns}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.target_columns}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.matched_columns}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{e.match_pct}%</td>
                    <td className="px-3 py-2.5"><StatusPill status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
      <ReportCard title="Column Mapping Summary" subtitle={`${cs.total} columns · ${cs.auto_matched} auto-matched, ${cs.manual_review} manual review`}>
        <div className="grid grid-cols-3 gap-3">
          <KpiBox label="Total Columns" value={cs.total} tone="info" />
          <KpiBox label="Auto Matched" value={cs.auto_matched} tone="success" />
          <KpiBox label="Manual Review" value={cs.manual_review} tone={cs.manual_review > 0 ? 'warning' : 'neutral'} />
        </div>
      </ReportCard>
    </>
  );
}
