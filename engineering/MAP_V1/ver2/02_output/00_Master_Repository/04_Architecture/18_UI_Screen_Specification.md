# UI Screen Specification

**Document:** MAP MVP UI Screen Specification
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

This document defines every application screen for the MAP MVP, including purpose, navigation, components, inputs, outputs, permissions, error handling, responsive behavior, accessibility, and future enhancements.

---

## Screen 1: Login

### Purpose
Authenticate users via Microsoft Entra ID SSO and establish a secure session.

### Navigation
- **From:** Direct URL access, protected route redirect
- **To:** Dashboard (on successful login)

### Components
- `LoginPage` - Main login container
- `SSOButton` - Microsoft Entra ID login button
- `LoadingSpinner` - Authentication in progress indicator
- `ErrorDisplay` - Authentication error messages
- `Logo` - MAP application logo

### Inputs
- SSO button click (triggers Entra ID redirect)
- Return URL parameter (for post-login redirect)

### Outputs
- JWT access token (stored in memory)
- Refresh token (stored in httpOnly cookie)
- User session data (stored in auth context)

### Permissions
- Public - No authentication required

### Error Handling
- Display "Authentication failed" with retry button
- Handle network errors with offline message
- Handle token expiration with re-authentication prompt
- Log authentication failures to Application Insights

### Responsive Behavior
- Centered card layout on all screen sizes
- Full-width on mobile with minimal padding
- Logo scales appropriately

### Accessibility (WCAG 2.1 AA)
- Screen reader: "MAP Login - Click to sign in with Microsoft"
- Keyboard: Tab to SSO button, Enter to activate
- Focus visible on SSO button
- Color contrast ratio ≥ 4.5:1 for text

### Future Enhancements
- Multi-factor authentication prompt
- Remember device option
- Login history display
- Alternative SSO providers (Google, GitHub)

---

## Screen 2: Dashboard

### Purpose
Provide executive overview of migration status, resource inventory, and key metrics.

### Navigation
- **From:** Login, any page (via sidebar)
- **To:** Resource Inventory, Migration List, Findings List, Reports, AI Insights

### Components
- `DashboardPage` - Main dashboard layout
- `MigrationStatusWidget` - Migration progress summary
- `ResourceInventoryChart` - Resource type distribution
- `FindingsSeverityChart` - Findings by severity
- `ComplianceScoreGauge` - Overall compliance score
- `RecentActivityFeed` - Latest platform activity
- `QuickActionsPanel` - Common action shortcuts
- `MetricCard` - Individual metric display

### Inputs
- Time range selector (7d, 30d, 90d, custom)
- Refresh button
- Widget configuration (drag to reorder)

### Outputs
- Total resources discovered
- Migration completion percentage
- Critical findings count
- Compliance score percentage
- Resource type breakdown chart
- Severity distribution chart
- Recent activity timeline

### Permissions
- Viewer: Read-only access
- Migrator: Read + initiate migrations
- Admin: Full access including settings

### Error Handling
- Display "Unable to load dashboard data" with retry
- Show placeholder widgets during loading
- Handle partial data availability gracefully
- Log dashboard load failures

### Responsive Behavior
- 4-column grid on desktop
- 2-column grid on tablet
- Single column on mobile
- Widgets stack vertically on small screens
- Charts resize to fit container

### Accessibility (WCAG 2.1 AA)
- Headings hierarchy: h1 for page title, h2 for widgets
- Charts have text alternatives
- Keyboard navigation between widgets
- Screen reader: "Dashboard - Migration status: 75% complete"
- Focus management for interactive widgets

### Future Enhancements
- Customizable widget layout
- Real-time auto-refresh
- Export dashboard as PDF
- Dashboard sharing
- Custom date range with comparison

---

## Screen 3: Resource Inventory

### Purpose
List, filter, search, and manage all Azure resources across connected subscriptions.

### Navigation
- **From:** Dashboard, sidebar
- **To:** Resource Detail, Migration Create, Scan Resources

