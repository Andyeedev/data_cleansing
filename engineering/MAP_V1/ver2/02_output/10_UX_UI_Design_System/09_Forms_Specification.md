# MAP MVP Forms Specification

| Field    | Value                       |
| -------- | --------------------------- |
| Document | MAP MVP Forms Specification |
| Version  | 1.0                         |
| Date     | June 2026                   |
| Status   | Official                    |
| Author   | MAP Design Engineering      |

---

## 1. Create Project Form

**Purpose:** Create a new migration project to group related migrations.

| # | Field               | Type     | Required | Validation                               |
|---|---------------------|----------|----------|------------------------------------------|
| 1 | Name                | text     | Yes      | 3–100 chars, unique per tenant           |
| 2 | Description         | textarea | No       | Max 500 chars                            |
| 3 | Source Subscription | select   | Yes      | Must be a connected subscription         |
| 4 | Target Subscription | select   | Yes      | Must be a connected subscription         |
| 5 | Migration Type      | radio    | Yes      | lift-and-shift / modernize / replatform  |

**Client Validation:**
- Name: `/^.{3,100}$/` — trim whitespace before validate.
- Name uniqueness: debounced async check against tenant project list (300 ms).
- Source and Target subscriptions must differ.
- Migration type defaults to `lift-and-shift`.

**Server Validation:**
- Name uniqueness enforced at database level (unique constraint per tenant).
- Subscription IDs validated against Azure Resource Manager.
- Returns `409 Conflict` if name already exists.

**Error Messages:**

| Condition          | Message                                                                      |
|--------------------|------------------------------------------------------------------------------|
| Name too short     | "Project name must be at least 3 characters."                                |
| Name too long      | "Project name must be 100 characters or fewer."                              |
| Name already exists| "A project with this name already exists. Please choose a different name."   |
| Source equals Target| "Source and target subscriptions must be different."                        |
| Subscription invalid| "Selected subscription is not available. Please reconnect."                 |
| Migration type missing| "Please select a migration type."                                         |

**Business Rules:**
- A project must have at least one migration created before it can be validated.
- Source and target subscriptions must belong to the same tenant or have cross-tenant permissions configured.
- Migration type cannot be changed after the first migration is added.

**Accessibility:**
- Each field has a visible `<label>` with `for` attribute bound to input `id`.
- Description fields include `aria-describedby` pointing to helper text.
- Error messages are linked to inputs via `aria-describedby` and announced via `aria-live="polite"`.
- Radio group uses `role="radiogroup"` with `aria-labelledby` pointing to group legend.

**Keyboard Navigation:**
- `Tab` moves through fields in order: Name, Description, Source, Target, Migration Type, Submit.
- `Enter` on the last field or any point submits the form if valid.
- `Space` selects radio options; arrow keys move between radio options.

---

## 2. Connect Subscription Form

**Purpose:** Register an Azure subscription for monitoring and migration validation.

| # | Field                 | Type     | Required | Validation                           |
|---|-----------------------|----------|----------|--------------------------------------|
| 1 | Azure Subscription ID | text     | Yes      | GUID format (8-4-4-4-12 hex)        |
| 2 | Display Name          | text     | Yes      | 1–128 chars, alphanumeric + spaces  |
| 3 | Description           | textarea | No       | Max 256 chars                        |

**Client Validation:**
- Subscription ID: `/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/`
- Display Name: `/^.{1,128}$/`
- Async validation: subscription existence check via Azure API (on blur).

**Server Validation:**
- Verifies subscription exists and is accessible with current service principal credentials.
- Verifies subscription is not already connected.
- Checks RBAC permissions on the subscription.

**Error Messages:**

| Condition                     | Message                                                                                      |
|-------------------------------|----------------------------------------------------------------------------------------------|
| Invalid GUID format           | "Please enter a valid subscription ID (e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890)."      |
| Subscription not found        | "Subscription not found. Verify the ID and ensure it exists in your Azure directory."        |
| Subscription already connected| "This subscription is already connected."                                                     |
| Insufficient permissions      | "Insufficient permissions. Ensure the service principal has Reader access."                  |
| Display name required         | "Display name is required."                                                                   |

**Business Rules:**
- Only one connection attempt per subscription ID at a time (prevent duplicate async calls).
- Connection status is polled every 60 seconds after initial registration.
- Subscriptions in a suspended or deleted state cannot be connected.

