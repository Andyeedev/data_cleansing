import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

header_font = Font(bold=True, color="FFFFFF", size=11)
header_fill = PatternFill(start_color="2F5496", end_color="2F5496", fill_type="solid")
header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
cell_alignment = Alignment(vertical="top", wrap_text=True)
thin_border = Border(
    left=Side(style="thin"), right=Side(style="thin"),
    top=Side(style="thin"), bottom=Side(style="thin"),
)

def style_sheet(ws, headers, data, col_widths=None):
    for col_idx, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
        cell.border = thin_border
    for row_idx, row_data in enumerate(data, 2):
        for col_idx, value in enumerate(row_data, 1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value)
            cell.alignment = cell_alignment
            cell.border = thin_border
    if col_widths:
        for col_idx, width in enumerate(col_widths, 1):
            ws.column_dimensions[get_column_letter(col_idx)].width = width
    else:
        for col_idx in range(1, len(headers) + 1):
            ws.column_dimensions[get_column_letter(col_idx)].width = 25
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(data) + 1}"
    ws.freeze_panes = "A2"

# === Tab 1: Step 5 — Screen → Component Hierarchy ===
ws1 = wb.active
ws1.title = "Step 5 - Component Hierarchy"
h1 = ["Screen", "Parent Component", "Child Component", "Type", "Description"]
d1 = [
    ["DashboardPage", "DashboardPage", "ExecutiveSummaryCards", "Container", "Top-level summary cards"],
    ["DashboardPage", "ExecutiveSummaryCards", "TotalSystemsCard", "Card", "Displays total system count"],
    ["DashboardPage", "ExecutiveSummaryCards", "TotalBatchesCard", "Card", "Displays total batch count"],
    ["DashboardPage", "ExecutiveSummaryCards", "TotalControlsCard", "Card", "Displays total control count"],
    ["DashboardPage", "ExecutiveSummaryCards", "ActiveBatchesCard", "Card", "Displays active batch count"],
    ["DashboardPage", "DashboardPage", "QuickActions", "Container", "Quick action buttons"],
    ["DashboardPage", "QuickActions", "ManageSystemsButton", "Button", "Navigates to /systems"],
    ["DashboardPage", "QuickActions", "StartMigrationButton", "Button", "Navigates to /migration"],
    ["DashboardPage", "QuickActions", "ViewOperationsButton", "Button", "Navigates to /operations"],
    ["DashboardPage", "DashboardPage", "ActivityFeed", "Container", "Recent activity list"],
    ["DashboardPage", "ActivityFeed", "ActivityTable", "Table", "Displays activity entries"],
    ["DashboardPage", "ActivityFeed", "EmptyState", "State", "No recent activity message"],
    ["MigrationPage", "MigrationPage", "TabBar", "Navigation", "Execution/History tabs"],
    ["MigrationPage", "TabBar", "ExecutionTab", "Tab", "Execution form and progress"],
    ["MigrationPage", "TabBar", "HistoryTab", "Tab", "Batch execution history"],
    ["MigrationPage", "ExecutionTab", "StartMigrationForm", "Form", "Project ID input and start button"],
    ["MigrationPage", "StartMigrationForm", "ProjectIdInput", "Input", "Text input for project ID"],
    ["MigrationPage", "StartMigrationForm", "StartMigrationButton", "Button", "Starts migration execution"],
    ["MigrationPage", "ExecutionTab", "ProgressSection", "Container", "Progress display during execution"],
    ["MigrationPage", "ProgressSection", "ProgressBar", "Visual", "Progress percentage bar"],
    ["MigrationPage", "ProgressSection", "StatusBadge", "Badge", "Status color badge"],
    ["MigrationPage", "ProgressSection", "PollingIndicator", "Indicator", "Shows polling is active"],
    ["MigrationPage", "HistoryTab", "HistoryList", "List", "Batch execution history list"],
    ["MigrationPage", "HistoryTab", "Pagination", "Navigation", "Previous/Next page buttons"],
    ["MigrationPage", "HistoryTab", "EmptyState", "State", "No executions yet message"],
    ["GovernancePage", "GovernancePage", "TabBar", "Navigation", "7 governance tabs"],
    ["GovernancePage", "TabBar", "OverviewTab", "Tab", "Compliance overview cards"],
    ["GovernancePage", "TabBar", "ComplianceTab", "Tab", "Compliance details"],
    ["GovernancePage", "TabBar", "ControlsTab", "Tab", "Active controls"],
    ["GovernancePage", "TabBar", "ExceptionsTab", "Tab", "Exception list"],
    ["GovernancePage", "TabBar", "RiskTab", "Tab", "Risk assessment"],
    ["GovernancePage", "TabBar", "AuditTab", "Tab", "Audit log with search/filter"],
    ["GovernancePage", "TabBar", "ApprovalsTab", "Tab", "Pending approvals"],
    ["GovernancePage", "OverviewTab", "ComplianceCards", "Container", "Compliance score cards"],
    ["GovernancePage", "AuditTab", "SearchFilter", "Input", "Text search on audit entries"],
    ["GovernancePage", "AuditTab", "TypeFilter", "Dropdown", "Filter by entity type"],
    ["GovernancePage", "AuditTab", "AuditList", "List", "Audit entry list"],
    ["GovernancePage", "ApprovalsTab", "ApprovalList", "List", "Approval request list"],
    ["GovernancePage", "ExceptionsTab", "ExceptionList", "List", "Exception entry list"],
    ["OperationsPage", "OperationsPage", "TabBar", "Navigation", "5 operations tabs"],
    ["OperationsPage", "TabBar", "MonitoringTab", "Tab", "System health and queue"],
    ["OperationsPage", "TabBar", "AlertsTab", "Tab", "Operational alerts"],
    ["OperationsPage", "TabBar", "SchedulesTab", "Tab", "Scheduled tasks"],
    ["OperationsPage", "TabBar", "RetryTab", "Tab", "Retry queue"],
    ["OperationsPage", "TabBar", "HealthTab", "Tab", "System health details"],
    ["OperationsPage", "MonitoringTab", "SystemHealthCard", "Card", "Database and API health indicators"],
    ["OperationsPage", "MonitoringTab", "ActiveQueueCard", "Card", "Active queue items"],
    ["OperationsPage", "MonitoringTab", "RecentExecutionsCard", "Card", "Last 5 executions"],
    ["OperationsPage", "AlertsTab", "AlertList", "List", "Alert items with severity badges"],
    ["OperationsPage", "HealthTab", "HealthDetails", "Container", "Detailed health status"],
    ["NotificationsPage", "NotificationsPage", "Header", "Container", "Title and Mark All Read button"],
    ["NotificationsPage", "Header", "MarkAllReadButton", "Button", "Marks all notifications as read"],
    ["NotificationsPage", "NotificationsPage", "Filters", "Container", "Type and Read filters"],
    ["NotificationsPage", "Filters", "TypeFilter", "Dropdown", "Filter by notification type"],
    ["NotificationsPage", "Filters", "ReadFilter", "Dropdown", "Filter by read status"],
    ["NotificationsPage", "NotificationsPage", "NotificationList", "List", "Notification items"],
    ["NotificationsPage", "NotificationList", "NotificationItem", "Item", "Single notification display"],
    ["NotificationsPage", "NotificationItem", "MarkReadButton", "Button", "Marks single item as read"],
    ["NotificationsPage", "NotificationItem", "DeleteButton", "Button", "Deletes notification"],
    ["NotificationsPage", "NotificationsPage", "Pagination", "Navigation", "Previous/Next page buttons"],
    ["TaskManagementPage", "TaskManagementPage", "Header", "Container", "Title and Create Task button"],
    ["TaskManagementPage", "Header", "CreateTaskButton", "Button", "Opens create task modal"],
    ["TaskManagementPage", "TaskManagementPage", "Filters", "Container", "Status and Priority filters"],
    ["TaskManagementPage", "Filters", "StatusFilter", "Dropdown", "Filter by task status"],
    ["TaskManagementPage", "Filters", "PriorityFilter", "Dropdown", "Filter by task priority"],
    ["TaskManagementPage", "TaskManagementPage", "TaskTable", "Table", "Task list table"],
    ["TaskManagementPage", "TaskTable", "TitleLink", "Link", "Navigates to /tasks/:id"],
    ["TaskManagementPage", "TaskTable", "StatusBadge", "Badge", "Status color badge"],
    ["TaskManagementPage", "TaskTable", "PriorityBadge", "Badge", "Priority color badge"],
    ["TaskManagementPage", "TaskTable", "ViewButton", "Button", "Navigates to task detail"],
    ["TaskManagementPage", "TaskTable", "DeleteButton", "Button", "Deletes task with confirm"],
    ["TaskManagementPage", "TaskManagementPage", "Pagination", "Navigation", "Previous/Next page buttons"],
    ["TaskManagementPage", "TaskManagementPage", "CreateTaskModal", "Modal", "Create task form modal"],
    ["TaskManagementPage", "CreateTaskModal", "TitleInput", "Input", "Required task title"],
    ["TaskManagementPage", "CreateTaskModal", "DescriptionTextarea", "Input", "Optional task description"],
    ["TaskManagementPage", "CreateTaskModal", "PrioritySelect", "Select", "Low/Medium/High priority"],
    ["TaskManagementPage", "CreateTaskModal", "AssignedToInput", "Input", "Optional user ID"],
    ["TaskManagementPage", "CreateTaskModal", "ModalActions", "Container", "Cancel and Create buttons"],
]
style_sheet(ws1, h1, d1, [22, 22, 22, 15, 35])