### Components
- `ResourceInventoryPage` - Main page layout
- `ResourceFilters` - Advanced filter panel
- `ResourceDataGrid` - Sortable/filterable data table
- `ResourceSearchBar` - Full-text search input
- `ResourceTypeFilter` - Resource type checkboxes
- `StatusFilter` - Resource status filter
- `SubscriptionFilter` - Subscription selector
- `BulkActionBar` - Bulk action toolbar
- `ResourceCountBadge` - Total resource count

### Inputs
- Search text input
- Resource type filter (multi-select)
- Status filter (dropdown)
- Subscription filter (dropdown)
- Sort column and direction
- Pagination controls
- Bulk selection checkboxes

### Outputs
- Resource list with columns: Name, Type, Status, Subscription, Location, Tags
- Total resource count
- Filtered resource count
- Selected resource count
- Resource type summary

### Permissions
- Viewer: Read-only
- Migrator: Read + select for migration
- Admin: Read + delete + manage

### Error Handling
- Display "No resources found" for empty results
- Show "Scan required" message if no resources discovered
- Handle API errors with retry button
- Display partial results if some subscriptions fail

### Responsive Behavior
- Full data table on desktop
- Card-based layout on tablet
- Simplified list on mobile
- Horizontal scroll for table on small screens
- Filter panel collapses on mobile

### Accessibility (WCAG 2.1 AA)
- Table headers with scope attributes
- Sort buttons with aria-sort
- Screen reader: "Resource list - 150 resources found"
- Keyboard: Navigate rows with arrow keys
- Bulk select with Ctrl+Space

### Future Enhancements
- Resource group view
- Resource map visualization
- Resource cost estimation
- Resource health status
- Resource tagging workflows

---

## Screen 4: Resource Detail

### Purpose
Display detailed information about a single Azure resource including configuration, dependencies, and migration readiness.

### Navigation
- **From:** Resource Inventory (click resource row)
- **To:** Resource Inventory (back), Migration Create (add to migration)

### Components
- `ResourceDetailPage` - Main detail layout
- `ResourceHeader` - Resource name, type, status
- `ResourceProperties` - Configuration properties table
- `ResourceDependencies` - Dependency graph visualization
- `ResourceMetrics` - Performance metrics chart
- `ResourceTags` - Tag list with edit capability
- `ResourceHistory` - Activity history timeline
- `MigrationReadiness` - Migration readiness assessment
- `ActionPanel` - Available actions (edit tags, start migration)

### Inputs
- Resource ID (from URL parameter)
- Edit tags button
- Start migration button
- Refresh button
- Back navigation

### Outputs
- Resource name and type
- Resource status and health
- Configuration properties
- Dependencies list
- Performance metrics
- Tags
- Migration readiness score
- Recommended migration actions

### Permissions
- Viewer: Read-only
- Migrator: Read + start migration
- Admin: Read + edit + delete

### Error Handling
- Display "Resource not found" with back button
- Show "Unable to load resource details" with retry
- Handle stale data with refresh prompt
- Log resource access failures

### Responsive Behavior
- Two-column layout on desktop (properties + graph)
- Single column on tablet and mobile
- Properties table scrolls horizontally on mobile
- Graph becomes list on small screens

### Accessibility (WCAG 2.1 AA)
- Heading hierarchy for sections
- Properties table with proper headers
- Dependency graph has text alternative
- Screen reader: "Resource: WebApp-prod, Type: App Service, Status: Running"
- Keyboard navigation for all sections

### Future Enhancements
- Resource cost details
- Resource performance trends
- Resource comparison view
- Resource edit capability
- Resource export

---

## Screen 5: Migration List

### Purpose
Display all migration projects with status, progress, and quick actions.

### Navigation
- **From:** Dashboard, sidebar
- **To:** Migration Detail, Migration Create, Validation Run

### Components
- `MigrationListPage` - Main page layout
- `MigrationDataGrid` - Sortable data table
- `MigrationFilters` - Filter panel
- `MigrationStatusBadge` - Status indicator
- `MigrationProgressBar` - Progress indicator
- `CreateMigrationButton` - Create new migration
- `MigrationActions` - Quick action menu

### Inputs
- Status filter (dropdown)
- Date range filter
- Subscription filter
- Search input
- Sort controls
- Pagination