**Accessibility:**
- Helper text below Subscription ID field explains expected format.
- Validation errors announced immediately via `aria-live="assertive"`.
- Loading spinner during async validation has `aria-label="Checking subscription..."`.

**Keyboard Navigation:**
- `Tab` order: Subscription ID, Display Name, Description, Submit.
- `Enter` submits if all fields valid.
- Paste is supported and auto-formatted in the GUID field.

---

## 3. Create Migration Form

**Purpose:** Define a migration within a project, selecting source and target resources.

| # | Field     | Type         | Required | Validation                     |
|---|-----------|--------------|----------|--------------------------------|
| 1 | Name      | text         | Yes      | 3–100 chars, unique per project|
| 2 | Project   | select       | Yes      | Must exist in tenant           |
| 3 | Source    | select       | Yes      | Must be from source subscription|
| 4 | Target    | select       | Yes      | Must be from target subscription|
| 5 | Resources | multi-select | Yes      | At least 1 resource selected   |

**Client Validation:**
- Name: `/^.{3,100}$/`, debounced uniqueness check within project scope.
- Project, Source, Target: must have a selected value.
- Resources: `resources.length >= 1`.
- Source and Target dropdowns populated dynamically based on selected Project.

**Server Validation:**
- Name uniqueness per project enforced at database level.
- Resource IDs validated against Azure Resource Manager.
- Resources must exist in the source subscription.

**Error Messages:**

| Condition            | Message                                                                        |
|----------------------|--------------------------------------------------------------------------------|
| Name too short       | "Migration name must be at least 3 characters."                                |
| Name duplicate       | "A migration with this name already exists in this project."                   |
| No project selected  | "Please select a project."                                                     |
| No source selected   | "Please select a source."                                                      |
| No target selected   | "Please select a target."                                                      |
| No resources selected| "Select at least one resource to migrate."                                     |
| Resource unavailable | "Some selected resources are no longer available. Please refresh and try again."|

**Business Rules:**
- Resources can only be assigned to one active migration at a time.
- Once validation begins, resource list is locked.
- Source and target options are filtered by project subscription configuration.

**Accessibility:**
- Multi-select has a search input with `role="combobox"` and `aria-expanded`.
- Selected resources shown as removable chips; each chip has a remove button with `aria-label="Remove [resource name]"`.
- Resource count announced: "5 resources selected" via `aria-live="polite"`.

**Keyboard Navigation:**
- `Tab` order: Name, Project, Source, Target, Resources, Submit.
- In multi-select: `Arrow Up/Down` navigates options, `Enter` toggles selection, `Backspace` removes last selected.
- `Escape` closes dropdown.

---

## 4. Execute Validation Form

**Purpose:** Run validation checks against a migration before execution.

| # | Field            | Type       | Required | Validation                           |
|---|------------------|------------|----------|--------------------------------------|
| 1 | Migration        | auto-fill  | Yes      | Auto-populated, read-only            |
| 2 | Check Categories | checkboxes | Yes      | At least 1 category selected         |
| 3 | Priority         | select     | Yes      | all / critical / high / medium / low |

**Client Validation:**
- Migration: always populated from context, not editable.
- Check Categories: `selectedCategories.length >= 1`.
- Priority: must have a value; defaults to `all`.

**Server Validation:**
- Verifies migration exists and is in a valid state for validation.
- Verifies selected categories are enabled for the subscription tier.

**Error Messages:**

| Condition            | Message                                                                     |
|----------------------|-----------------------------------------------------------------------------|
| No categories selected| "Select at least one check category to validate."                         |
| Migration locked     | "This migration is currently being validated. Please wait."                 |
| Category unavailable | "Some selected categories require a higher subscription tier."              |

**Business Rules:**
- Maximum 3 concurrent validations per tenant.
- Validation runs asynchronously; user is redirected to status page.
- Check categories map to internal validation modules: `network`, `storage`, `compute`, `security`, `compliance`.
- `all` priority runs every check; lower priorities skip non-critical checks.

**Accessibility:**
- Categories presented as a checkbox group with `role="group"` and `aria-labelledby`.
- Each checkbox has a visible label and optional description.
- Selected count announced: "3 of 5 categories selected".