# === Tab 2: Step 6 — UX Behaviour ===
ws2 = wb.create_sheet("Step 6 - UX Behaviour")
h2 = ["Screen", "Component", "Behaviour", "Detail"]
d2 = [
    ["Dashboard", "ExecutiveSummaryCards", "Loads automatically", "On page mount via GET /dashboard/portfolio"],
    ["Dashboard", "ExecutiveSummaryCards", "Refresh", "Manual (no auto-refresh)"],
    ["Dashboard", "ExecutiveSummaryCards", "Empty state", "Show — dash placeholders"],
    ["Dashboard", "ExecutiveSummaryCards", "Loading state", "Skeleton loader"],
    ["Dashboard", "ActivityFeed", "Loads automatically", "On page mount via GET /dashboard/activity?limit=5 (executive roles only)"],
    ["Dashboard", "ActivityFeed", "Refresh", "Manual (no auto-refresh)"],
    ["Dashboard", "ActivityFeed", "Empty state", "No recent activity message"],
    ["Dashboard", "QuickActions", "Role-based visibility", "Manage Systems visible to admin, Start Migration visible to admin/manager"],
    ["Dashboard", "QuickActions", "Navigation", "Click navigates to target page"],
    ["Migration", "TabBar", "Switch tabs", "Execution/History tabs (state only)"],
    ["Migration", "StartMigrationForm", "Input validation", "Project ID required (defaults to default)"],
    ["Migration", "StartMigrationForm", "Button disabled during execution", "Disabled when running or polling"],
    ["Migration", "StartMigrationForm", "Button text changes", "Start Migration → Starting... → Migration Running..."],
    ["Migration", "ProgressSection", "Auto-polling", "Polls GET /execution/status/:batchId every 2 seconds"],
    ["Migration", "ProgressSection", "Progress bar", "Shows percentage based on completed/total controls"],
    ["Migration", "ProgressSection", "Status badge", "Color-coded: COMPLETED (green), RUNNING (blue), FAILED (red)"],
    ["Migration", "ProgressSection", "Polling indicator", "Shows spinner + Polling for updates..."],
    ["Migration", "HistoryTab", "Loads on tab switch", "Fetches history on tab change"],
    ["Migration", "HistoryTab", "Pagination", "Previous/Next buttons, page indicator"],
    ["Migration", "HistoryTab", "Empty state", "No executions yet message"],
    ["Governance", "TabBar", "URL-driven routing", "/governance/overview, /governance/compliance, etc."],
    ["Governance", "ComplianceCards", "Loads automatically", "On tab mount via GET /governance/compliance"],
    ["Governance", "ComplianceCards", "Empty state", "— dash placeholders"],
    ["Governance", "AuditTab", "Loads on tab switch", "Fetches audit entries via GET /governance/audit?limit=50"],
    ["Governance", "AuditTab", "Search", "Text filter on action, entity_type, user_email"],
    ["Governance", "AuditTab", "Type filter", "Dropdown: All Types, Migration Batch, System, Rule"],
    ["Governance", "AuditTab", "Empty state", "No audit entries found"],
    ["Governance", "ApprovalsTab", "Loads on tab switch", "Fetches approvals via GET /governance/approvals"],
    ["Governance", "ApprovalsTab", "Empty state", "No pending approvals"],
    ["Governance", "ApprovalsTab", "Status badge", "Color-coded status display"],
    ["Governance", "ExceptionsTab", "Loads on tab switch", "Fetches exceptions via GET /governance/exceptions"],
    ["Governance", "ExceptionsTab", "Empty state", "No active exceptions"],
    ["Governance", "RiskTab", "Empty state", "No risk data available (B-07 blocked)"],
    ["Operations", "MonitoringTab", "Loads on tab switch", "Fetches health, monitoring, and execution history"],
    ["Operations", "SystemHealthCard", "Health indicators", "Green/red dots for Database and API"],
    ["Operations", "ActiveQueueCard", "Empty state", "No active items in queue"],
    ["Operations", "RecentExecutionsCard", "Shows last 5", "Sliced from execution history"],
    ["Operations", "AlertsTab", "Loads on tab switch", "Fetches alerts via GET /monitoring/alerts"],
    ["Operations", "AlertsTab", "Severity badges", "Color-coded: critical (red), warning (yellow), info (blue)"],
    ["Operations", "AlertsTab", "Empty state", "No active alerts"],
    ["Operations", "HealthTab", "Loads on tab switch", "Fetches health via GET /monitoring/health"],
    ["Operations", "HealthTab", "Status display", "Healthy/Unhealthy for each component"],
    ["Notifications", "Header", "Mark All Read", "Button calls PUT /notifications/read-all, then refetches"],
    ["Notifications", "Header", "Button text changes", "Mark All as Read → Marking... during operation"],
    ["Notifications", "Filters", "Type filter", "Dropdown: All Types, Info, Success, Warning, Error"],
    ["Notifications", "Filters", "Read filter", "Dropdown: All Status, Unread, Read"],
    ["Notifications", "Filters", "Reset page on filter change", "Page resets to 1 when filter changes"],
    ["Notifications", "NotificationList", "Unread indicator", "Bold title + blue dot for unread items"],
    ["Notifications", "NotificationList", "Background color", "Light blue background for unread items"],
    ["Notifications", "NotificationList", "Mark Read button", "Only shown for unread items"],
    ["Notifications", "NotificationList", "Delete button", "Shows confirm dialog, calls DELETE /notifications/:id"],
    ["Notifications", "NotificationList", "Type icon", "Info (i), Success (check), Warning (warning), Error (x), Default (bell)"],
    ["Notifications", "Pagination", "20 items per page", "Previous/Next buttons"],
    ["Notifications", "Empty state", "Filter-aware", "Try different filters if filters active"],
    ["Tasks", "Header", "Create Task button", "Opens create modal"],
    ["Tasks", "Filters", "Status filter", "Dropdown: All Status, Pending, In Progress, Done, Blocked"],
    ["Tasks", "Filters", "Priority filter", "Dropdown: All Priority, High, Medium, Low"],
    ["Tasks", "Filters", "Reset page on filter change", "Page resets to 1 when filter changes"],
    ["Tasks", "TaskTable", "Title link", "Click navigates to /tasks/:id"],
    ["Tasks", "TaskTable", "Status badge", "Color-coded: done (green), in_progress (blue), pending (yellow), blocked (red)"],
    ["Tasks", "TaskTable", "Priority badge", "Color-coded: high (red), medium (yellow), low (green)"],
    ["Tasks", "TaskTable", "Delete button", "Shows confirm dialog, calls DELETE /tasks/:id"],
    ["Tasks", "Pagination", "20 items per page", "Previous/Next buttons"],
    ["Tasks", "Empty state", "Filter-aware", "Try different filters if filters active"],
    ["Tasks", "CreateTaskModal", "Title input", "Required field"],
    ["Tasks", "CreateTaskModal", "Description textarea", "Optional field"],
    ["Tasks", "CreateTaskModal", "Priority select", "Low, Medium (default), High"],
    ["Tasks", "CreateTaskModal", "Assigned To input", "Optional field (user ID)"],
    ["Tasks", "CreateTaskModal", "Submit button", "Disabled when creating or title empty"],
]
style_sheet(ws2, h2, d2, [18, 25, 30, 55])

# === Tab 3: Step 7 — Permissions Matrix ===
ws3 = wb.create_sheet("Step 7 - Permissions Matrix")
h3 = ["Screen", "Feature", "Super Admin", "Tenant Admin", "Operator", "Viewer", "API Called"]
d3 = [
    ["Dashboard", "View Executive Summary", "✅", "✅", "✅", "✅", "GET /dashboard/portfolio"],
    ["Dashboard", "View Activity Feed", "✅", "✅", "✅", "❌", "GET /dashboard/activity"],
    ["Dashboard", "Quick Actions - Manage Systems", "✅", "❌", "❌", "❌", "N/A (navigation)"],
    ["Dashboard", "Quick Actions - Start Migration", "✅", "✅", "❌", "❌", "N/A (navigation)"],
    ["Dashboard", "Quick Actions - View Operations", "✅", "✅", "✅", "✅", "N/A (navigation)"],
    ["Migration", "View Migration Page", "✅", "✅", "❌", "❌", "N/A"],
    ["Migration", "Start Migration", "✅", "✅", "❌", "❌", "POST /execution/run"],
    ["Migration", "View Progress", "✅", "✅", "❌", "❌", "GET /execution/status/:batchId"],
    ["Migration", "View History", "✅", "✅", "❌", "❌", "GET /execution/history"],
    ["Governance", "View Governance Page", "✅", "✅", "✅", "❌", "N/A"],
    ["Governance", "View Compliance", "✅", "✅", "✅", "❌", "GET /governance/compliance"],
    ["Governance", "View Audit Log", "✅", "✅", "✅", "❌", "GET /governance/audit"],
    ["Governance", "View Approvals", "✅", "✅", "❌", "❌", "GET /governance/approvals"],
    ["Governance", "Approve/Reject", "✅", "❌", "❌", "❌", "PUT /governance/approvals/:id"],
    ["Governance", "View Exceptions", "✅", "✅", "✅", "❌", "GET /governance/exceptions"],
    ["Operations", "View Operations Page", "✅", "✅", "✅", "❌", "N/A"],
    ["Operations", "View Monitoring", "✅", "✅", "✅", "❌", "GET /monitoring/*"],
    ["Operations", "View Alerts", "✅", "✅", "✅", "❌", "GET /monitoring/alerts"],
    ["Operations", "View Health", "✅", "✅", "❌", "❌", "GET /monitoring/health"],
    ["Tasks", "View Tasks", "✅", "✅", "✅", "✅", "GET /tasks/"],
    ["Tasks", "Create Task", "✅", "✅", "❌", "❌", "POST /tasks/"],
    ["Tasks", "Delete Task", "✅", "✅", "❌", "❌", "DELETE /tasks/:id"],
    ["Notifications", "View Notifications", "✅", "✅", "✅", "✅", "GET /notifications/"],
    ["Notifications", "Mark Read", "✅", "✅", "✅", "✅", "PUT /notifications/:id/read"],
    ["Notifications", "Mark All Read", "✅", "✅", "✅", "✅", "PUT /notifications/read-all"],
    ["Notifications", "Delete Notification", "✅", "✅", "✅", "✅", "DELETE /notifications/:id"],
    ["Settings", "View Settings", "✅", "❌", "❌", "❌", "GET /settings/"],
    ["Settings", "Edit Setting", "✅", "❌", "❌", "❌", "PUT /settings/:category/:key"],
    ["Settings", "View Feature Flags", "✅", "❌", "❌", "❌", "GET /settings/flags/list"],
    ["Settings", "Toggle Feature Flag", "✅", "❌", "❌", "❌", "PUT /settings/flags/:key"],
    ["Users", "View Users", "✅", "❌", "❌", "❌", "GET /users/"],
    ["Users", "Create User", "✅", "❌", "❌", "❌", "POST /users/"],
    ["Users", "Edit User", "✅", "❌", "❌", "❌", "PUT /users/:id"],
    ["Users", "Delete User", "✅", "❌", "❌", "❌", "DELETE /users/:id"],
    ["Roles", "View Roles", "✅", "❌", "❌", "❌", "GET /roles/"],
    ["Roles", "Create Role", "✅", "❌", "❌", "❌", "POST /roles/"],
    ["Roles", "Edit Role", "✅", "❌", "❌", "❌", "PUT /roles/:id"],
    ["Roles", "Delete Role", "✅", "❌", "❌", "❌", "DELETE /roles/:id"],
    ["Roles", "Assign Permission", "✅", "❌", "❌", "❌", "POST /roles/:id/permissions"],
]
style_sheet(ws3, h3, d3, [18, 35, 15, 15, 12, 12, 35])