### Outputs
- Migration list with: Name, Status, Progress, Resources, Created, Updated
- Total migration count
- Status summary (draft, in-progress, completed, failed)
- Filtered migration count

### Permissions
- Viewer: Read-only
- Migrator: Read + create + edit
- Admin: Full access

### Error Handling
- Display "No migrations found" with create button
- Handle API errors with retry
- Show "In progress" status for running migrations
- Display partial data for mixed-status migrations

### Responsive Behavior
- Full table on desktop
- Card layout on tablet
- Simplified list on mobile
- Status badges remain visible on all sizes

### Accessibility (WCAG 2.1 AA)
- Table headers with scope
- Status badges have aria-label
- Screen reader: "Migration: ERP Upgrade, Status: In Progress, 75% complete"
- Keyboard navigation between rows

### Future Enhancements
- Migration templates
- Bulk migration operations
- Migration comparison view
- Migration scheduling
- Migration cost estimation

---

## Screen 6: Migration Detail

### Purpose
Display detailed information about a single migration including phases, validation status, and findings.

### Navigation
- **From:** Migration List (click migration row)
- **To:** Migration List (back), Validation Run, Findings List, Reports

### Components
- `MigrationDetailPage` - Main detail layout
- `MigrationHeader` - Name, status, dates
- `MigrationTimeline` - Phase progress timeline
- `MigrationResources` - Resource list for migration
- `MigrationValidations` - Validation runs summary
- `MigrationFindings` - Key findings list
- `MigrationActions` - Action buttons
- `MigrationNotes` - Notes and comments

### Inputs
- Migration ID (from URL parameter)
- Phase action buttons (start, complete, rollback)
- Add resources button
- Run validation button
- Edit migration button
- Delete migration button

### Outputs
- Migration name and description
- Current phase and status
- Phase timeline with completion dates
- Resource count and list
- Validation summary (passed, failed, warnings)
- Key findings summary
- Migration duration

### Permissions
- Viewer: Read-only
- Migrator: Read + manage phases
- Admin: Full access including delete

### Error Handling
- Display "Migration not found" with back button
- Handle phase action failures with retry
- Show "Phase locked" for dependent phases
- Display validation errors inline

### Responsive Behavior
- Two-column layout on desktop
- Single column on tablet and mobile
- Timeline becomes vertical on mobile
- Actions menu collapses to icon on mobile

### Accessibility (WCAG 2.1 AA)
- Timeline has semantic list structure
- Phase status announced to screen readers
- Keyboard navigation for phase actions
- Focus management for modals

### Future Enhancements
- Migration rollback capability
- Migration comparison with previous runs
- Migration cost tracking
- Migration approval workflow
- Migration export

---

## Screen 7: Validation Run

### Purpose
Execute validation checks against migration resources and display real-time results.

### Navigation
- **From:** Migration Detail (run validation button)
- **To:** Migration Detail (back), Findings List (view all findings)

### Components
- `ValidationRunPage` - Main page layout
- `ValidationProgress` - Real-time progress indicator
- `ValidationRulesList` - List of validation rules being executed
- `ValidationResultsSummary` - Pass/Fail/Warning counts
- `ValidationFindingsList` - Findings from validation
- `ValidationTimeline` - Execution timeline
- `ValidationActions` - Export, rerun, view details

### Inputs
- Validation ID (from URL parameter)
- Start validation button
- Cancel validation button
- Export results button
- View findings button

### Outputs
- Validation run status (running, completed, failed)
- Progress percentage
- Rule execution status (pending, running, passed, failed, skipped)
- Results summary (total, passed, failed, warnings)
- Findings list with severity
- Execution duration

### Permissions
- Viewer: Read-only
- Migrator: Read + execute validation
- Admin: Full access

### Error Handling
- Handle validation timeout with retry
- Display partial results for interrupted validations
- Show "Validation failed" with error details
- Handle network disconnection gracefully

### Responsive Behavior
- Full layout on desktop
- Simplified progress view on tablet
- Status-focused view on mobile
- Results list scrolls on mobile