**Keyboard Navigation:**
- `Tab` order: Migration, Categories (each checkbox), Priority, Submit.
- `Space` toggles checkboxes.
- `Enter` submits the form.

---

## 5. Create Policy Form

**Purpose:** Define a compliance or validation policy with rule sets.

| # | Field       | Type        | Required | Validation                     |
|---|-------------|-------------|----------|--------------------------------|
| 1 | Name        | text        | Yes      | 3–100 chars, unique per tenant |
| 2 | Description | textarea    | No       | Max 500 chars                  |
| 3 | Category    | select      | Yes      | One of predefined categories   |
| 4 | Rules       | JSON editor | Yes      | Valid JSON, matches schema     |
| 5 | Severity    | select      | Yes      | critical / high / medium / low |

**Client Validation:**
- Name: `/^.{3,100}$/`, uniqueness check.
- Rules: parsed as JSON; syntax errors shown inline with line numbers.
- Rules must conform to policy rule schema (validated against JSON Schema on blur).
- Severity: must have a value.

**Server Validation:**
- Name uniqueness per tenant.
- Rules JSON validated against policy rule schema.
- Category must exist in the tenant's category list.

**Error Messages:**

| Condition        | Message                                                                       |
|------------------|-------------------------------------------------------------------------------|
| Invalid JSON     | "Rules contain invalid JSON. Please fix syntax errors."                       |
| Schema mismatch  | "Rules do not match the expected format. See the example for reference."      |
| Name duplicate   | "A policy with this name already exists."                                      |
| Invalid category | "Please select a valid category."                                             |
| Severity required| "Please select a severity level."                                             |

**Business Rules:**
- Policy names are unique per tenant.
- Rules JSON maximum size: 64 KB.
- Policies in use by active migrations cannot be deleted, only deactivated.
- Default policies provided per category cannot be modified, only extended.

**Accessibility:**
- JSON editor supports syntax highlighting and line numbers.
- Syntax errors are announced via `aria-live="assertive"` with line and column numbers.
- Category and Severity dropdowns have `aria-describedby` linking to helper text.

**Keyboard Navigation:**
- `Tab` order: Name, Description, Category, Rules, Severity, Submit.
- JSON editor: standard text editing keys, `Ctrl+Z` undo, `Ctrl+Shift+Z` redo.
- `Enter` submits the form (not inside JSON editor).

---

## 6. Generate Report Form

**Purpose:** Generate exportable reports for migration validation results.

| # | Field            | Type              | Required | Validation                        |
|---|------------------|-------------------|----------|------------------------------------|
| 1 | Report Type      | select            | Yes      | executive / technical / compliance |
| 2 | Format           | radio             | Yes      | PDF / Excel / JSON                |
| 3 | Date Range       | date range picker | Yes      | End date >= start date             |
| 4 | Include Sections | checkboxes        | Yes      | At least 1 section selected        |

**Client Validation:**
- Report Type: must have a value.
- Format: must have a selection.
- Date Range: both start and end required; end >= start; start not older than 12 months.
- Include Sections: `selectedSections.length >= 1`.

**Server Validation:**
- Verifies user has permission to generate the selected report type.
- Verifies data exists for the selected date range.
- Report generation queued; returns job ID.

**Error Messages:**

| Condition             | Message                                                                       |
|-----------------------|-------------------------------------------------------------------------------|
| No report type        | "Please select a report type."                                                |
| No format selected    | "Please select an export format."                                             |
| Date range missing    | "Please select a start and end date."                                         |
| End before start      | "End date must be on or after the start date."                                |
| Range exceeds 12 months| "Date range cannot exceed 12 months."                                       |
| No sections selected  | "Select at least one section to include."                                     |
| No data in range      | "No data found for the selected date range."                                  |

**Business Rules:**
- Executive reports include summary dashboards; technical reports include raw validation data.
- Compliance reports map to regulatory frameworks (SOC 2, ISO 27001, etc.).
- Large reports (more than 10,000 rows) are generated asynchronously and downloaded via link.
- Report links expire after 24 hours.

**Accessibility:**
- Date range picker uses two inputs with `aria-label="Start date"` and `aria-label="End date"`.
- Sections checkboxes grouped with `role="group"` and `aria-labelledby`.
- Generating state announced via `aria-live="polite"`: "Report generation in progress...".

