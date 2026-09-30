/**
 * OC-REPORT-001 â€” ReportAssistantPanel.
 *
 * This is the DETERMINISTIC Recipe Assistant, not AI. The UI deliberately says
 * so, because presenting a rule engine as a model would be misleading and would
 * imply a data-handling posture that does not exist.
 *
 * Flow: request -> matched recipe + keywords (always shown) -> 2-4 constrained
 * questions -> candidate definition -> normal save.
 */
import { useState } from 'react';
import type { ReportRecord } from '../../types/reportStudio';
import { useReportAssistant } from '../../hooks/useReportStudio';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorState } from '../shared/ErrorState';

interface Props {
  tenantId?: string | null;
  onCreated: (report: ReportRecord) => void;
}

export function ReportAssistantPanel({ tenantId, onCreated }: Props) {
  const a = useReportAssistant(tenantId);
  const [request, setRequest] = useState('');
  const [title, setTitle] = useState('');

  const step = !a.match ? 1 : !a.candidate ? 2 : 3;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-gray-900">Report Assistant</h3>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          built-in &middot; deterministic
        </span>
        <span className="text-[10px] text-gray-400">no LLM &middot; no API cost</span>
      </div>
      <p className="mt-1 text-[11px] text-gray-500">
        A curated recipe assistant. It proposes a report definition from
        allowlisted data sources â€” it never queries data and never bypasses your
        permissions.
      </p>

      <ol className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
        {['Request', 'Questions', 'Definition', 'Save'].map((s, i) => (
          <li key={s} className="flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.5 rounded ${
                step >= i + 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s}
            </span>
            {i < 3 && <span className="text-gray-300">&rsaquo;</span>}
          </li>
        ))}
      </ol>

      {a.error && <ErrorState message={a.error} />}

      {/* step 1 â€” request */}
      <div className="mt-3 flex gap-2">
        <input
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && request.trim()) a.runMatch(request); }}
          placeholder="e.g. show me failed controls for the last 10 batches"
          className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm"
          aria-label="What report do you want?"
        />
        <button
          onClick={() => a.runMatch(request)}
          disabled={a.loading || !request.trim()}
          className="h-9 px-3 rounded-md bg-gray-900 text-white text-xs font-semibold disabled:opacity-50"
        >
          Match
        </button>
      </div>

      {a.match && !a.match.matched && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <b>No recipe matched.</b> {a.match.reason}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {a.match.available_recipes?.map((r) => (
              <button
                key={r.recipe_key}
                onClick={() => a.runMatch(r.display_name)}
                className="rounded border border-amber-300 bg-white px-2 py-1 text-[10px] font-semibold"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* step 2 â€” matched recipe + constrained questions */}
      {a.match?.matched && (
        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-900">{a.match.recipe_key}</span>
            <span className="text-xs text-blue-800">{a.match.display_name}</span>
          </div>
          <div className="mt-1.5 text-[11px] text-blue-800">
            Matched on:{' '}
            {a.match.matched_keywords?.map((k) => (
              <span key={k} className="mr-1 rounded bg-white px-1.5 py-0.5 font-mono">{k}</span>
            ))}
            <span className="ml-1 text-blue-600">(score {a.match.score})</span>
          </div>
          {a.match.other_matches && a.match.other_matches.length > 0 && (
            <p className="mt-1 text-[10px] text-blue-600">
              also considered:{' '}
              {a.match.other_matches.map((m) => m.recipe_key).join(', ')}
            </p>
          )}

          <div className="mt-3 space-y-2">
            {(a.match.questions ?? []).map((q) => (
              <div key={q.id}>
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-blue-900 mb-1">
                  {q.prompt}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => a.setAnswers({ ...a.answers, [q.id]: opt })}
                      className={`rounded px-2 py-1 text-[11px] font-medium border ${
                        a.answers[q.id] === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-blue-200 text-blue-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Report title (optional)"
              className="flex-1 h-8 rounded-md border border-blue-200 px-2 text-xs"
            />
            <button
              onClick={async () => a.buildCandidate()}
              disabled={a.loading}
              className="h-8 rounded-md border border-blue-300 bg-white px-3 text-[11px] font-semibold text-blue-800 disabled:opacity-50"
            >
              Preview definition
            </button>
          </div>
        </div>
      )}

      {/* step 3 â€” candidate */}
      {a.candidate && (
        <div className="mt-3 rounded-md border border-gray-300 bg-gray-50 p-3">
          <div className="text-[11px] font-semibold text-gray-800">
            Candidate definition â€” {a.candidate.candidate.title}
          </div>
          <p className="text-[10px] text-gray-500">
            {a.candidate.candidate.definition.sections.length} section(s), source{' '}
            <span className="font-mono">{a.candidate.candidate.definition.data_source_key}</span>
          </p>
          <ul className="mt-1.5 text-[10px] text-gray-600 space-y-0.5">
            {a.candidate.candidate.definition.sections.map((s) => (
              <li key={s.id}>&bull; {s.type} â€” {s.title ?? s.id}</li>
            ))}
          </ul>
          <button
            onClick={async () => {
              const r = await a.saveCandidate(title || a.candidate?.candidate.title);
              if (r) onCreated(r);
            }}
            disabled={a.loading}
            className="mt-3 h-8 rounded-md bg-blue-600 px-3 text-[11px] font-semibold text-white disabled:opacity-50"
          >
            Save as editable draft
          </button>
        </div>
      )}

      {a.loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <LoadingSpinner /> Workingâ€¦
        </div>
      )}

      {!a.match && a.recipes.length > 0 && (
        <p className="mt-3 text-[10px] text-gray-400">
          {a.recipes.length} curated recipes available. Nothing is inferred silently â€”
          the matched recipe is always shown before it is used.
        </p>
      )}
    </div>
  );
}