### Accessibility (WCAG 2.1 AA)
- Progress announced to screen readers
- Rule status has aria-live region
- Screen reader: "Validation: 75% complete - 15 of 20 rules passed"
- Keyboard navigation for results

### Future Enhancements
- Custom validation rule creation
- Validation scheduling
- Validation comparison
- Validation templates
- Validation API integration

---

## Screen 8: Findings List

### Purpose
Display all validation findings with filtering, sorting, and management capabilities.

### Navigation
- **From:** Dashboard, Validation Run, Migration Detail, sidebar
- **To:** Finding Detail, Validation Run, Migration Detail

### Components
- `FindingsListPage` - Main page layout
- `FindingsDataGrid` - Sortable data table
- `FindingsFilters` - Filter panel
- `SeverityFilter` - Severity level filter
- `CategoryFilter` - Finding category filter
- `StatusFilter` - Finding status filter
- `BulkActionBar` - Bulk action toolbar
- `FindingsSummary` - Summary statistics

### Inputs
- Severity filter (Critical, High, Medium, Low, Info)
- Category filter (Security, Performance, Cost, Compliance)
- Status filter (Open, In Progress, Resolved, Dismissed)
- Search input
- Sort controls
- Bulk selection checkboxes
- Status update dropdown

### Outputs
- Findings list with: Title, Severity, Category, Status, Resource, Migration
- Total findings count
- Severity summary
- Category summary
- Status summary

### Permissions
- Viewer: Read-only
- Migrator: Read + update status
- Admin: Full access including bulk operations

### Error Handling
- Display "No findings" with positive message
- Handle API errors with retry
- Show "Filters applied" for narrowed results
- Display partial results gracefully

### Responsive Behavior
- Full table on desktop
- Card layout on tablet
- Simplified list on mobile
- Severity colors visible on all sizes

### Accessibility (WCAG 2.1 AA)
- Table headers with scope
- Severity badges have aria-label
- Screen reader: "Finding: SSL certificate expired, Severity: Critical, Status: Open"
- Keyboard navigation for bulk operations

### Future Enhancements
- Finding trends over time
- Finding assignment to team members
- Finding notes and comments
- Finding export to issue tracker
- Finding grouping and deduplication

---

## Screen 9: Finding Detail

### Purpose
Display detailed information about a single finding including recommendation, impact, and remediation steps.

### Navigation
- **From:** Findings List (click finding row)
- **To:** Findings List (back), Resource Detail (view resource), Migration Detail (view migration)

### Components
- `FindingDetailPage` - Main detail layout
- `FindingHeader` - Title, severity, status
- `FindingDescription` - Detailed description
- `FindingImpact` - Impact assessment
- `FindingRecommendation` - AI-powered recommendation
- `FindingRemediation` - Step-by-step remediation
- `FindingResources` - Affected resources list
- `FindingHistory` - Status change history
- `FindingActions` - Status update, dismiss, escalate

### Inputs
- Finding ID (from URL parameter)
- Status update dropdown
- Add note button
- Dismiss button
- Escalate button
- View resource button
- View migration button

### Outputs
- Finding title and description
- Severity and category
- Current status
- Impact assessment
- AI-generated recommendation
- Remediation steps
- Affected resources
- Status history

### Permissions
- Viewer: Read-only
- Migrator: Read + update status + add notes
- Admin: Full access including dismiss/escalate

### Error Handling
- Display "Finding not found" with back button
- Handle AI recommendation generation failure
- Show "Recommendation pending" for processing states
- Display error for status update failures

### Responsive Behavior
- Two-column layout on desktop (details + recommendation)
- Single column on tablet and mobile
- Recommendation card stacks below details on mobile
- Actions bar fixed at bottom on mobile

### Accessibility (WCAG 2.1 AA)
- Heading hierarchy for sections
- Severity badge has aria-label
- Screen reader: "Finding: SSL certificate expired, Severity: Critical"
- Keyboard navigation for actions
- Focus management for status update

### Future Enhancements
- Finding comparison with similar findings
- Finding resolution tracking
- Finding impact scoring
- Finding auto-remediation
- Finding integration with ticketing systems

---

## Screen 10: Reports