**Keyboard Navigation:**
- `Tab` order: Report Type, Format, Date Range (start, end), Include Sections, Generate.
- `Space` selects radio and checkbox options.
- `Enter` submits.

---

## 7. User Invite Form

**Purpose:** Invite new users to the tenant with a specified role.

| # | Field | Type  | Required | Validation                             |
|---|-------|-------|----------|----------------------------------------|
| 1 | Email | email | Yes      | Valid email format, not existing user  |
| 2 | Role  | select| Yes      | admin / editor / viewer                |

**Client Validation:**
- Email: RFC 5322 compliant regex.
- Async uniqueness check against existing user list and pending invites (on blur).
- Role: must have a value; defaults to `viewer`.

**Server Validation:**
- Verifies email format.
- Verifies email is not already associated with an existing or invited user.
- Verifies inviter has permission to assign the selected role.

**Error Messages:**

| Condition              | Message                                                                |
|------------------------|------------------------------------------------------------------------|
| Invalid email format   | "Please enter a valid email address."                                  |
| User already exists    | "A user with this email address already exists."                       |
| Invite pending         | "An invitation has already been sent to this email address."           |
| Role required          | "Please select a role."                                                |
| Insufficient permission| "You do not have permission to assign this role."                      |

**Business Rules:**
- Invitations expire after 7 days; users can resend.
- Admin role limited to users with existing admin privileges.
- Maximum 50 pending invitations per tenant.
- Invited users receive an email with a one-time activation link.

**Accessibility:**
- Email field has `type="email"` for native validation support.
- Role select has helper text explaining each role's permissions.
- Success state announced: "Invitation sent to [email]" via `aria-live="polite"`.

**Keyboard Navigation:**
- `Tab` order: Email, Role, Send Invite.
- `Enter` submits if email is valid.

---

## 8. Settings Form

**Purpose:** Configure tenant-level settings and preferences.

| # | Field          | Type          | Required | Validation                    |
|---|----------------|---------------|----------|-------------------------------|
| 1 | Company Name   | text          | No       | 1–200 chars                   |
| 2 | Logo           | file upload   | No       | PNG/SVG, max 2 MB             |
| 3 | Timezone       | select        | Yes      | Valid IANA timezone           |
| 4 | Currency       | select        | Yes      | ISO 4217 code                 |
| 5 | Notifications  | toggle groups | No       | Boolean per channel           |

**Client Validation:**
- Company Name: `/^.{1,200}$/` if provided.
- Logo: file extension `.png` or `.svg`; size <= 2 MB; image dimensions max 512x512 px.
- Timezone: must be from predefined IANA list.
- Currency: must be from supported ISO 4217 list.
- Notifications: each toggle is a boolean.

**Server Validation:**
- Logo processed and stored in Azure Blob Storage; URL returned.
- Timezone and Currency validated against allowed values.
- Company Name sanitized (HTML stripped).

**Error Messages:**

| Condition         | Message                                                             |
|-------------------|---------------------------------------------------------------------|
| Company Name too long| "Company name must be 200 characters or fewer."                  |
| Logo too large    | "Logo file must be smaller than 2 MB."                             |
| Invalid file type | "Please upload a PNG or SVG file."                                  |
| Invalid timezone  | "Please select a valid timezone."                                   |
| Invalid currency  | "Please select a supported currency."                               |
| Upload failed     | "Logo upload failed. Please try again."                             |

**Business Rules:**
- Logo is cropped/resized to 256x256 px for consistent display.
- Settings changes take effect immediately for all tenant users.
- Notification toggles: email, in-app, webhook (each independently toggleable).
- Currency affects report generation and cost analysis features.

**Accessibility:**
- File upload has a visible drop zone with `role="button"` and `aria-label="Upload logo"`.
- Keyboard users can activate upload with `Enter` or `Space`.
- Preview shown after upload with `alt="Company logo preview"`.
- Toggle groups use `role="group"` with `aria-labelledby`.

**Keyboard Navigation:**
- `Tab` order: Company Name, Logo (drop zone), Timezone, Currency, Notification toggles, Save.
- `Enter` on drop zone opens file picker.
- `Space` toggles notification switches.
- `Enter` submits the form.

---

## 9. Search Form

**Purpose:** Global search with advanced filters across all platform entities.