# === Tab 4: Step 8 — State Management ===
ws4 = wb.create_sheet("Step 8 - State Management")
h4 = ["Screen", "Loading", "Empty", "Partial", "Offline", "API Timeout", "Permission Denied", "No Data", "Complete", "Error"]
d4 = [
    ["Dashboard", "Skeleton loader", "— dash placeholders", "Partial cards", "Offline banner", "Retry button", "Redirect to /login", "— dash placeholders", "Full render", "Error boundary"],
    ["Migration", "Spinner", "No executions yet", "Partial history", "Offline banner", "Retry button", "Access Denied message", "No executions yet", "Full render", "Error message"],
    ["Governance", "Spinner", "Tab-specific empty states", "Partial tabs", "Offline banner", "Retry button", "Access Denied message", "No data available", "Full tabs", "Error message"],
    ["Operations", "Spinner", "Tab-specific empty states", "Partial data", "Offline banner", "Retry button", "Access Denied message", "No data", "Full render", "Error message"],
    ["Notifications", "Spinner", "No notifications", "Partial list", "Offline banner", "Retry button", "Redirect to /login", "No notifications", "Full list", "Error message"],
    ["Tasks", "Spinner", "No tasks found", "Partial table", "Offline banner", "Retry button", "Access Denied message", "No tasks found", "Full table", "Error message"],
    ["Settings", "Spinner", "No settings", "Partial settings", "Offline banner", "Retry button", "Redirect to /login", "No settings", "Full settings", "Error message"],
    ["Users", "Spinner", "No users", "Partial list", "Offline banner", "Retry button", "Redirect to /login", "No users", "Full list", "Error message"],
    ["Roles", "Spinner", "No roles", "Partial list", "Offline banner", "Retry button", "Redirect to /login", "No roles", "Full list", "Error message"],
]
style_sheet(ws4, h4, d4, [18, 15, 20, 15, 15, 15, 20, 18, 15, 15])

# === Tab 5: Step 9 — Navigation Relationships ===
ws5 = wb.create_sheet("Step 9 - Navigation Flow")
h5 = ["From Screen", "Action", "To Screen", "Trigger", "API Called"]
d5 = [
    ["Dashboard", "Quick Action", "Migration", "Start Migration button", "N/A (navigation)"],
    ["Migration", "Execute", "Execution History", "Start Migration button", "POST /execution/run"],
    ["Execution History", "View Results", "Validation Result", "Click batch", "GET /execution/:batchId/report"],
    ["Validation Result", "View Governance", "Governance Decision", "Click governance tab", "GET /execution/:batchId/governance"],
    ["Governance Decision", "View Release", "Release Gate", "Click release status", "GET /governance/approvals"],
    ["Dashboard", "Quick Action", "Operations", "View Operations button", "N/A (navigation)"],
    ["Operations", "Tab", "Alerts", "Alerts tab click", "GET /monitoring/alerts"],
    ["Alerts", "View Details", "Exception Details", "Click alert", "GET /monitoring/alerts"],
    ["Dashboard", "Quick Action", "Systems", "Manage Systems button", "N/A (navigation)"],
    ["Systems", "View System", "System Detail", "Click system", "GET /systems/:id"],
    ["System Detail", "Test Connection", "Connection Test Result", "Test Connection button", "GET /systems/:id/test"],
    ["Governance", "Tab", "Audit Log", "Audit tab click", "GET /governance/audit"],
    ["Audit Log", "Filter by Control", "Control Details", "Click control", "GET /governance/audit?entity_type=:id"],
    ["Governance", "Tab", "Approvals", "Approvals tab click", "GET /governance/approvals"],
    ["Approval List", "View Approval", "Approval Detail", "Click approval", "GET /approvals/:id"],
    ["Approval Detail", "Approve/Reject", "Approval Decision", "Click approve/reject", "PUT /approvals/:id/approve"],
    ["Tasks", "Click Task Title", "Task Detail", "Click task title", "GET /tasks/:id"],
    ["Task Detail", "Add Comment", "Comment", "Submit comment", "POST /tasks/:id/comments"],
    ["Workflows", "Execute Workflow", "Workflow Instance", "Execute button", "POST /workflows/:id/execute"],
    ["Workflow Instance", "Requires Approval", "Approval Request", "Auto-trigger", "POST /approvals/"],
]
style_sheet(ws5, h5, d5, [20, 18, 22, 25, 35])

# === Tab 6: Step 10 — Entity Relationships ===
ws6 = wb.create_sheet("Step 10 - Entity Relationships")
h6 = ["Parent Entity", "Relationship", "Child Entity", "Foreign Key", "Description"]
d6 = [
    ["System", "has many", "Batch", "system_id", "One system has many batch executions"],
    ["Batch", "has many", "Control Summary", "batch_id", "One batch has many control summaries"],
    ["Control Summary", "has many", "Rule Execution", "batch_id, control_id", "One control has many rule executions"],
    ["Rule Execution", "may produce", "Exception", "batch_id, control_id, rule_id", "A failed rule may produce an exception"],
    ["Exception", "triggers", "Governance Decision", "batch_id", "Exceptions trigger governance evaluation"],
    ["Governance Decision", "enforces", "Release Gate", "batch_id", "Governance decision enforces release gate"],
    ["User", "has many", "Role", "user_id", "One user has many roles (via user_roles)"],
    ["Role", "has many", "Permission", "role_id", "One role has many permissions (via role_permissions)"],
    ["Task", "has many", "Comment", "task_id", "One task has many comments"],
    ["Task", "assigned to", "User", "assigned_to", "One task is assigned to one user"],
    ["Workflow", "creates many", "Workflow Instance", "workflow_id", "One workflow creates many instances"],
    ["Workflow Instance", "has many", "Approval Request", "instance_id", "One instance may require many approvals"],
    ["Notification", "belongs to", "User", "user_id", "One notification belongs to one user"],
]
style_sheet(ws6, h6, d6, [20, 15, 22, 25, 45])