### Purpose
Generate, manage, and download migration validation reports.

### Navigation
- **From:** Dashboard, Migration Detail, sidebar
- **To:** Report generation, Report download, Migration Detail

### Components
- `ReportsPage` - Main page layout
- `ReportList` - Generated reports list
- `ReportGenerator` - Report generation wizard
- `ReportTemplates` - Available report templates
- `ReportPreview` - Report preview modal
- `ReportDownload` - Download options
- `ReportSchedule` - Scheduled report configuration

### Inputs
- Report type selection (Migration Summary, Validation Detail, Compliance, Executive)
- Date range selection
- Migration selection
- Format selection (PDF, Excel, CSV)
- Generate button
- Download button
- Schedule button

### Outputs
- Report list with: Name, Type, Generated Date, Status, Size
- Report generation status
- Download URL
- Report preview
- Scheduled report configuration

### Permissions
- Viewer: Read-only + download own reports
- Migrator: Read + generate reports
- Admin: Full access including schedule

### Error Handling
- Display "No reports generated" with create button
- Handle report generation failure with retry
- Show "Report processing" for large reports
- Handle download failures with retry

### Responsive Behavior
- Full layout on desktop
- Simplified list on tablet
- Generate button prominent on mobile
- Downloads accessible via file manager

### Accessibility (WCAG 2.1 AA)
- Report list has proper table structure
- Download links have descriptive text
- Screen reader: "Report: Migration Summary, Generated: June 15, 2026"
- Keyboard navigation for report actions

### Future Enhancements
- Report customization
- Report sharing
- Report templates
- Automated report delivery
- Report analytics

---

## Screen 11: Policies

### Purpose
Manage migration policies, rules, and compliance requirements.

### Navigation
- **From:** Dashboard, sidebar
- **To:** Policy Detail, Policy Create, Validation Run

### Components
- `PoliciesPage` - Main page layout
- `PolicyList` - Policy cards list
- `PolicyFilters` - Filter panel
- `PolicyStatusBadge` - Compliance status indicator
- `PolicyActions` - Create, edit, delete buttons
- `PolicySearch` - Search input

### Inputs
- Policy status filter (Active, Inactive, Draft)
- Category filter (Security, Performance, Cost, Compliance)
- Search input
- Create policy button
- Edit policy button
- Delete policy button

### Outputs
- Policy list with: Name, Description, Status, Rules Count, Compliance %
- Total policy count
- Active policy count
- Compliance summary

### Permissions
- Viewer: Read-only
- Migrator: Read + view details
- Admin: Full access including create/edit/delete

### Error Handling
- Display "No policies configured" with create button
- Handle API errors with retry
- Show "Policy validation failed" for invalid configurations
- Display partial results gracefully

### Responsive Behavior
- Grid layout on desktop (3 columns)
- 2-column grid on tablet
- Single column on mobile
- Policy cards stack vertically

### Accessibility (WCAG 2.1 AA)
- Policy cards have proper heading structure
- Status badges have aria-label
- Screen reader: "Policy: SSL Required, Status: Active, Compliance: 95%"
- Keyboard navigation for policy actions

### Future Enhancements
- Policy templates
- Policy versioning
- Policy approval workflow
- Policy impact analysis
- Policy export/import

---

## Screen 12: Policy Detail

### Purpose
Display detailed policy information including rules, compliance status, and affected resources.

### Navigation
- **From:** Policies List (click policy card)
- **To:** Policies List (back), Resource Detail (view affected resources)

### Components
- `PolicyDetailPage` - Main detail layout
- `PolicyHeader` - Name, description, status
- `PolicyRules` - Rules list with conditions
- `PolicyCompliance` - Compliance score and trends
- `PolicyResources` - Affected resources list
- `PolicyHistory` - Policy change history
- `PolicyActions` - Edit, enable/disable, delete

### Inputs
- Policy ID (from URL parameter)
- Edit policy button
- Enable/disable toggle
- Add rule button
- Remove rule button
- View resources button

### Outputs
- Policy name and description
- Policy status (active/inactive)
- Rules list with conditions and actions
- Compliance score percentage
- Compliance trend chart
- Affected resources count
- Policy change history