| # | Field       | Type         | Required | Validation                           |
|---|-------------|--------------|----------|--------------------------------------|
| 1 | Query       | text         | No       | Max 200 chars, sanitized             |
| 2 | Type        | multi-select | No       | Valid entity types                   |
| 3 | Status      | multi-select | No       | Valid status values                  |
| 4 | Date Range  | date range   | No       | End date >= start date               |
| 5 | Severity    | multi-select | No       | Valid severity levels                |

**Client Validation:**
- Query: sanitized (HTML stripped), max 200 chars.
- Type: array of valid entity types (`project`, `migration`, `policy`, `report`, `subscription`).
- Status: array of valid statuses (`active`, `completed`, `failed`, `pending`, `archived`).
- Date Range: end >= start if both provided.
- Severity: array of `critical`, `high`, `medium`, `low`.

**Server Validation:**
- Query sanitized server-side (SQL injection prevention).
- Filter values validated against allowed enums.
- Search is indexed; full-text search with Elasticsearch.

**Error Messages:**

| Condition         | Message                                                 |
|-------------------|---------------------------------------------------------|
| Query too long    | "Search query must be 200 characters or fewer."         |
| Invalid date range| "End date must be on or after the start date."          |
| No results        | "No results found. Try adjusting your search or filters."|

**Business Rules:**
- Search is debounced at 300 ms on keystroke.
- Minimum 2 characters to trigger search.
- Results limited to 50 per page with pagination.
- Search history stored for last 10 queries (user-scoped).
- Filters are additive (AND logic between filter groups).

**Accessibility:**
- Search input has `role="searchbox"` and `aria-label="Search"`.
- Results announced via `aria-live="polite"`: "15 results found".
- Filter chips show active filters; each has a remove button with `aria-label="Remove [filter]"`.
- No results state includes suggestions.

**Keyboard Navigation:**
- `Tab` order: Query, Type filter, Status filter, Date Range, Severity filter.
- `Enter` submits search.
- `Escape` clears the search input.
- `Arrow Up/Down` navigates autocomplete suggestions.
- `Enter` on suggestion selects it.

---

## 10. API Key Form

**Purpose:** Generate API keys for programmatic access to MAP platform.

| # | Field       | Type        | Required | Validation                     |
|---|-------------|-------------|----------|--------------------------------|
| 1 | Name        | text        | Yes      | 3–64 chars, unique per tenant  |
| 2 | Permissions | checkboxes  | Yes      | At least 1 permission selected |
| 3 | Expiry      | date picker | Yes      | Must be in the future          |

**Client Validation:**
- Name: `/^.{3,64}$/`, debounced uniqueness check.
- Permissions: `selectedPermissions.length >= 1`.
- Expiry: `expiryDate > currentDate`.

**Server Validation:**
- Name uniqueness per tenant enforced at database level.
- Permissions validated against available API scopes.
- Expiry validated server-side to prevent past dates.
- API key generated as UUID v4 with prefix `map_`.

**Error Messages:**

| Condition           | Message                                                                  |
|---------------------|--------------------------------------------------------------------------|
| Name too short      | "API key name must be at least 3 characters."                            |
| Name too long       | "API key name must be 64 characters or fewer."                           |
| Name already exists | "An API key with this name already exists."                              |
| No permissions      | "Select at least one permission."                                        |
| Expiry in past      | "Expiry date must be in the future."                                     |
| Maximum keys reached| "You have reached the maximum number of API keys (10). Delete one first."|

**Business Rules:**
- Maximum 10 active API keys per tenant.
- API key is displayed once at creation; stored as bcrypt hash.
- Keys can be revoked at any time (immediate effect).
- Expiry dates cannot exceed 365 days from creation.
- Permissions follow principle of least privilege; viewers cannot generate keys.
- Audit log records all key creation, usage, and revocation events.

**Accessibility:**
- API key display after creation has a "Copy to clipboard" button with `aria-label="Copy API key"`.
- Confirmation toast: "API key copied to clipboard" via `aria-live="polite"`.
- Permissions checkboxes grouped with `role="group"` and `aria-labelledby`.
- Warning banner for long-lived keys: "Keys with expiry over 90 days are flagged for review."

**Keyboard Navigation:**
- `Tab` order: Name, Permissions (each checkbox), Expiry, Generate.
- `Space` toggles checkboxes.
- `Enter` submits the form.
- After generation, focus moves to the displayed key with copy button.
