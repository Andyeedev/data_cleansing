/**
 * OC-REPORT-001 — Report Studio frontend types.
 *
 * Mirrors the shapes returned by /api/v1/reports/studio. Kept in one file so the
 * hooks and pages cannot drift from each other.
 */

export type ReportStatus = 'draft' | 'published' | 'archived' | 'deleted';
export type ReportOrigin = 'manual' | 'template' | 'assistant';
export type ReportTemplateState = 'pinned' | 'diverged';

export type SectionType =
  | 'kpi' | 'table' | 'bar' | 'line' | 'donut' | 'scorebar' | 'barlist';

export interface ReportField {
  name: string;
  label?: string;
  type: string;
  role: 'measure' | 'dimension' | 'time';
  aggregations?: string[];
}

export interface DataSourceSpec {
  data_source_key: string;
  display_name: string;
  grain: string;
  scope_family: string;
  required_permission: string;
  required_entitlements: string;
  fields: { fields: ReportField[] };
}

export interface TemplateSpec {
  template_key: string;
  version: number;
  display_name: string;
  description: string;
  category: string;
  data_sources: string[];
  required_entitlements: string[];
  thumbnail_spec: Record<string, unknown>;
  available: boolean;
}

export interface ReportCatalog {
  entitlements: string[];
  permissions: string[];
  templates: TemplateSpec[];
  data_sources: DataSourceSpec[];
}

export interface ReportBindings {
  measure?: string;
  dimensions?: string[];
  time_axis?: string;
  series?: string;
  aggregation?: string;
}

export interface ReportSection {
  id: string;
  type: SectionType;
  title?: string;
  bindings?: ReportBindings;
  config?: Record<string, unknown>;
  sort?: { field?: string; dir?: 'asc' | 'desc' };
}

export interface ReportFilter {
  field: string;
  op: string;
  value: unknown;
}

export interface ReportDefinitionBody {
  schema_version: number;
  data_source_key: string;
  sections: ReportSection[];
  filters?: ReportFilter[];
  max_rows?: number;
}

export interface ReportRecord {
  id: string;
  tenant_id: string;
  owner_user_id: string;
  title: string;
  description?: string;
  status: ReportStatus;
  visibility: 'private' | 'tenant';
  current_version_id?: string;
  derived_from_template_key?: string;
  derived_from_template_version?: number;
  required_permissions?: string[];
  required_entitlements?: string[];
  origin: ReportOrigin;
  origin_recipe_key?: string;
  template_state: ReportTemplateState;
  created_at?: string;
  updated_at?: string;
  version_no?: number;
  is_owner?: boolean;
}

export interface DefinitionRow {
  id: string;
  version_no: number;
  schema_version: number;
  definition: ReportDefinitionBody;
  created_by: string;
  created_at: string;
}

export interface ReportComponent {
  id: string;
  type: SectionType;
  title?: string;
  is_row_query: boolean;
  columns: string[];
  rows: unknown[][];
  row_count: number;
}

export interface ReportReadPayload {
  report: {
    id: string;
    title: string;
    description?: string;
    status: ReportStatus;
    visibility: string;
    template_state: ReportTemplateState;
    origin: ReportOrigin;
    derived_from_template_key?: string;
    derived_from_template_version?: number;
    is_owner: boolean;
  };
  version: { version_no: number; schema_version: number; created_at: string };
  meta: {
    ok: boolean;
    data_source_key: string;
    scope_family: string;
    row_count: number;
    max_rows: number;
    truncated: boolean;
    runtime_filters_applied: number;
  };
  components: ReportComponent[];
  errors: string[];
}

export interface RecipeQuestion {
  id: string;
  prompt: string;
  type: 'choice';
  options: string[];
  default?: string;
}

export interface RecipeSpec {
  recipe_key: string;
  display_name: string;
  description: string;
  keywords: string[];
  questions: RecipeQuestion[];
  resulting_template_key?: string;
  required_entitlements: string[];
}