### Permissions
- Viewer: Read-only
- Migrator: Read + view rules
- Admin: Full access including edit

### Error Handling
- Display "Policy not found" with back button
- Handle rule validation errors inline
- Show "Policy disabled" warning
- Display compliance calculation errors

### Responsive Behavior
- Two-column layout on desktop
- Single column on tablet and mobile
- Rules list becomes card layout on mobile
- Actions bar fixed at bottom on mobile

### Accessibility (WCAG 2.1 AA)
- Rule conditions have semantic structure
- Compliance score announced to screen readers
- Screen reader: "Policy: SSL Required, Compliance: 95%"
- Keyboard navigation for rule management

### Future Enhancements
- Policy rule testing
- Policy simulation
- Policy comparison
- Policy versioning
- Policy documentation

---

## Screen 13: AI Insights

### Purpose
Provide AI-powered assistance for migration planning, validation, and optimization.

### Navigation
- **From:** Dashboard, Migration Detail, Finding Detail, sidebar
- **To:** Any relevant page (context-aware navigation)

### Components
- `AIInsightsPage` - Main page layout
- `AIChatInterface` - Chat input and response area
- `AIRecommendationCards` - Pre-built recommendation cards
- `AIQueryHistory` - Previous queries list
- `AIContextPanel` - Current context display
- `AIFeedback` - Response feedback buttons

### Inputs
- Chat text input
- Recommendation card selection
- Context selector (migration, resource, finding)
- Feedback buttons (helpful/not helpful)
- Clear conversation button
- Export conversation button

### Outputs
- AI-generated responses
- Recommendation cards with actions
- Query history
- Context-aware suggestions
- Confidence scores
- Related resources

### Permissions
- Viewer: Read-only + query
- Migrator: Read + query + execute recommendations
- Admin: Full access including configuration

### Error Handling
- Display "AI service unavailable" with retry
- Handle rate limiting with queue message
- Show "Query too long" for input limits
- Handle context errors gracefully

### Responsive Behavior
- Full chat interface on desktop
- Simplified chat on tablet
- Mobile-optimized input on mobile
- Recommendations stack vertically on mobile

### Accessibility (WCAG 2.1 AA)
- Chat messages have proper structure
- Recommendations have descriptive labels
- Screen reader: "AI Recommendation: Consider resizing VM to reduce costs"
- Keyboard navigation for chat and recommendations

### Future Enhancements
- Voice input
- Multi-language support
- AI learning from feedback
- Custom AI models
- AI integration with external tools

---

## Screen 14: Settings

### Purpose
Manage application settings, user preferences, and tenant configuration.

### Navigation
- **From:** Dashboard, sidebar (admin only)
- **To:** User Management, Audit Log

### Components
- `SettingsPage` - Main settings layout with tabs
- `GeneralSettings` - Application name, logo, timezone
- `NotificationSettings` - Email and in-app notifications
- `IntegrationSettings` - Azure, AI, and external integrations
- `SecuritySettings` - Security policies and configurations
- `DisplaySettings` - Theme, language, accessibility options

### Inputs
- Application name input
- Logo upload
- Timezone selector
- Notification toggles
- Integration configuration fields
- Security policy toggles
- Theme selector
- Language selector
- Save button

### Outputs
- Current settings display
- Save confirmation
- Settings validation results
- Integration status indicators

### Permissions
- Admin only

### Error Handling
- Display "Settings load failed" with retry
- Handle save failures with retry
- Show "Invalid configuration" for validation errors
- Display integration connection failures

### Responsive Behavior
- Tabbed layout on desktop
- Accordion layout on tablet
- Single column on mobile
- Save button fixed at bottom on mobile

### Accessibility (WCAG 2.1 AA)
- Tabs have proper ARIA roles
- Form fields have labels
- Screen reader: "Settings - General tab selected"
- Keyboard navigation for tabs and forms

### Future Enhancements
- Settings import/export
- Settings versioning
- Settings templates
- Settings audit trail
- Settings API

---

## Screen 15: User Management

### Purpose
Manage user accounts, roles, and permissions within the tenant.

