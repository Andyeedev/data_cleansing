/**
 * OC-REPORT-001 â€” TemplateUpdateBanner.
 *
 * The plan's pin/update contract (Â§5A.4): a report derived from a template
 * records whether it is PINNED (tracks the template) or DIVERGED (the user has
 * edited enough that template updates no longer apply cleanly). When a newer
 * template version ships, a pinned report is OFFERED the update:
 *
 *     template version -> changelog -> diff preview -> accept as a NEW version
 *
 * Three rules this component exists to enforce:
 *
 *  1. NEVER AUTOMATIC. Checking is a read. Nothing is applied by rendering this
 *     banner, by opening the viewer, or by a background poll. Adoption is a
 *     separate, explicit POST.
 *  2. NO LIVE INHERITENCE. Adopting creates a new immutable report version; the
 *     report does not become a live view of the template.
 *  3. DIVERGED IS NOT AN ERROR. A diverged report keeps its provenance and is
 *     simply never offered updates, so the banner says so rather than
 *     disappearing and leaving the user wondering.
 */
import { useState } from 'react';
import type {
  TemplateUpdateInfo, TemplateUpdateSection,
} from '../../types/reportStudio';

function fmt(v: unknown): string {
  if (v === null || v === undefined || v === '') return '(none)';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '(none)';
  return String(v);
}

function SectionLine({ s, verb }: { s: TemplateUpdateSection; verb: string }) {
  return (
    <li className="text-[11px] text-gray-700">
      <span className="font-mono text-gray-500">{s.id}</span>{' '}
      <span className="font-semibold">{s.title || s.type || s.id}</span>{' '}
      <span className="text-gray-500">({verb})</span>
    </li>
  );
}

interface Props {
  info: TemplateUpdateInfo | null;
  loading?: boolean;
  error?: string | null;
  adopting?: boolean;
  adoptedMessage?: string | null;
  canUpdate: boolean;
  onAdopt: () => void;
}

export function TemplateUpdateBanner({
  info, loading, error, adopting, adoptedMessage, canUpdate, onAdopt,
}: Props) {
  const [showDiff, setShowDiff] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
        Could not check for template updates: {error}
      </div>
    );
  }
  if (adoptedMessage) {
    return (
      <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-800">
        {adoptedMessage}
      </div>
    );
  }
  if (loading && !info) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-500">
        Checking for template updatesâ€¦
      </div>
    );
  }
  if (!info) return null;

  // --- diverged / not template-derived: explain, do not offer -------------
  if (!info.has_update) {
    if (info.reason === 'report has diverged') {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <b>This report has diverged from its template</b>{' '}
          (<span className="font-mono">{info.template_key}</span> v
          {fmt(info.report_template_version)}), so template updates no longer
          apply cleanly. Your provenance is kept for reference and your current
          definition is unaffected.
        </div>
      );
    }
    if (info.reason === 'not derived from a template') {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          This report was not created from a template, so there is nothing to
          update.
        </div>
      );
    }
    // Pinned and already current.
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        Tracks template <span className="font-mono">{info.template_key}</span> v
        {fmt(info.latest_template_version ?? info.report_template_version)} â€”
        up to date.
      </div>
    );
  }

  // --- an update is available --------------------------------------------
  const diff = info.diff;
  const changeCount =
    (diff?.added.length ?? 0) + (diff?.removed.length ?? 0) + (diff?.changed.length ?? 0);

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-amber-900">
            A newer version of this report&rsquo;s template is available
          </div>
          <div className="mt-0.5 text-[11px] text-amber-800">
            <span className="font-mono">{info.template_key}</span>{' '}
            {info.template_display_name && <>&mdash; {info.template_display_name} &middot; </>}
            your report is on template v{info.report_template_version}, latest is v
            {info.latest_template_version}.
          </div>
        </div>
        <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
          pinned
        </span>
      </div>

      {info.changelog && (
        <div className="mt-2 rounded bg-white/70 p-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            What changed in the template
          </div>
          <p className="mt-0.5 text-[11px] text-gray-700">{info.changelog}</p>
        </div>
      )}

      {diff && changeCount > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowDiff((s) => !s)}
            aria-expanded={showDiff}
            className="text-[11px] font-semibold text-amber-900 underline"
          >
            {showDiff ? 'Hide' : 'Show'} what adopting would change (
            {changeCount} section{changeCount === 1 ? '' : 's'})
          </button>

          {showDiff && (
            <div className="mt-1.5 space-y-1.5 rounded bg-white/70 p-2">
              {diff.data_source_change && (
                <p className="text-[11px] font-semibold text-red-700">
                  Data source changes: <span className="font-mono">{fmt(diff.data_source_change.from)}</span>
                  {' '}&rarr; <span className="font-mono">{fmt(diff.data_source_change.to)}</span>
                </p>
              )}
              {diff.added.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase text-green-700">Added</div>
                  <ul className="ml-2 list-disc">
                    {diff.added.map((s) => <SectionLine key={s.id} s={s} verb="new" />)}
                  </ul>
                </div>
              )}
              {diff.removed.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase text-red-700">Removed</div>
                  <ul className="ml-2 list-disc">
                    {diff.removed.map((s) => <SectionLine key={s.id} s={s} verb="removed" />)}
                  </ul>
                </div>
              )}
              {diff.changed.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase text-amber-700">Changed</div>
                  <ul className="ml-2 list-disc space-y-0.5">
                    {diff.changed.map((s) => (
                      <li key={s.id} className="text-[11px] text-gray-700">
                        <span className="font-mono text-gray-500">{s.id}</span>{' '}
                        <span className="font-semibold">{s.title || s.type || s.id}</span>
                        <ul className="ml-3 list-none">
                          {(s.changes ?? []).map((c, i) => (
                            <li key={i} className="text-[10px] text-gray-600">
                              {c.field}: <span className="font-mono line-through">{fmt(c.from)}</span>
                              {' -> '}
                              <span className="font-mono font-semibold">{fmt(c.to)}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-2.5 border-t border-amber-300 pt-2">
        <p className="text-[10px] text-amber-800">
          Nothing is applied automatically. Adopting creates a{' '}
          <b>new report version</b> from the template definition; your existing
          versions stay readable.
        </p>

        {canUpdate ? (
          confirming ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-amber-900">
                Replace the definition with template v{info.latest_template_version} as a new version?
              </span>
              <button
                onClick={() => { setConfirming(false); onAdopt(); }}
                disabled={adopting}
                className="rounded bg-amber-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {adopting ? 'Adoptingâ€¦' : 'Yes, adopt as new version'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={adopting}
                className="rounded border border-amber-400 px-2.5 py-1 text-[11px] font-medium text-amber-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="mt-1.5 rounded bg-amber-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-800"
            >
              Adopt template v{info.latest_template_version}â€¦
            </button>
          )
        ) : (
          <p className="mt-1.5 text-[11px] text-amber-800">
            You do not hold <span className="font-mono">reports:update</span>, so
            you can review this update but cannot adopt it. The API enforces this
            independently.
          </p>
        )}
      </div>
    </div>
  );
}

export default TemplateUpdateBanner;