export interface RecipeMatch {
  matched: boolean;
  reason?: string;
  recipe_key?: string;
  display_name?: string;
  score?: number;
  matched_keywords?: string[];
  questions?: RecipeQuestion[];
  resulting_template_key?: string;
  other_matches?: { recipe_key: string; score: number; matched_keywords: string[] }[];
  available_recipes?: { recipe_key: string; display_name: string }[];
}

export interface AssistantCandidate {
  candidate: {
    title: string;
    description?: string;
    definition: ReportDefinitionBody;
    origin: ReportOrigin;
    origin_recipe_key: string;
    origin_answers: Record<string, unknown>;
    derived_from_template_key?: string;
    derived_from_template_version?: number;
  };
}

export interface AccessGrant {
  granted?: boolean;
  revoked?: boolean;
  grantee_user_id: string;
  required_permissions: string[];
  required_entitlements: string[];
  grantee_can_export: boolean;
}

export interface AccessEntry {
  user_id: string;
  email: string;
  access_level: string;
  granted_at: string;
}

/* ==========================================================================
   Option B builder (Phase 2)
   --------------------------------------------------------------------------
   The constants below are a MIRROR of report_definition_validator.py, not a
   second source of truth. The editor restricts itself to these tokens so it
   cannot construct a definition the server would reject, but the server
   validator remains authoritative: every save and every preview is validated
   server-side, and the editor surfaces whatever that validator returns.
   ========================================================================== */

export type Aggregation = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'count_distinct';

export type FilterOperator =
  | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'nin' | 'between' | 'like';

export const SECTION_TYPES: SectionType[] = [
  'kpi', 'table', 'bar', 'line', 'donut', 'scorebar', 'barlist',
];

export const AGGREGATIONS: Aggregation[] = [
  'count', 'sum', 'avg', 'min', 'max', 'count_distinct',
];

export const FILTER_OPERATORS: FilterOperator[] = [
  'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'between', 'like',
];

/** Operators that take a list of values rather than a single one. */
export const LIST_OPERATORS: FilterOperator[] = ['in', 'nin'];

/** The validator requires a dimension or time axis for these. */
export const NEEDS_AXIS_TYPES: SectionType[] = ['bar', 'line', 'donut'];

export const MAX_SECTIONS = 25;
export const MAX_FILTERS = 25;
export const HARD_MAX_ROWS = 1000;

/** Result of POST /reports/studio/validate. */
export interface ValidateResult {
  valid: boolean;
  errors: string[];
  data_source_key?: string | null;
  max_rows?: number | null;
  section_count: number;
  filter_count: number;
}

/**
 * The read payload gains `preview: true` when it was produced from an unsaved
 * candidate definition, so the UI can label it and never imply that a preview is
 * what a reader would currently see.
 */
export interface ReportPreviewPayload extends ReportReadPayload {
  preview?: boolean;
}

/* ==========================================================================
   Template updates (pin / diverged)
   ========================================================================== */

export interface TemplateUpdateFieldChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface TemplateUpdateSection {
  id: string;
  type?: string;
  title?: string;
  changes?: TemplateUpdateFieldChange[];
}

/** Section-level preview of a template update. Never applied automatically. */
export interface TemplateUpdateDiff {
  added: TemplateUpdateSection[];
  removed: TemplateUpdateSection[];
  changed: TemplateUpdateSection[];
  data_source_change?: { from?: string | null; to?: string | null } | null;
}

/**
 * GET /reports/{id}/template-update.
 *
 * `has_update` false carries a `reason`, e.g. "not derived from a template" or
 * "report has diverged" - the banner explains that rather than hiding itself,
 * because a diverged report keeps its provenance for reference.
 */
export interface TemplateUpdateInfo {
  has_update: boolean;
  reason?: string;
  template_key?: string;
  template_display_name?: string;
  report_template_version?: number | null;
  latest_template_version?: number | null;
  changelog?: string | null;
  diff?: TemplateUpdateDiff;
}

