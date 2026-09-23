# TODO — Centralised Report Entitlement, Subscription and Report Security

## Objective

Review and, where appropriate, extend the existing MAP Nexus subscription, entitlement, RBAC and report architecture so that report access is centrally controlled and consistently enforced.

Current report catalogue:

1. Executive Summary
2. Operational
3. Migration
4. Migration Pack
5. Validation
6. Validation Pack
7. Governance
8. Governance Pack
9. Audit Pack
10. Risk
11. Quality
12. Readiness
13. Exceptions

Reports need to be distributed between subscription tiers and maintained centrally.

## CRITICAL SECURITY REQUIREMENT

Report visibility in the frontend is NOT sufficient security.

The same entitlement must control:

1. Report navigation.
2. Report tabs.
3. Report submenus.
4. Frontend route access.
5. Direct URL access.
6. Backend report endpoints.
7. Underlying report data/API access.

A user must NOT be able to access a report they are not entitled to simply by:

* typing the URL directly
* modifying the URL
* using browser history
* clicking a submenu
* calling the API directly
* bypassing a disabled navigation tab

## INSPECT BEFORE IMPLEMENTING

Do NOT immediately create a new report permission framework.

First inspect the existing MAP Nexus implementation.

Determine whether we already have:

* subscription plans
* entitlements
* roles
* permissions
* RBAC
* entitlement middleware
* frontend route guards
* navigation permission checks
* report routes
* report APIs
* report configuration
* subscription-to-feature mapping
* tenant-level overrides
* user-level permissions
* existing permission/entitlement database structures
* existing reusable middleware/components

Determine whether the existing entitlement architecture can be extended.

Do NOT create duplicate permission or subscription models if an authoritative mechanism already exists.

## REQUIRED DESIGN

Create a central report catalogue/entitlement model capable of answering:

> Can this tenant/user access this report?

The answer must be reusable by both frontend and backend.

The design should support:

* report identifier
* display name
* report category
* subscription entitlement
* tenant entitlement
* user/role permission where applicable
* active/inactive status
* future addition/removal of reports without rewriting security logic

## SECURITY

Backend authorization must be authoritative.

For every protected report:

Unauthorised user:

* must not receive report data
* must not receive protected API data
* must not access the page by direct URL

Frontend:

* should hide/disable navigation where appropriate
* should prevent route access
* should present an appropriate access-denied state

These frontend controls are usability controls, NOT the security boundary.

## SUBSCRIPTION MANAGEMENT

Determine how the 13 reports should be assigned to existing subscription tiers.

Do not invent new subscription tiers.

Use the existing MAP Nexus commercial model unless the investigation establishes that a change is required.

Provide a proposed report-to-plan matrix for approval before implementation.

## MAINTENANCE

The final solution should allow MAP Nexus administrators/developers to maintain report availability centrally rather than adding individual hard-coded checks throughout the application.

## REQUIRED TESTING

The eventual implementation must test at least:

1. User with entitlement → report accessible.
2. User without entitlement → report inaccessible.
3. Navigation correctly reflects entitlement.
4. Direct URL denied.
5. Backend API denied.
6. Submenu denied.
7. Changing subscription changes access correctly.
8. Tenant isolation maintained.
9. Existing permitted reports continue working.
10. No report exposes data through an unprotected endpoint.

## PHASE 1 — READ ONLY

First inspect and report:

* existing architecture
* reusable components
* current gaps
* current report routes
* current frontend routing
* current entitlement/subscription model
* proposed report-to-subscription matrix
* recommended implementation approach

Do NOT modify code, database or frontend during this assessment.

STOP after the design assessment.
