# Capability to API Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — API Endpoint Mapping  

---

## 1. Purpose

This document maps each business capability to its corresponding API endpoints, identifying existing endpoints and required new endpoints.

---

## 2. Existing API Endpoints

| Capability | API Endpoint | Method | Service | Status |
|-----------|-------------|--------|---------|--------|
| Connection Management | /api/v1/systems/ | GET | SystemService | IMPLEMENTED |
| Connection Management | /api/v1/systems/{id} | GET | SystemService | IMPLEMENTED |
| Connection Management | /api/v1/systems/ | POST | SystemService | IMPLEMENTED |
| Connection Management | /api/v1/systems/{id}/test | GET | SystemService | IMPLEMENTED |
| Connection Management | /api/v1/credentials/ | GET | CredentialService | IMPLEMENTED |
| Connection Management | /api/v1/credentials/ | POST | CredentialService | IMPLEMENTED |
| Connection Management | /api/v1/credentials/{id} | PUT | CredentialService | IMPLEMENTED |
| Connection Management | /api/v1/credentials/{id} | DELETE | CredentialService | IMPLEMENTED |
| Validation Execution | /api/v1/execution/run | POST | ExecutionService | IMPLEMENTED |
| Validation Execution | /api/v1/execution/status/{id} | GET | ExecutionService | IMPLEMENTED |
| Authentication | /api/v1/auth/login | POST | AuthService | IMPLEMENTED |
| User Management | /api/v1/users/ | GET | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id} | GET | UserService | IMPLEMENTED |
| User Management | /api/v1/users/ | POST | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id} | PUT | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id} | DELETE | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id}/roles | POST | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id}/roles/{rid} | DELETE | UserService | IMPLEMENTED |
| User Management | /api/v1/users/{id}/roles | GET | UserService | IMPLEMENTED |
| Role Management | /api/v1/roles/ | GET | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id} | GET | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/ | POST | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id} | PUT | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id} | DELETE | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id}/permissions | POST | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id}/permissions/{pid} | DELETE | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/{id}/permissions | GET | RoleService | IMPLEMENTED |
| Role Management | /api/v1/roles/permissions/list | GET | RoleService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/ | GET | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/{id} | GET | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/ | POST | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/{id} | PUT | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/{id} | DELETE | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/{id}/execute | POST | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/{id}/instances | GET | WorkflowService | IMPLEMENTED |
| Workflow Management | /api/v1/workflows/instances/{id} | GET | WorkflowService | IMPLEMENTED |
| Task Management | /api/v1/tasks/ | GET | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/{id} | GET | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/ | POST | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/{id} | PUT | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/{id} | DELETE | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/{id}/comments | POST | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/{id}/comments | GET | TaskService | IMPLEMENTED |
| Task Management | /api/v1/tasks/my/list | GET | TaskService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/ | GET | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/{id} | GET | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/{id}/read | PUT | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/read-all | PUT | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/{id} | DELETE | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/unread/count | GET | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/preferences/list | GET | NotificationService | IMPLEMENTED |
| Notification Services | /api/v1/notifications/preferences | PUT | NotificationService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events | GET | CalendarService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events/{id} | GET | CalendarService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events | POST | CalendarService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events/{id} | PUT | CalendarService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events/{id} | DELETE | CalendarService | IMPLEMENTED |
| Calendar Services | /api/v1/calendar/events/upcoming/list | GET | CalendarService | IMPLEMENTED |
| Approvals | /api/v1/approvals/ | GET | ApprovalService | IMPLEMENTED |
| Approvals | /api/v1/approvals/pending/count | GET | ApprovalService | IMPLEMENTED |
| Approvals | /api/v1/approvals/{id} | GET | ApprovalService | IMPLEMENTED |
| Approvals | /api/v1/approvals/ | POST | ApprovalService | IMPLEMENTED |
| Approvals | /api/v1/approvals/{id}/approve | PUT | ApprovalService | IMPLEMENTED |
| Approvals | /api/v1/approvals/{id}/reject | PUT | ApprovalService | IMPLEMENTED |
| System Settings | /api/v1/settings/ | GET | SettingsService | IMPLEMENTED |
| System Settings | /api/v1/settings/{cat} | GET | SettingsService | IMPLEMENTED |
| System Settings | /api/v1/settings/{cat}/{key} | GET | SettingsService | IMPLEMENTED |
| System Settings | /api/v1/settings/{cat}/{key} | PUT | SettingsService | IMPLEMENTED |
| Feature Flags | /api/v1/settings/flags/list | GET | SettingsService | IMPLEMENTED |
| Maintenance & Health | /health | GET | — | IMPLEMENTED |
| Maintenance & Health | /api/v1/health | GET | — | IMPLEMENTED |
| Maintenance & Health | /api/v1/ready | GET | — | IMPLEMENTED |

---

## 3. Required New Endpoints

| # | Capability | Endpoint | Method | Priority |
|---|-----------|----------|--------|----------|
| 1 | Dataset Discovery | /api/v1/discovery/run | POST | HIGH |
| 2 | Dataset Discovery | /api/v1/discovery/results/{project_id} | GET | HIGH |
| 3 | Column Mapping | /api/v1/column-mappings/{mapping_id} | GET | MEDIUM |
| 4 | Column Mapping | /api/v1/column-mappings/{mapping_id} | PUT | MEDIUM |
| 5 | Control Discovery | /api/v1/controls/ | GET | MEDIUM |
| 6 | Control Discovery | /api/v1/controls/{id} | GET | MEDIUM |
| 7 | Control Discovery | /api/v1/controls/{id}/toggle | PUT | MEDIUM |
| 8 | Governance Decisions | /api/v1/governance/decisions/{batch_id} | GET | HIGH |
| 9 | Governance Decisions | /api/v1/governance/config | GET | HIGH |
| 10 | Governance Decisions | /api/v1/governance/config | PUT | HIGH |
| 11 | Risk Scoring | /api/v1/governance/risk/{batch_id} | GET | HIGH |
| 12 | Release Gates | /api/v1/governance/release/{batch_id}/approve | POST | HIGH |
| 13 | Release Gates | /api/v1/governance/release/{batch_id}/reject | POST | HIGH |
| 14 | Executive Reporting | /api/v1/reports/executive/{batch_id} | GET | HIGH |
| 15 | Operational Reporting | /api/v1/reports/controls/{batch_id} | GET | HIGH |
| 16 | Governance Reporting | /api/v1/reports/governance/{batch_id} | GET | HIGH |
| 17 | Technical Reporting | /api/v1/reports/exceptions/{batch_id} | GET | HIGH |
| 18 | Audit Trail | /api/v1/audit/events | GET | MEDIUM |
| 19 | Audit Trail | /api/v1/audit/events/{id} | GET | MEDIUM |
| 20 | Tenant Management | /api/v1/tenants/ | GET | MEDIUM |

---

## 4. API Statistics

| Metric | Count |
|--------|-------|
| Existing Endpoints | 67 |
| Required New Endpoints | 20 |
| Total Endpoints | 87 |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*