# === Tab 7: Step 11 — Restoration Confidence ===
ws7 = wb.create_sheet("Step 11 - Restoration Confidence")
h7 = ["Screen", "Frozen Exists", "Backend Exists", "Tables Ready", "API Working", "Tests Pass", "Ready to Restore"]
d7 = [
    ["Dashboard", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Migration", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Validation", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Governance", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Operations", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Tasks", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Workflows", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Notifications", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Calendar", "✅", "✅", "⚠️ 0 rows", "✅", "✅", "90%"],
    ["Approvals", "✅", "✅", "⚠️ 0 rows", "✅", "✅", "90%"],
    ["Users", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Roles", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Settings", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Systems", "✅", "✅", "✅", "✅", "✅", "100%"],
    ["Reports", "⚠️ Stub", "⚠️ Stub", "⚠️ Partial", "⚠️ Partial", "✅", "40%"],
    ["Mapping", "⚠️ Stub", "❌ No API", "❌ No tables", "❌ No", "✅", "10%"],
]
style_sheet(ws7, h7, d7, [18, 15, 15, 15, 15, 12, 18])

# === Tab 8: Extended Traceability Chain ===
ws8 = wb.create_sheet("Traceability Chain")
h8 = ["Step", "Layer", "Description", "Example"]
d8 = [
    ["1", "Workstream Policy", "Prompt from workstream", "WS02 Prompt 012 — Create Governance Portal"],
    ["2", "Frozen Screen", "Page component file", "GovernancePage.tsx"],
    ["3", "React Component", "Sub-component", "AuditTab, ComplianceCards, ApprovalList"],
    ["4", "User Interaction", "User action", "Click tab, search, filter, approve/reject"],
    ["5", "API Endpoint", "Backend API route", "GET /api/v1/governance/audit"],
    ["6", "Controller", "FastAPI route handler", "governance_routes.py:get_audit_log()"],
    ["7", "Service", "Business logic layer", "GovernanceService.get_audit_log()"],
    ["8", "Repository", "Data access layer", "GovernanceRepository.get_audit_entries()"],
    ["9", "Table", "Database table", "engine.migration_control_execution"],
    ["10", "Columns", "Table columns", "execution_status, control_id, rule_id, created_at"],
    ["11", "Business Entity", "Domain concept", "Audit Entry, Compliance Score, Approval Request"],
    ["12", "MAP CLI Capability", "CLI capability", "rule_executor.py:_log_rule_execution"],
]
style_sheet(ws8, h8, d8, [8, 22, 30, 50])

# === Tab 9: Blocked Items ===
ws9 = wb.create_sheet("Blocked Items")
h9 = ["Blocker", "Table", "Issue", "Resolution"]
d9 = [
    ["B-06", "engine.migration_batch_lifecycle", "Table does not exist", "Partial implementation using engine.batch_execution_checkpoint"],
    ["B-07", "engine.migration_risk_scores", "DDL exists but never executed", "BLOCKED per RULE 16 — investigate engine.unified_scores or defer"],
]
style_sheet(ws9, h9, d9, [12, 35, 40, 55])

# === Tab 10: Empty Tables ===
ws10 = wb.create_sheet("Empty Tables")
h10 = ["Table", "Rows", "Issue", "Recommendation"]
d10 = [
    ["platform.approval_requests", 0, "No MAP CLI data flows here", "Restore UI but flag as empty"],
    ["platform.calendar_events", 0, "No MAP CLI data flows here", "Restore UI but flag as empty"],
    ["platform.workflow_instances", 0, "No workflow executions yet", "Restore UI but flag as empty"],
    ["platform.task_comments", 0, "No comments added yet", "Restore UI but flag as empty"],
]
style_sheet(ws10, h10, d10, [30, 8, 30, 40])

# === Tab 11: Phase 09 NOT in Scope ===
ws11 = wb.create_sheet("Phase 09 NOT in Scope")
h11 = ["Component", "Reason"]
d11 = [
    ["AI Features", "No backend support"],
    ["Security Portal", "No backend support"],
    ["Tenant Management", "Platform feature, not MVP"],
    ["Subscriptions", "Commercial feature, not MVP"],
    ["Report Centre", "Requires Phase 07.6.1"],
    ["Advanced Themes", "Enhancement, not critical"],
]
style_sheet(ws11, h11, d11, [25, 40])

# === Tab 12: Step 12 — Component Library ===
ws12 = wb.create_sheet("Step 12 - Component Library")
h12 = ["Component", "Input", "Type", "Description", "States"]
d12 = [
    ["StatusBadge", "status", "string", "Current status value", "loading, error, empty"],
    ["StatusBadge", "variant", "string", "success/warning/danger/info", ""],
    ["StatusBadge", "size", "string", "sm/md/lg", ""],
    ["ProgressBar", "value", "number", "0-100 percentage", "loading, error, complete, partial"],
    ["ProgressBar", "max", "number", "Maximum value (default 100)", ""],
    ["ProgressBar", "colour", "string", "Dynamic colour based on thresholds", ""],
    ["ProgressBar", "label", "string", "Optional text overlay", ""],
    ["DataTable", "columns", "array", "Column definitions with key, label, sortable, width", "loading, empty, error, populated"],
    ["DataTable", "data", "array", "Row data", ""],
    ["DataTable", "loading", "boolean", "Show skeleton rows", ""],
    ["DataTable", "empty", "boolean", "Show empty state", ""],
    ["DataTable", "pagination", "object", "{ page, pageSize, total }", ""],
    ["DataTable", "onSort", "function", "Column sort handler", ""],
    ["DataTable", "onPageChange", "function", "Page change handler", ""],
    ["MetricCard", "title", "string", "Card header text", "loading, error, empty"],
    ["MetricCard", "value", "string/number", "Primary metric", ""],
    ["MetricCard", "colour", "string", "Accent colour for border/icon", ""],
    ["MetricCard", "icon", "string/ReactNode", "Icon component or name", ""],
    ["MetricCard", "subtitle", "string", "Secondary text", ""],
    ["MetricCard", "trend", "object", "{ value, direction, period }", ""],
    ["EmptyState", "title", "string", "No [items] found", "—"],
    ["EmptyState", "description", "string", "Explanation text", ""],
    ["EmptyState", "action", "ReactNode", "Optional CTA button", ""],
    ["EmptyState", "icon", "string", "Optional icon", ""],
    ["ErrorState", "title", "string", "Something went wrong", "—"],
    ["ErrorState", "message", "string", "Error description", ""],
    ["ErrorState", "onRetry", "function", "Retry button handler", ""],
    ["ErrorState", "code", "number", "HTTP status code", ""],
    ["LoadingSkeleton", "rows", "number", "Number of skeleton rows", "—"],
    ["LoadingSkeleton", "variant", "string", "card/table/list/text", ""],
    ["LoadingSkeleton", "height", "string", "CSS height", ""],
    ["SearchBar", "value", "string", "Current search text", "—"],
    ["SearchBar", "onChange", "function", "Text change handler", ""],
    ["SearchBar", "onSearch", "function", "Submit handler", ""],
    ["SearchBar", "placeholder", "string", "Hint text", ""],
    ["SearchBar", "debounce", "number", "ms delay (default 300)", ""],
    ["Pagination", "page", "number", "Current page (1-indexed)", "—"],
    ["Pagination", "pageSize", "number", "Items per page", ""],
    ["Pagination", "total", "number", "Total items", ""],
    ["Pagination", "onPageChange", "function", "Page change handler", ""],
    ["Modal", "open", "boolean", "Show/hide", "—"],
    ["Modal", "title", "string", "Modal header", ""],
    ["Modal", "onClose", "function", "Close handler", ""],
    ["Modal", "children", "ReactNode", "Content", ""],
    ["Modal", "footer", "ReactNode", "Action buttons", ""],
    ["ConfirmDialog", "open", "boolean", "Show/hide", "—"],
    ["ConfirmDialog", "title", "string", "Confirmation text", ""],
    ["ConfirmDialog", "message", "string", "Explanation", ""],
    ["ConfirmDialog", "onConfirm", "function", "Confirm handler", ""],
    ["ConfirmDialog", "onCancel", "function", "Cancel handler", ""],
    ["ConfirmDialog", "variant", "string", "danger/warning/info", ""],
    ["Toast", "message", "string", "Toast text", "—"],
    ["Toast", "type", "string", "success/error/warning/info", ""],
    ["Toast", "duration", "number", "Auto-dismiss ms (default 5000)", ""],
    ["Toast", "onDismiss", "function", "Close handler", ""],
]
style_sheet(ws12, h12, d12, [18, 15, 15, 45, 25])

# === Tab 13: Step 13 — Design System ===
ws13 = wb.create_sheet("Step 13 - Design System")
h13 = ["Category", "Token", "Value", "Usage"]
d13 = [
    ["Spacing", "space-xs", "4px", "Inline spacing, icon gaps"],
    ["Spacing", "space-sm", "8px", "Small component padding"],
    ["Spacing", "space-md", "16px", "Standard component padding"],
    ["Spacing", "space-lg", "24px", "Section spacing"],
    ["Spacing", "space-xl", "32px", "Page-level spacing"],
    ["Typography", "heading-1", "28px / 700", "Page titles"],
    ["Typography", "heading-2", "22px / 600", "Section headers"],
    ["Typography", "heading-3", "18px / 600", "Subsection headers"],
    ["Typography", "body", "14px / 400", "Standard text"],
    ["Typography", "caption", "12px / 400", "Metadata, timestamps"],
    ["Border Radius", "radius-sm", "4px", "Badges, small elements"],
    ["Border Radius", "radius-md", "8px", "Cards, buttons, inputs"],
    ["Border Radius", "radius-lg", "12px", "Modals, panels"],
    ["Shadows", "shadow-sm", "0 1px 2px rgba(0,0,0,0.05)", "Subtle elevation"],
    ["Shadows", "shadow-md", "0 4px 6px rgba(0,0,0,0.1)", "Cards, dropdowns"],
    ["Shadows", "shadow-lg", "0 10px 15px rgba(0,0,0,0.1)", "Modals, popovers"],
    ["Colours", "colour-primary", "#2563EB", "Primary actions, links"],
    ["Colours", "colour-secondary", "#6B7280", "Secondary text, borders"],
    ["Colours", "colour-success", "#059669", "Success states, positive trends"],
    ["Colours", "colour-warning", "#D97706", "Warnings, caution"],
    ["Colours", "colour-danger", "#DC2626", "Errors, destructive actions"],
    ["Colours", "colour-info", "#2563EB", "Informational messages"],
    ["Colours", "colour-bg", "#F9FAFB", "Page background"],
    ["Colours", "colour-surface", "#FFFFFF", "Card/panel background"],
    ["Colours", "colour-border", "#E5E7EB", "Default borders"],
    ["Colours", "colour-text", "#111827", "Primary text"],
    ["Colours", "colour-text-secondary", "#6B7280", "Secondary/muted text"],
]
style_sheet(ws13, h13, d13, [18, 22, 30, 35])

# === Tab 14: Step 14 — API Response Contracts ===
ws14 = wb.create_sheet("Step 14 - API Contracts")
h14 = ["Screen", "Endpoint", "Method", "Response Shape", "Notes"]
d14 = [
    ["Dashboard", "GET /api/v1/dashboard/portfolio", "GET", '{"totalSystems":3,"totalBatches":543,"totalControls":10,"activeBatches":2}', "Portfolio summary"],
    ["Dashboard", "GET /api/v1/dashboard/kpis", "GET", '{"migrationScore":85.5,"passRate":92.3,"exceptionCount":2494,"pendingApprovals":13}', "KPI metrics"],
    ["Dashboard", "GET /api/v1/dashboard/activity", "GET", '[{"id":"uuid","type":"...","title":"...","timestamp":"...","status":"..."}]', "Activity feed"],
    ["Dashboard", "GET /api/v1/dashboard/health", "GET", '{"database":"healthy","api":"healthy","lastCheck":"...","uptime":86400}', "System health"],
    ["Migration", "GET /api/v1/migration/systems", "GET", '[{"id":"uuid","name":"SAP","type":"ERP","controlCount":120,"status":"active"}]', "Systems list"],
    ["Migration", "GET /api/v1/migration/batches", "GET", '[{"id":"uuid","batchNumber":42,"status":"running","progress":65}]', "Batches list"],
    ["Migration", "POST /api/v1/migration/batches", "POST", '{"systemId":"uuid","controlIds":["uuid1"]}', "Create batch"],
    ["Migration", "GET /api/v1/migration/batches/:id/history", "GET", '[{"id":"uuid","action":"started","timestamp":"..."}]', "Batch history"],
    ["Governance", "GET /api/v1/governance/compliance", "GET", '{"totalControls":3688,"compliant":3200,"nonCompliant":488,"complianceRate":86.8}', "Compliance summary"],
    ["Governance", "GET /api/v1/governance/audit", "GET", '[{"id":"uuid","controlName":"SOX-001","action":"execute","result":"pass"}]', "Audit log"],
    ["Governance", "GET /api/v1/governance/exceptions", "GET", '[{"id":"uuid","controlName":"SOX-001","severity":"critical","failureScope":"OPEN"}]', "Exceptions"],
    ["Governance", "GET /api/v1/governance/approvals", "GET", '[{"id":"uuid","batchNumber":42,"gateResult":"REJECTED"}]', "Approvals"],
    ["Operations", "GET /api/v1/operations/health", "GET", '{"database":"healthy","api":"healthy","services":{...}}', "Health status"],
    ["Operations", "GET /api/v1/operations/alerts", "GET", '[{"id":"uuid","type":"critical","title":"...","acknowledged":false}]', "Alerts"],
    ["Notifications", "GET /api/v1/notifications", "GET", '[{"id":"uuid","type":"info","title":"...","read":false}]', "Notifications list"],
    ["Notifications", "PUT /api/v1/notifications/:id/read", "PUT", '{"success":true}', "Mark read"],
    ["Notifications", "PUT /api/v1/notifications/read-all", "PUT", '{"success":true,"count":5}', "Mark all read"],
    ["Tasks", "GET /api/v1/tasks", "GET", '[{"id":"uuid","title":"...","status":"pending","priority":"high"}]', "Tasks list"],
    ["Tasks", "POST /api/v1/tasks", "POST", '{"title":"...","assignedTo":"uuid","priority":"high"}', "Create task"],
    ["Tasks", "PUT /api/v1/tasks/:id", "PUT", '{"status":"completed","comment":"..."}', "Update task"],
    ["Settings", "GET /api/v1/settings", "GET", '{"general":{...},"notifications":{...},"security":{...}}', "Settings"],
    ["Settings", "PUT /api/v1/settings/:category/:key", "PUT", '{"value":"new-value"}', "Update setting"],
    ["Users", "GET /api/v1/users", "GET", '[{"id":"uuid","email":"...","roles":["Super Admin"],"status":"active"}]', "Users list"],
    ["Users", "POST /api/v1/users", "POST", '{"email":"...","name":"...","roles":["Operator"]}', "Create user"],
    ["Users", "PUT /api/v1/users/:id", "PUT", '{"roles":["Tenant Admin"],"status":"active"}', "Update user"],
    ["Users", "DELETE /api/v1/users/:id", "DELETE", '{"success":true}', "Delete user"],
    ["Roles", "GET /api/v1/roles", "GET", '[{"id":"uuid","name":"Super Admin","permissions":["*"],"userCount":1}]', "Roles list"],
]
style_sheet(ws14, h14, d14, [18, 45, 10, 65, 25])

# === Tab 15: Step 15 — Error Codes ===
ws15 = wb.create_sheet("Step 15 - Error Codes")
h15 = ["HTTP Code", "Meaning", "Frontend Behaviour", "Context", "Handling"]
d15 = [
    [401, "Unauthorized", "Redirect to /login", "Page load failure", "Clear token, redirect"],
    [403, "Forbidden", "Show Access Denied message", "Permission denied", "Show error page"],
    [404, "Not Found", "Show Not Found page", "Invalid route", "Show 404 page"],
    [422, "Validation Error", "Show inline validation messages", "Form submission failure", "Highlight fields"],
    [429, "Rate Limited", "Show Too many requests with retry timer", "Login attempts", "Show countdown"],
    [500, "Server Error", "Show error with retry button", "API failure", "Show ErrorState"],
    [503, "Maintenance", "Show maintenance banner", "System maintenance", "Show banner"],
]
style_sheet(ws15, h15, d15, [15, 20, 35, 25, 25])

# === Tab 16: Step 16 — Route Map ===
ws16 = wb.create_sheet("Step 16 - Route Map")
h16 = ["Path", "Component", "Auth Required", "Roles", "Feature Flag"]
d16 = [
    ["/login", "LoginPage", "No", "—", "—"],
    ["/", "Redirect → /dashboard", "Yes", "All", "—"],
    ["/dashboard", "DashboardPage", "Yes", "All", "—"],
    ["/dashboard/activity", "DashboardPage (Activity tab)", "Yes", "All", "—"],
    ["/migration", "MigrationPage", "Yes", "All", "—"],
    ["/migration/history", "MigrationPage (History tab)", "Yes", "All", "—"],
    ["/migration/batches/:id", "BatchDetailPage", "Yes", "All", "—"],
    ["/validation", "ValidationPage", "Yes", "All", "—"],
    ["/validation/reports/:id", "ReportDetailPage", "Yes", "All", "—"],
    ["/governance", "GovernancePage", "Yes", "All", "—"],
    ["/governance/audit", "GovernancePage (Audit tab)", "Yes", "All", "—"],
    ["/governance/compliance", "GovernancePage (Compliance tab)", "Yes", "All", "—"],
    ["/governance/exceptions", "GovernancePage (Exceptions tab)", "Yes", "All", "—"],
    ["/governance/approvals", "GovernancePage (Approvals tab)", "Yes", "Admin", "—"],
    ["/operations", "OperationsPage", "Yes", "Admin", "—"],
    ["/operations/health", "OperationsPage (Health tab)", "Yes", "Admin", "—"],
    ["/operations/alerts", "OperationsPage (Alerts tab)", "Yes", "Admin", "—"],
    ["/tasks", "TaskManagementPage", "Yes", "All", "—"],
    ["/tasks/:id", "TaskDetailPage", "Yes", "All", "—"],
    ["/workflows", "WorkflowPage", "Yes", "All", "—"],
    ["/users", "UsersPage", "Yes", "Admin", "—"],
    ["/roles", "RolesPage", "Yes", "Admin", "—"],
    ["/settings", "SettingsPage", "Yes", "Admin", "—"],
    ["/notifications", "NotificationsPage", "Yes", "All", "—"],
    ["/reports", "ReportsPage", "Yes", "All", "reports_enabled"],
    ["/mapping", "MappingPage", "Yes", "All", "mapping_enabled"],
]
style_sheet(ws16, h16, d16, [30, 35, 15, 12, 22])

# === Tab 17: Step 17 — Feature Flags ===
ws17 = wb.create_sheet("Step 17 - Feature Flags")
h17 = ["Screen", "Feature Flag", "Default", "Behaviour When Disabled"]
d17 = [
    ["Reports", "reports_enabled", "false", "Hide from nav; show Coming Soon if accessed directly"],
    ["Mapping", "mapping_enabled", "false", "Hide from nav; show Coming Soon if accessed directly"],
    ["AI Features", "ai_enabled", "false", "Hide AI components; no AI endpoints called"],
    ["Advanced Workflow", "workflow_advanced", "false", "Show basic workflow only"],
    ["Calendar", "calendar_enabled", "true", "Show in nav"],
    ["Notifications", "notifications_enabled", "true", "Show in nav"],
]
style_sheet(ws17, h17, d17, [20, 25, 12, 55])

# === Tab 18: Step 18 — Restoration Order ===
ws18 = wb.create_sheet("Step 18 - Restoration Order")
h18 = ["Wave", "Order", "Screen", "Depends On", "Complexity"]
d18 = [
    ["Wave 1 - Platform Foundation", "1.1", "LoginPage", "Auth API", "Low"],
    ["Wave 1 - Platform Foundation", "1.2", "AppShell", "—", "Medium"],
    ["Wave 1 - Platform Foundation", "1.3", "Navigation", "AppShell", "Low"],
    ["Wave 1 - Platform Foundation", "1.4", "DashboardPage", "Portfolio API, Activity API", "Medium"],
    ["Wave 1 - Platform Foundation", "1.5", "Protected Routes", "Auth context", "Low"],
    ["Wave 2 - Execution", "2.1", "MigrationPage", "Systems API, Batches API", "Medium"],
    ["Wave 2 - Execution", "2.2", "BatchDetailPage", "Batch API, History API", "Medium"],
    ["Wave 2 - Execution", "2.3", "ValidationPage", "Validation API", "Medium"],
    ["Wave 2 - Execution", "2.4", "ReportDetailPage", "Report API", "Low"],
    ["Wave 3 - Governance", "3.1", "GovernancePage", "Compliance API", "Medium"],
    ["Wave 3 - Governance", "3.2", "AuditTab", "Audit API", "Low"],
    ["Wave 3 - Governance", "3.3", "ComplianceTab", "Compliance API", "Low"],
    ["Wave 3 - Governance", "3.4", "ExceptionsTab", "Exceptions API", "Low"],
    ["Wave 3 - Governance", "3.5", "ApprovalsTab", "Approvals API", "Low"],
    ["Wave 4 - Operations", "4.1", "OperationsPage", "Health API, Alerts API", "Medium"],
    ["Wave 4 - Operations", "4.2", "HealthTab", "Health API", "Low"],
    ["Wave 4 - Operations", "4.3", "AlertsTab", "Alerts API", "Low"],
    ["Wave 5 - Platform", "5.1", "UsersPage", "Users API", "Medium"],
    ["Wave 5 - Platform", "5.2", "RolesPage", "Roles API", "Low"],
    ["Wave 5 - Platform", "5.3", "TaskManagementPage", "Tasks API", "Medium"],
    ["Wave 5 - Platform", "5.4", "NotificationsPage", "Notifications API", "Low"],
    ["Wave 5 - Platform", "5.5", "SettingsPage", "Settings API", "Low"],
    ["Wave 6 - Future", "6.1", "ReportsPage", "Reports API", "Medium"],
    ["Wave 6 - Future", "6.2", "MappingPage", "Mapping API", "High"],
    ["Wave 6 - Future", "6.3", "AIPage", "AI API", "High"],
    ["Wave 6 - Future", "6.4", "SecurityPage", "Security API", "High"],
]
style_sheet(ws18, h18, d18, [30, 10, 22, 30, 15])

# === Tab 19: Step 19 — Acceptance Criteria ===
ws19 = wb.create_sheet("Step 19 - Acceptance Criteria")
h19 = ["Screen", "Criterion", "Priority"]
d19 = [
    ["DashboardPage", "Portfolio cards load with real data", "P0"],
    ["DashboardPage", "Activity feed loads with real data", "P0"],
    ["DashboardPage", "Quick actions navigate to correct pages", "P0"],
    ["DashboardPage", "Skeleton loaders display during fetch", "P1"],
    ["DashboardPage", "Error states display with retry button", "P1"],
    ["DashboardPage", "Permissions enforced (all roles can view)", "P0"],
    ["DashboardPage", "Empty states display when no data", "P1"],
    ["DashboardPage", "Responsive layout works on mobile", "P2"],
    ["MigrationPage", "Systems list loads with real data", "P0"],
    ["MigrationPage", "Batches list loads with real data", "P0"],
    ["MigrationPage", "Start migration action works", "P0"],
    ["MigrationPage", "Batch progress updates via polling", "P0"],
    ["MigrationPage", "History tab loads with real data", "P0"],
    ["MigrationPage", "Pagination works correctly", "P1"],
    ["MigrationPage", "Skeleton loaders display during fetch", "P1"],
    ["MigrationPage", "Error states display with retry button", "P1"],
    ["MigrationPage", "Permissions enforced (all roles can view)", "P0"],
    ["GovernancePage", "Compliance summary loads with real data", "P0"],
    ["GovernancePage", "Audit tab loads with real data", "P0"],
    ["GovernancePage", "Exceptions tab loads with real data", "P0"],
    ["GovernancePage", "Approvals tab loads with real data (admin only)", "P0"],
    ["GovernancePage", "Tab navigation works via URL", "P0"],
    ["GovernancePage", "Skeleton loaders display during fetch", "P1"],
    ["GovernancePage", "Error states display with retry button", "P1"],
    ["GovernancePage", "Permissions enforced (admin for approvals)", "P0"],
    ["OperationsPage", "Health status loads with real data", "P0"],
    ["OperationsPage", "Alerts list loads with real data", "P0"],
    ["OperationsPage", "Tab navigation works via URL", "P0"],
    ["OperationsPage", "Skeleton loaders display during fetch", "P1"],
    ["OperationsPage", "Error states display with retry button", "P1"],
    ["OperationsPage", "Permissions enforced (admin only)", "P0"],
    ["TaskManagementPage", "Tasks list loads with real data", "P0"],
    ["TaskManagementPage", "Create task action works", "P0"],
    ["TaskManagementPage", "Update task status works", "P0"],
    ["TaskManagementPage", "Task detail view loads", "P0"],
    ["TaskManagementPage", "Pagination works correctly", "P1"],
    ["TaskManagementPage", "Skeleton loaders display during fetch", "P1"],
    ["TaskManagementPage", "Error states display with retry button", "P1"],
    ["TaskManagementPage", "Permissions enforced (all roles can view)", "P0"],
    ["NotificationsPage", "Notifications list loads with real data", "P0"],
    ["NotificationsPage", "Mark as read works", "P0"],
    ["NotificationsPage", "Mark all as read works", "P0"],
    ["NotificationsPage", "Empty state displays when no notifications", "P1"],
    ["NotificationsPage", "Skeleton loaders display during fetch", "P1"],
    ["NotificationsPage", "Error states display with retry button", "P1"],
    ["NotificationsPage", "Permissions enforced (all roles can view)", "P0"],
    ["UsersPage", "Users list loads with real data", "P0"],
    ["UsersPage", "Create user action works", "P0"],
    ["UsersPage", "Edit user roles works", "P0"],
    ["UsersPage", "Delete user works with confirmation", "P0"],
    ["UsersPage", "Pagination works correctly", "P1"],
    ["UsersPage", "Skeleton loaders display during fetch", "P1"],
    ["UsersPage", "Error states display with retry button", "P1"],
    ["UsersPage", "Permissions enforced (admin only)", "P0"],
    ["SettingsPage", "Settings load with real data", "P0"],
    ["SettingsPage", "Update settings works", "P0"],
    ["SettingsPage", "Category navigation works", "P0"],
    ["SettingsPage", "Skeleton loaders display during fetch", "P1"],
    ["SettingsPage", "Error states display with retry button", "P1"],
    ["SettingsPage", "Permissions enforced (admin only)", "P0"],
    ["LoginPage", "Login form validates inputs", "P0"],
    ["LoginPage", "Login API call works", "P0"],
    ["LoginPage", "JWT token stored correctly", "P0"],
    ["LoginPage", "Redirect to dashboard on success", "P0"],
    ["LoginPage", "Error message on failure", "P0"],
    ["LoginPage", "Rate limiting handled (5/minute)", "P1"],
    ["LoginPage", "Loading state during auth", "P1"],
]
style_sheet(ws19, h19, d19, [22, 50, 10])

# === Tab 20: Step 20 — State Machine Definitions ===
ws20 = wb.create_sheet("Step 20 - State Machines")
h20 = ["Screen", "State", "Transition", "Trigger", "Next State"]
d20 = [
    ["All Pages", "Idle", "→ Loading", "onMount / fetchData", "Loading"],
    ["All Pages", "Loading", "→ Loaded", "fetchSuccess", "Loaded"],
    ["All Pages", "Loaded", "→ Empty", "data.length === 0", "Empty"],
    ["All Pages", "Loaded", "→ Partial", "data.length < expected", "Partial"],
    ["All Pages", "Loaded", "→ Complete", "data.length >= expected", "Complete"],
    ["All Pages", "Loaded", "→ Error", "fetchFailed", "Error"],
    ["Dashboard", "Idle", "→ Loading", "onMount", "LoadingPortfolio + LoadingActivity"],
    ["Dashboard", "Loading", "→ Loaded", "portfolioLoaded ∧ activityLoaded", "Loaded"],
    ["Dashboard", "Loaded", "→ Empty", "PortfolioEmpty ∧ ActivityEmpty", "No data available"],
    ["Dashboard", "Loaded", "→ Error", "anyFetchFailed", "Error"],
    ["Migration", "Idle", "→ Loading", "onMount", "LoadingSystems + LoadingBatches"],
    ["Migration", "Loaded", "→ Starting", "startMigration", "Starting"],
    ["Migration", "Starting", "→ Polling", "batchCreated", "Polling"],
    ["Migration", "Polling", "→ Updating", "progressUpdate", "Updating"],
    ["Migration", "Updating", "→ Polling", "progress < 100", "Polling"],
    ["Migration", "Updating", "→ Completed", "progress === 100", "Completed"],
    ["Migration", "Polling", "→ Failed", "error", "Failed"],
    ["Governance", "Idle", "→ Loading", "onTabSwitch", "LoadingTab"],
    ["Governance", "Loading", "→ Loaded", "tabLoaded", "Loaded"],
    ["Governance", "Loaded", "→ Empty", "TabEmpty", "Tab-specific empty state"],
    ["Governance", "Loaded", "→ Error", "tabLoadFailed", "Error"],
    ["Tasks", "Idle", "→ Loading", "onMount", "LoadingTasks"],
    ["Tasks", "Loaded", "→ Creating", "createTask", "Creating"],
    ["Tasks", "Creating", "→ Created", "taskCreated", "Created → refetch"],
    ["Tasks", "Loaded", "→ Deleting", "deleteTask", "Deleting"],
    ["Tasks", "Deleting", "→ Deleted", "taskDeleted", "Deleted → refetch"],
    ["Notifications", "Idle", "→ Loading", "onMount", "LoadingNotifications"],
    ["Notifications", "Loaded", "→ Marking", "markRead", "Marking"],
    ["Notifications", "Marking", "→ Loaded", "marked", "Loaded → refetch"],
    ["Notifications", "Loaded", "→ MarkingAll", "markAllRead", "MarkingAll"],
    ["Notifications", "MarkingAll", "→ Loaded", "markedAll", "Loaded → refetch"],
    ["Login", "Idle", "→ Authenticating", "formSubmit", "Authenticating"],
    ["Login", "Authenticating", "→ Authenticated", "authSuccess", "Authenticated → redirect"],
    ["Login", "Authenticating", "→ Error", "authFailed", "Error"],
    ["Login", "Authenticating", "→ RateLimited", "rateLimited", "RateLimited → retry timer"],
]
style_sheet(ws20, h20, d20, [18, 18, 18, 30, 30])

# === Tab 21: Step 21 — Component Ownership ===
ws21 = wb.create_sheet("Step 21 - Component Ownership")
h21 = ["Component", "Owner", "Type", "Shared Across"]
d21 = [
    ["StatusBadge", "Shared", "Reusable", "All screens"],
    ["ProgressBar", "Shared", "Reusable", "Migration, Governance, Tasks"],
    ["DataTable", "Shared", "Reusable", "All list views"],
    ["MetricCard", "Shared", "Reusable", "Dashboard, Governance"],
    ["EmptyState", "Shared", "Reusable", "All screens"],
    ["ErrorState", "Shared", "Reusable", "All screens"],
    ["LoadingSkeleton", "Shared", "Reusable", "All screens"],
    ["SearchBar", "Shared", "Reusable", "Governance, Tasks, Notifications"],
    ["Pagination", "Shared", "Reusable", "All paginated views"],
    ["Modal", "Shared", "Reusable", "All modals"],
    ["ConfirmDialog", "Shared", "Reusable", "All delete/confirm actions"],
    ["Toast", "Shared", "Reusable", "All success/error notifications"],
    ["TabBar", "Shared", "Reusable", "Migration, Governance, Operations"],
    ["ExecutiveSummaryCards", "Dashboard", "Page-specific", "DashboardPage"],
    ["ActivityFeed", "Dashboard", "Page-specific", "DashboardPage"],
    ["QuickActions", "Dashboard", "Page-specific", "DashboardPage"],
    ["ComplianceCards", "Governance", "Page-specific", "GovernancePage"],
    ["AuditList", "Governance", "Page-specific", "GovernancePage"],
    ["ExceptionList", "Governance", "Page-specific", "GovernancePage"],
    ["ApprovalList", "Governance", "Page-specific", "GovernancePage"],
    ["SystemHealthCard", "Operations", "Page-specific", "OperationsPage"],
    ["AlertList", "Operations", "Page-specific", "OperationsPage"],
    ["TaskTable", "Tasks", "Page-specific", "TaskManagementPage"],
    ["CreateTaskModal", "Tasks", "Page-specific", "TaskManagementPage"],
    ["NotificationList", "Notifications", "Page-specific", "NotificationsPage"],
    ["UserTable", "Users", "Page-specific", "UsersPage"],
    ["RoleTable", "Roles", "Page-specific", "RolesPage"],
    ["SettingsForm", "Settings", "Page-specific", "SettingsPage"],
]
style_sheet(ws21, h21, d21, [22, 15, 15, 35])

# === Tab 22: Step 22 — API Versioning ===
ws22 = wb.create_sheet("Step 22 - API Versioning")
h22 = ["Property", "Value", "Notes"]
d22 = [
    ["Current Version", "v1", ""],
    ["Base Path", "/api/v1/", ""],
    ["Versioning Strategy", "URL path versioning", "/api/v1/, /api/v2/"],
    ["Breaking Change Policy", "New version required", "Removing fields, renaming, type changes"],
    ["Non-Breaking Changes", "Additive only", "Optional fields, new endpoints, new params"],
    ["Deprecation Strategy", "6 months notice", "Deprecation header, documentation update"],
    ["Deprecation Header", "Deprecation: true", "Sunset date, Link to successor"],
    ["Version Negotiation", "Client specifies in URL", ""],
]
style_sheet(ws22, h22, d22, [25, 30, 45])

# === Tab 23: Step 23 — Event Flow ===
ws23 = wb.create_sheet("Step 23 - Event Flow")
h23 = ["Screen", "Action", "Step", "Description"]
d23 = [
    ["Migration", "Start Migration", "1", "Click Start Migration button"],
    ["Migration", "Start Migration", "2", "Validate form (projectId required)"],
    ["Migration", "Start Migration", "3", "Disable button"],
    ["Migration", "Start Migration", "4", "POST /execution/run"],
    ["Migration", "Start Migration", "5", "Receive batchId"],
    ["Migration", "Start Migration", "6", "Store batchId in state"],
    ["Migration", "Start Migration", "7", "Begin polling (GET /execution/status/:batchId every 2s)"],
    ["Migration", "Start Migration", "8", "Update progress bar"],
    ["Migration", "Start Migration", "9", "Progress < 100 → Continue polling"],
    ["Migration", "Start Migration", "10", "Progress === 100 → Stop polling"],
    ["Migration", "Start Migration", "11", "Show toast Migration Complete"],
    ["Migration", "Start Migration", "12", "Refetch dashboard data"],
    ["Governance", "Tab Switch", "1", "Click tab"],
    ["Governance", "Tab Switch", "2", "Update URL (/governance/:tab)"],
    ["Governance", "Tab Switch", "3", "Fetch tab data"],
    ["Governance", "Tab Switch", "4", "Render tab content"],
    ["Governance", "Search Audit", "1", "Type in search bar"],
    ["Governance", "Search Audit", "2", "Debounce (300ms)"],
    ["Governance", "Search Audit", "3", "Fetch audit (GET /governance/audit?search=:query)"],
    ["Governance", "Search Audit", "4", "Render filtered results"],
    ["Tasks", "Create Task", "1", "Click Create Task"],
    ["Tasks", "Create Task", "2", "Open modal"],
    ["Tasks", "Create Task", "3", "Fill form (title, description, priority, assignedTo)"],
    ["Tasks", "Create Task", "4", "Click Create"],
    ["Tasks", "Create Task", "5", "Validate form (title required)"],
    ["Tasks", "Create Task", "6", "POST /tasks"],
    ["Tasks", "Create Task", "7", "Close modal"],
    ["Tasks", "Create Task", "8", "Show toast Task Created"],
    ["Tasks", "Create Task", "9", "Refetch tasks"],
    ["Tasks", "Delete Task", "1", "Click Delete on task row"],
    ["Tasks", "Delete Task", "2", "Show confirm dialog"],
    ["Tasks", "Delete Task", "3", "Click Confirm"],
    ["Tasks", "Delete Task", "4", "DELETE /tasks/:id"],
    ["Tasks", "Delete Task", "5", "Show toast Task Deleted"],
    ["Tasks", "Delete Task", "6", "Refetch tasks"],
    ["Notifications", "Mark Read", "1", "Click Mark Read on notification"],
    ["Notifications", "Mark Read", "2", "PUT /notifications/:id/read"],
    ["Notifications", "Mark Read", "3", "Update local state (read = true)"],
    ["Notifications", "Mark Read", "4", "Refetch notifications"],
    ["Notifications", "Mark All Read", "1", "Click Mark All as Read"],
    ["Notifications", "Mark All Read", "2", "Disable button"],
    ["Notifications", "Mark All Read", "3", "PUT /notifications/read-all"],
    ["Notifications", "Mark All Read", "4", "Show toast All marked as read"],
    ["Notifications", "Mark All Read", "5", "Refetch notifications"],
]
style_sheet(ws23, h23, d23, [18, 20, 8, 50])

# === Tab 24: Step 24 — Error Recovery ===
ws24 = wb.create_sheet("Step 24 - Error Recovery")
h24 = ["Code", "Trigger", "Recovery Step", "Description"]
d24 = [
    [401, "JWT expired or invalid", "1", "Clear JWT from storage"],
    [401, "JWT expired or invalid", "2", "Redirect to /login"],
    [401, "JWT expired or invalid", "3", "Store requested URL in sessionStorage"],
    [401, "JWT expired or invalid", "4", "After login, redirect to stored URL"],
    [403, "Insufficient permissions", "1", "Show Access Denied page"],
    [403, "Insufficient permissions", "2", "Log permission failure"],
    [403, "Insufficient permissions", "3", "Offer Request Access link"],
    [404, "Resource not found", "1", "Show Not Found page"],
    [404, "Resource not found", "2", "Log missing resource"],
    [404, "Resource not found", "3", "Offer Go Home link"],
    [422, "Validation error", "1", "Parse error response"],
    [422, "Validation error", "2", "Highlight invalid fields"],
    [422, "Validation error", "3", "Show inline error messages"],
    [422, "Validation error", "4", "Focus first invalid field"],
    [429, "Rate limited", "1", "Parse Retry-After header"],
    [429, "Rate limited", "2", "Show Too many requests"],
    [429, "Rate limited", "3", "Show countdown timer"],
    [429, "Rate limited", "4", "Auto-retry after timer"],
    [500, "Server error", "1", "Show error with retry button"],
    [500, "Server error", "2", "Generate support ID"],
    [500, "Server error", "3", "Log error details"],
    [500, "Server error", "4", "Offer Contact Support link"],
    [503, "Maintenance", "1", "Show maintenance banner"],
    [503, "Maintenance", "2", "Disable all actions"],
    [503, "Maintenance", "3", "Show estimated restore time"],
    [503, "Maintenance", "4", "Auto-refresh every 60s"],
]
style_sheet(ws24, h24, d24, [10, 25, 10, 45])

# === Tab 25: Step 25 — Performance Targets ===
ws25 = wb.create_sheet("Step 25 - Performance")
h25 = ["Screen", "Metric", "Target", "Category"]
d25 = [
    ["Dashboard", "Initial render", "< 1.5s", "Load Time"],
    ["Dashboard", "Portfolio fetch", "< 500ms", "API Response"],
    ["Dashboard", "Activity fetch", "< 500ms", "API Response"],
    ["Migration", "Initial render", "< 1.5s", "Load Time"],
    ["Migration", "Polling interval", "2s", "Polling"],
    ["Governance", "Initial render", "< 1.5s", "Load Time"],
    ["Governance", "Tab switch", "< 300ms", "Navigation"],
    ["Governance", "Search debounce", "300ms", "Search"],
    ["Tasks", "Initial render", "< 1.5s", "Load Time"],
    ["Tasks", "Create task", "< 300ms", "Mutation"],
    ["Notifications", "Initial render", "< 1.5s", "Load Time"],
    ["Notifications", "Mark read", "< 200ms", "Mutation"],
    ["Login", "Initial render", "< 1s", "Load Time"],
    ["Login", "Auth attempt", "< 2s", "API Response"],
    ["All", "Pagination", "< 500ms", "Navigation"],
    ["All", "Search results", "< 500ms", "Search"],
    ["All", "Skeleton display", "< 100ms", "UI Response"],
    ["All", "Error display", "< 100ms", "UI Response"],
    ["All", "Toast display", "< 100ms", "UI Response"],
    ["Bundle", "Initial JS", "< 200KB gzipped", "Bundle Size"],
    ["Bundle", "Initial CSS", "< 50KB gzipped", "Bundle Size"],
    ["Bundle", "Total First Load", "< 250KB gzipped", "Bundle Size"],
    ["Bundle", "Lazy chunks", "< 50KB each", "Bundle Size"],
]
style_sheet(ws25, h25, d25, [18, 22, 18, 18])

# === Tab 26: Step 26 — Accessibility ===
ws26 = wb.create_sheet("Step 26 - Accessibility")
h26 = ["Category", "Requirement", "Implementation", "Priority"]
d26 = [
    ["WCAG", "Colour Contrast", "4.5:1 normal text, 3:1 large text", "P0"],
    ["WCAG", "Keyboard Navigation", "All interactive elements focusable and operable", "P0"],
    ["WCAG", "Focus Order", "Logical tab order matching visual layout", "P0"],
    ["WCAG", "Screen Readers", "ARIA labels for all interactive elements", "P0"],
    ["WCAG", "Modal Focus Trapping", "Tab cycles within modal when open", "P0"],
    ["WCAG", "Escape Handling", "Escape closes modals, dropdowns, popovers", "P0"],
    ["WCAG", "Button Labels", "All buttons have visible text or aria-label", "P0"],
    ["WCAG", "Form Labels", "All inputs have associated labels", "P0"],
    ["WCAG", "Error Messages", "Linked to inputs via aria-describedby", "P0"],
    ["WCAG", "Loading States", "aria-busy=true on loading containers", "P1"],
    ["WCAG", "Skip Link", "Skip to main content at top of page", "P1"],
    ["ARIA", "Navigation sidebar", "aria-label=Main navigation", "P0"],
    ["ARIA", "Loading spinner", "aria-label=Loading", "P0"],
    ["ARIA", "Search input", "aria-label=Search", "P0"],
    ["ARIA", "Pagination", "aria-label=Pagination", "P0"],
    ["ARIA", "Modal", "role=dialog, aria-modal=true", "P0"],
    ["ARIA", "Toast", "role=alert, aria-live=polite", "P0"],
    ["ARIA", "Progress bar", "role=progressbar", "P0"],
    ["ARIA", "Tab panel", "role=tabpanel", "P0"],
    ["ARIA", "Tab button", "role=tab, aria-selected", "P0"],
    ["Keyboard", "Tab", "Next focusable element", "P0"],
    ["Keyboard", "Shift+Tab", "Previous focusable element", "P0"],
    ["Keyboard", "Enter", "Activate button/link", "P0"],
    ["Keyboard", "Space", "Activate button/checkbox", "P0"],
    ["Keyboard", "Escape", "Close modal/dropdown", "P0"],
    ["Keyboard", "Arrow keys", "Navigate within tabs/dropdowns", "P1"],
    ["Focus", "Page load", "Focus first heading or main content", "P0"],
    ["Focus", "Modal open", "Focus first focusable element in modal", "P0"],
    ["Focus", "Modal close", "Return focus to trigger element", "P0"],
    ["Focus", "Tab switch", "Focus new tab panel", "P0"],
    ["Focus", "Form error", "Focus first invalid field", "P0"],
    ["Focus", "Toast show", "Do not steal focus", "P1"],
    ["Focus", "Navigation", "Focus new page main content", "P0"],
]
style_sheet(ws26, h26, d26, [12, 22, 50, 10])

# === Tab 27: Step 27 — Testing Matrix ===
ws27 = wb.create_sheet("Step 27 - Testing Matrix")
h27 = ["Test Type", "Scope", "Tools", "Coverage Target"]
d27 = [
    ["Unit Tests", "Components, hooks, utilities", "Vitest, React Testing Library", "80%"],
    ["Integration Tests", "Page + API interactions", "Vitest, MSW", "70%"],
    ["E2E Tests", "Critical user flows", "Playwright", "P0 screens"],
    ["Visual Regression", "UI component snapshots", "Playwright screenshot", "Shared components"],
    ["API Mock Tests", "API contract validation", "MSW, Vitest", "All endpoints"],
    ["Permission Tests", "Role-based access", "Vitest, custom helpers", "All protected routes"],
    ["Accessibility Tests", "WCAG compliance", "axe-core, Playwright", "All pages"],
    ["Performance Tests", "Load time, bundle size", "Lighthouse CI", "All pages"],
]
style_sheet(ws27, h27, d27, [22, 30, 30, 22])

# === Tab 28: Step 28 — Responsive Breakpoints ===
ws28 = wb.create_sheet("Step 28 - Responsive")
h28 = ["Breakpoint", "Width", "Columns", "Layout", "Navigation"]
d28 = [
    ["Desktop", ">= 1280px", "12", "Full sidebar + content", "Fixed left sidebar"],
    ["Tablet", "768px - 1279px", "8", "Collapsed sidebar + content", "Collapsible left sidebar"],
    ["Mobile", "< 768px", "4", "Bottom navigation + content", "Bottom navigation bar (5 items)"],
]
style_sheet(ws28, h28, d28, [15, 20, 12, 30, 40])

# === Tab 29: Step 29 — Design Tokens Extended ===
ws29 = wb.create_sheet("Step 29 - Design Tokens Ext")
h29 = ["Category", "Token", "Value", "Usage"]
d29 = [
    ["Animation", "duration-fast", "100ms", "Tooltip show/hide"],
    ["Animation", "duration-normal", "200ms", "Button hover, focus ring"],
    ["Animation", "duration-slow", "300ms", "Modal open/close, toast show/hide"],
    ["Animation", "duration-slower", "500ms", "Page transition"],
    ["Animation", "easing-default", "ease-in-out", "Standard transitions"],
    ["Animation", "easing-bounce", "cubic-bezier(0.68, -0.55, 0.265, 1.55)", "Bounce effects"],
    ["Animation", "easing-smooth", "cubic-bezier(0.4, 0, 0.2, 1)", "Smooth transitions"],
    ["Z-Index", "z-base", "0", "Default stacking"],
    ["Z-Index", "z-dropdown", "100", "Dropdowns, popovers"],
    ["Z-Index", "z-sticky", "200", "Sticky headers"],
    ["Z-Index", "z-modal-backdrop", "300", "Modal overlay"],
    ["Z-Index", "z-modal", "400", "Modal content"],
    ["Z-Index", "z-toast", "500", "Toast notifications"],
    ["Z-Index", "z-tooltip", "600", "Tooltips"],
    ["Z-Index", "z-skip-link", "700", "Skip to content link"],
    ["Icon Sizes", "icon-xs", "12px", "Inline badges"],
    ["Icon Sizes", "icon-sm", "16px", "Button icons, list icons"],
    ["Icon Sizes", "icon-md", "20px", "Navigation icons"],
    ["Icon Sizes", "icon-lg", "24px", "Header icons"],
    ["Icon Sizes", "icon-xl", "32px", "Empty state icons"],
    ["Grid", "grid-columns", "12", "Default grid"],
    ["Grid", "grid-gutter", "16px", "Column gap"],
    ["Grid", "grid-margin", "24px", "Page margin"],
    ["Grid", "container-sm", "640px", "Small content"],
    ["Grid", "container-md", "768px", "Medium content"],
    ["Grid", "container-lg", "1024px", "Large content"],
    ["Grid", "container-xl", "1280px", "Extra large content"],
    ["Border", "border-width", "1px", "Default borders"],
    ["Border", "border-width-focus", "2px", "Focus rings"],
    ["Opacity", "opacity-disabled", "0.5", "Disabled elements"],
    ["Opacity", "opacity-overlay", "0.5", "Modal backdrop"],
    ["Opacity", "opacity-loading", "0.7", "Loading states"],
]
style_sheet(ws29, h29, d29, [15, 22, 35, 30])

output_path = r"engineering\MAP_V2\00_Architecture\Verification\25_Frontend_Architecture\01_Master_Frontend_Restoration_Specification.xlsx"
wb.save(output_path)
print(f"Saved to {output_path}")