### Navigation
- **From:** Settings, sidebar (admin only)
- **To:** User Detail, Settings

### Components
- `UserManagementPage` - Main page layout
- `UserList` - User data table
- `UserFilters` - Filter panel
- `UserRoleSelector` - Role assignment dropdown
- `UserInviteModal` - Invite new user modal
- `UserActions` - Edit, disable, remove actions

### Inputs
- User search input
- Role filter (Admin, Migrator, Viewer)
- Status filter (Active, Inactive, Pending)
- Invite user button
- Edit user button
- Disable user button
- Remove user button

### Outputs
- User list with: Name, Email, Role, Status, Last Active
- Total user count
- Role distribution
- Invitation status

### Permissions
- Admin only

### Error Handling
- Display "No users found" message
- Handle invite failures with retry
- Show "User not found" for invalid users
- Display role change failures

### Responsive Behavior
- Full table on desktop
- Card layout on tablet
- Simplified list on mobile
- Actions menu on mobile

### Accessibility (WCAG 2.1 AA)
- Table headers with scope
- Role badges have aria-label
- Screen reader: "User: John Doe, Role: Migrator, Status: Active"
- Keyboard navigation for user actions

### Future Enhancements
- User groups
- Bulk user operations
- User activity tracking
- User access reviews
- User provisioning integration

---

## Screen 16: Audit Log

### Purpose
Display complete audit trail of all user and system actions within the platform.

### Navigation
- **From:** Settings, sidebar (admin only)
- **To:** Any related entity (resource, migration, finding)

### Components
- `AuditLogPage` - Main page layout
- `AuditLogDataGrid` - Sortable data table
- `AuditLogFilters` - Filter panel
- `AuditLogDetail` - Expanded log entry view
- `AuditLogExport` - Export functionality
- `AuditLogTimeline` - Timeline visualization

### Inputs
- User filter (dropdown)
- Action filter (CRUD operations)
- Entity type filter (Resource, Migration, Finding, Policy)
- Date range filter
- Search input
- Export button
- Timeline view toggle

### Outputs
- Audit log entries with: Timestamp, User, Action, Entity, Details, IP
- Total entry count
- Action distribution
- User activity summary
- Entity change history

### Permissions
- Admin only

### Error Handling
- Display "No audit entries" message
- Handle export failures with retry
- Show "Log unavailable" for retention issues
- Display filter errors gracefully

### Responsive Behavior
- Full table on desktop
- Card layout on tablet
- Simplified list on mobile
- Timeline view on tablet/mobile

### Accessibility (WCAG 2.1 AA)
- Table headers with scope
- Timestamps have relative time
- Screen reader: "Audit Log: John Doe created Migration ERP Upgrade at 2:30 PM"
- Keyboard navigation for log entries

### Future Enhancements
- Real-time audit streaming
- Audit alerts
- Audit analytics
- Audit compliance reports
- Audit API integration

---

## Global UI Patterns

### Navigation
- **Sidebar:** Persistent left sidebar with navigation links
- **Top Bar:** User avatar, notifications bell, settings gear
- **Breadcrumbs:** Contextual navigation path
- **Back Button:** Consistent back navigation

### Loading States
- **Skeleton Loaders:** For data-heavy components
- **Spinners:** For inline loading
- **Progress Bars:** For multi-step operations
- **Optimistic Updates:** For immediate feedback

### Error States
- **Inline Errors:** For form validation
- **Toast Notifications:** For transient errors
- **Error Pages:** For 404, 500, network errors
- **Retry Mechanisms:** For recoverable errors

### Empty States
- **Illustrations:** Friendly empty state graphics
- **Call-to-Action:** Clear next steps
- **Help Text:** Contextual guidance
- **Examples:** Sample data or templates

### Modals and Dialogs
- **Confirmation Dialogs:** For destructive actions
- **Form Modals:** For quick edits
- **Detail Modals:** For preview
- **Full-page Modals:** For complex workflows

### Notifications
- **Toast Notifications:** For success/error feedback
- **In-App Notifications:** For ongoing updates
- **Notification Center:** For notification management
- **Email Notifications:** For critical events
