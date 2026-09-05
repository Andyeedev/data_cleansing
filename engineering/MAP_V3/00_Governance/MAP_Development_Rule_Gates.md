# MAP Development Rule Gates (Mandatory)

## Objective

Establish mandatory governance rules that all development activities for MAP must follow to ensure consistent implementation, quality, security, documentation, testing, and approval before changes are accepted.
These rules govern all development activities and must be followed for every task unless explicitly overridden by me.

## 1. Task Analysis (Mandatory)

Before implementing any task:

* Analyse the requirement.
* Explain how you intend to execute it.
* Identify affected components.
* Highlight assumptions, dependencies, risks, and expected outcomes.

No implementation may begin until this analysis has been presented.

## 2. Approval Gate (Mandatory)

Do not make design, architectural, implementation, or functional decisions without my explicit approval.

After presenting your analysis and recommendations, wait for my approval before proceeding.

## 3. Recommendations

Where appropriate:

* Provide the top three recommended implementation approaches.
* Explain the advantages and disadvantages of each.
* If required data sources are unavailable or have low relevance, recommend suitable alternatives.

## Data Source Validation Gate

When implementing frozen frontend features:
Analyse the frozen frontend mock data and expected output.
Identify the required data fields, calculations, and UI behaviour.
Validate against the current MAP database sources, APIs, views, and tables.
Calculate source relevance percentage.
If relevance is low, do not force implementation using poor data.
Provide recommendations for:
improved existing SQL views,
new SQL views,
API changes,
alternative data sources.
Wait for approval before creating new sources or modifying existing ones.


## 4. Frontend Design Standards

All frontend work must comply with the established MAP design standards:

* Existing theme
* Typography
* Colour palette
* Card layouts
* Tabs
* Tables
* Dialogs
* Forms
* Navigation
* Spacing
* Responsiveness
* Accessibility
* Component consistency

Use existing Dashboard, Overview, or Projects pages as design references.

Avoid unnecessary hardcoding. Reuse existing shared components wherever possible.

## 5. Code Protection

Do not modify existing code, components, layouts, or functionality unless:

* It is explicitly included within the approved task, or
* I have specifically authorised the change.

Do not make opportunistic improvements outside the approved scope.

## 6 Mandatory Testing Gate

Before requesting approval, you must perform your own validation and testing of all completed work.

As a minimum, provide a high-level test summary including:

* Build/Compilation Status
* Unit Test Results (where applicable)
* Integration Test Results
* API Endpoint Validation
* Frontend Rendering Verification
* UI Navigation Verification
* Database Verification (where applicable)
* Regression Check (existing functionality not impacted)
* Documentation Verification
* Known Issues / Risks
* Overall Status (PASS / PASS WITH OBSERVATIONS / FAIL)

No task shall be presented for approval until testing has been completed and the test summary has been provided.

If any test fails:

* Explain the failure.
* Explain the impact.
* Recommend corrective action.
* Do not proceed until authorised.


## 7. Documentation Updates

After completing every approved task:

* Update all affected documentation.
* Update all relevant policies.
* Update implementation documents.
* Update Phase 08 documentation where applicable.
* Update both Phase 08AA Frozen Frontend Gap Analysis documents (.md and .xlsx) when changes affect them.

Documentation is considered part of the completion criteria.

## 8. Scope Control

Remain strictly within the approved scope.

Do not begin unrelated improvements, refactoring, optimisation, redesign, or additional functionality without approval.

## 9. Phase Gate

After completing each approved task:

* Stop.
* Summarise what has been completed.
* Identify any outstanding issues.
* Wait for my approval before proceeding to the next task.

No automatic progression to subsequent tasks is permitted.

## 10. Traceability

All implementations must be traceable back to the approved documentation, gap analysis, specifications, or requirements. Where applicable, reference the source document used for implementation.

## 10. Commercial Product Principle

MAP is a commercial enterprise product. All implementations must prioritise:

* Maintainability
* Scalability
* Security
* Performance
* Professional UI/UX consistency
* Reusability
* Future extensibility

Temporary, prototype, or shortcut implementations are not acceptable unless explicitly authorised.




