# MAP Nexus --- Handover & Context Document

**Purpose:** Persistent context for continuing MAP Nexus work in a new
ChatGPT conversation and for OpenCode to maintain.

**Last updated:** 2 September 2026\
**Founder:** Edward Odewale\
**Product:** MAP Nexus\
**Positioning:** Migration Assurance & Data Validation

------------------------------------------------------------------------

## 1. Why This Document Exists

The MAP Nexus project has been developed across a long ChatGPT
conversation. Because that conversation may reach its maximum length,
this document is the authoritative handover/context reference.

A new ChatGPT conversation should read this document first rather than
reconstructing MAP Nexus from months of chat history.

OpenCode should maintain this document whenever a material project
decision, architecture change, launch decision, positioning change,
deployment change, or important constraint is agreed.

------------------------------------------------------------------------

# 2. Product Identity

## Product Name

**MAP Nexus**

## Core Positioning

**Migration Assurance & Data Validation**

MAP Nexus is a migration assurance and data validation platform designed
to help organisations establish, with evidence, that migrated data is:

-   Correct
-   Complete
-   Reconciled
-   Structurally valid
-   Ready for cutover/go-live

The product is **not limited to financial services**.

Financial services is an important early validation segment because of
the founder's background and the strength of the use case, but the
product positioning must remain broad enough for:

-   Financial services
-   Asset management
-   Insurance
-   Pharmaceuticals
-   Healthcare
-   Government
-   Housing
-   Other enterprise organisations undertaking significant data
    migrations

Do not position MAP Nexus publicly as a financial-services-only product.

## Core Product Message

A concise description:

> Migration Assurance and Data Validation platform used after data
> migration and before go-live. It discovers and validates source and
> target systems, discovers and maps datasets/tables and
> attributes/columns, runs repeatable validation and reconciliation
> checks, and provides evidence-based assurance on findings.

Preferred public wording:

> MAP Nexus helps organisations validate that migrated data is correct,
> complete and reconcilable before go-live.

------------------------------------------------------------------------

# 3. Product Capabilities

Current/established scope includes:

1.  Source and target system discovery
2.  Dataset/table discovery
3.  Source-to-target dataset mapping
4.  Column/attribute discovery and mapping
5.  Rule discovery
6.  Source-to-target validation
7.  Data reconciliation
8.  Schema validation
9.  Referential validation
10. Data-quality checks
11. Diagnostics and failure analysis
12. Evidence-based reporting
13. Auditability
14. Repeatable validation
15. Execution orchestration
16. Retry handling
17. Timeout protection
18. Checkpointing/recovery
19. Failure isolation
20. Dependency handling
21. Cloud/hybrid database connectivity
22. Automated testing/certification

The product has been tested across:

-   Snowflake
-   Azure SQL
-   PostgreSQL

Do not publicly expose implementation details behind these capabilities.

------------------------------------------------------------------------

# 4. Technology Context

Known technology stack includes:

-   Python
-   SQL
-   PostgreSQL
-   Snowflake
-   Azure SQL
-   TypeScript
-   JavaScript
-   React
-   Vite
-   Azure
-   Terraform
-   Azure Key Vault
-   Git/source control
-   Automated testing

MAP Nexus has used Snowflake certification environments involving
source/target environments, schemas, warehouses, roles and permissions.

Terraform has been used to provision/manage certification infrastructure
and cloud resources.

Important distinction:

> Terraform can manage Snowflake resources inside an existing Snowflake
> account; do not claim that Terraform created the Snowflake account
> itself unless this has been independently confirmed.

------------------------------------------------------------------------

# 5. Architecture Context

MAP Nexus is metadata-driven.

Important existing concepts include:

-   dataset mappings
-   dataset columns
-   rule-to-dataset mappings
-   rule registry
-   control registry
-   automatic rule discovery
-   execution engine
-   mapping resolver
-   database adapters
-   orchestration
-   reconciliation
-   scoring/reporting

Existing repository/project areas include:

-   `engineering/MAP_V1`
-   `engineering/MAP_V1/ver2/02_output`
-   `engineering/MAP_V2/02_output`

Before implementing anything new, inspect the existing implementation
first.

**Backward compatibility is important.**

Do not replace existing components simply because a cleaner
implementation is possible. Determine what already exists, what is
active, what is legacy, and what is safe to extend.

------------------------------------------------------------------------

# 6. Important Engineering Findings

## MappingResolver

`MappingResolver` exists and returns mappings in the form:

`(source_id, target_id, mappings)`

Some legacy methods may still return two-tuples.

Existing execution code has compatibility handling in some paths, but
legacy methods that directly unpack three values can fail if a two-tuple
reaches them.

## Retry issue

The active DAG path calls `_execute_control_with_retry`.

`ControlExecutor.execute()` catches exceptions and returns an
`ExecutionResult` with status `ERROR`.

`_execute_control_with_retry()` currently risks returning success merely
because `ControlExecutor.execute()` returned, even when the returned
result has an `ERROR` status.

This is a reliability issue that should be considered when modifying
execution/retry behaviour.

## RuleExecutor

Current constructor context has included:

`engine_db, source_db, target_db, batch_id, project_id, control_id, config=None`

Do not assume mappings are directly passed into RuleExecutor without
checking the current implementation.

------------------------------------------------------------------------

# 7. Existing Website Work

There are two important website versions.

## Detailed website

Location:

`engineering/MAP_V1/ver2/02_output/03_Website_Transformation`

This was originally too detailed and revealed too much about the
product.

It should be treated primarily as a reference/source of ideas unless
reviewed and sanitised.

It contains/contained material that is too specific, including claims
and implementation-level information that should not appear on the
public website.

## Simplified website

Location:

`engineering/MAP_V1/ver2/02_output/03_Website_Transformation_Simplified`

This is the preferred public-safe direction.

It should remain simplified and should reflect the current MAP Nexus
positioning.

## Current public website

A public Azure Static Web Apps deployment currently exists:

`https://blue-forest-0e40c5a03.6.azurestaticapps.net`

It is a temporary soft-launch URL.

The site currently reflects:

-   MAP Nexus
-   Migration Assurance & Data Validation
-   Broad, non-financial-only positioning
-   Hero message around validating migrated data before go-live

The temporary URL can later be replaced by the purchased domain.

------------------------------------------------------------------------

# 8. Public IP / Confidentiality Rule

## CRITICAL

Do **not publicly expose MAP Nexus intellectual property or internal
engineering detail.**

Never publish or place in public-facing website/LinkedIn material:

-   Exact database names
-   Tenant IDs
-   Internal table names
-   Exact rule IDs
-   Control IDs
-   Internal repository structures
-   Internal class/module names
-   Internal Python filenames
-   Exact SQL
-   Internal architecture implementation details
-   Key Vault names
-   Terraform resource names
-   Authentication implementation details
-   JWT/key names
-   Internal certification environment names
-   Connection-pool implementation
-   Adapter implementation details
-   Detailed validation algorithms
-   Internal dependency graphs
-   Internal recovery implementation
-   Private infrastructure naming
-   Credentials, secrets or security configuration
-   Any information that makes it easy to reproduce the proprietary
    implementation

Public content should describe **what MAP Nexus does and the business
value**, not reveal exactly how the proprietary engine is implemented.

Use the following folders when checking what can safely be reused:

-   `engineering/MAP_V1`
-   `engineering/MAP_V1/ver2/02_output`
-   `engineering/MAP_V2/02_output`

------------------------------------------------------------------------

# 9. Current Soft Launch

Goal:

Launch quickly for early market validation without waiting for full
commercial infrastructure.

Current temporary public website:

`https://blue-forest-0e40c5a03.6.azurestaticapps.net`

Azure Static Web Apps Free is being used for the temporary public site.

No domain purchase is currently confirmed.

No MAP Nexus Microsoft 365 mailbox is currently confirmed.

------------------------------------------------------------------------

# 10. Domain Decision

Preferred domain:

**mapnexus.co.uk**

`mapnexus.com` is already taken.

The `.co.uk` domain is appropriate for the initial UK-based soft launch.

Do not delay soft launch solely because the `.com` is unavailable.

Recommended registrar candidates investigated:

1.  Porkbun
2.  Cloudflare Registrar

GoDaddy's previously reviewed offer was considered poor value because
of:

-   domain-protection upsell
-   high email renewal
-   large renewal-price jump
-   additional bundled costs

Before purchasing, current live prices must be checked again because
registrar pricing changes.

------------------------------------------------------------------------

# 11. Email Strategy

Preferred public company email:

**hello@mapnexus.co.uk**

Do not publish the founder's personal Yahoo address as the MAP Nexus
public contact email.

For the initial soft launch, a domain email forwarder can be used:

`hello@mapnexus.co.uk` → existing Outlook/Gmail destination.

This avoids paying for a mailbox immediately.

Later, Microsoft 365 / Exchange Online can be introduced.

Potential addresses:

-   hello@
-   sales@
-   info@
-   support@
-   contact@
-   partnerships@

Important distinction:

**Aliases/forwarding are not necessarily separate mailboxes.**

A single paid mailbox can support multiple aliases, while Microsoft 365
shared mailboxes can provide separate shared addresses without requiring
a paid user licence in many scenarios.

Exact Microsoft licensing should be verified at the time of setup.

------------------------------------------------------------------------

# 12. Email Security

For Microsoft 365/Exchange Online:

-   Exchange Online Protection provides baseline anti-spam and
    anti-malware protection.
-   Strong authentication and domain configuration should include SPF,
    DKIM and DMARC.
-   Defender for Office 365 is an additional security layer and should
    not be claimed as included unless the selected licence includes it.

For forwarding-only arrangements, security is partly inherited from the
destination mailbox provider.

Do not claim that the website itself has antivirus scanning simply
because it uses HTTPS/SSL.

Website security should instead be described accurately:

-   HTTPS/TLS
-   managed certificates
-   secure hosting
-   appropriate security headers
-   WAF/DDoS protection where actually configured

------------------------------------------------------------------------

# 13. LinkedIn Strategy

## Personal profile

The founder's existing personal LinkedIn profile should remain the
personal profile.

Do **not** create a second personal LinkedIn account.

Recommended founder positioning:

**Headline:**

> Founder, MAP Nexus --- Migration Assurance & Data Validation

MAP Nexus founder experience:

**Founder --- MAP Nexus**\
**Apr 2026 -- Present**

The personal profile should introduce the founder and product without
exposing technical IP.

## Company Page

Create a separate LinkedIn Company Page:

**MAP Nexus**

Proposed settings:

-   Page name: MAP Nexus
-   Public URL: `map-nexus` if available
-   Website: temporary Azure Static Web Apps URL initially
-   Industry: Software Development
-   Company size: 2--10
-   Company type: Self-employed while unincorporated
-   Founded: 2026
-   Logo: MAP Nexus App Icon 400×400 from the brand kit
-   Admin: Edward Odewale

Do not publish anything without explicit founder approval.

------------------------------------------------------------------------

# 14. LinkedIn Public Positioning

Preferred tagline:

**Migration Assurance & Data Validation**

Preferred company description:

> MAP Nexus is the validation checkpoint for data migrations.
>
> We help organisations establish --- with evidence --- that migrated
> data is correct, complete, reconciled, structurally valid and ready
> for cutover.
>
> MAP Nexus automatically discovers datasets, maps source to target, and
> runs repeatable validation --- including source-to-target comparisons,
> reconciliation, schema and referential checks.
>
> Designed for modern cloud and hybrid data environments, MAP Nexus
> supports migration assurance across technologies including Snowflake,
> Azure SQL and PostgreSQL.
>
> MAP Nexus is in early market validation. Financial services is an
> important early validation segment, while we are also learning from
> pharmaceuticals, government, housing, insurance, healthcare and other
> enterprise teams undertaking significant data migrations.

Avoid claims such as:

-   first
-   only
-   market-leading
-   50+ clients
-   98% accuracy
-   SOC 2 certified
-   customer logos
-   enterprise customers

unless independently verified and approved.

------------------------------------------------------------------------

# 15. Founder / LinkedIn Content Strategy

Soft-launch content should be founder-led.

Recommended frequency:

**2--3 posts per week maximum.**

Initial themes:

1.  The migration-validation problem
2.  Why row counts alone are insufficient
3.  What happens when migrated data is wrong after go-live
4.  Introducing MAP Nexus
5.  Building and validating the product
6.  Lessons from migration/data engineering work

Do not publish:

-   confidential screenshots
-   source code
-   SQL
-   internal architecture
-   tenant information
-   internal infrastructure
-   customer information
-   proprietary algorithms

------------------------------------------------------------------------

# 16. Previous Experience vs MAP Nexus

The founder has previous Azure/Data Factory/cloud experience.

This includes work involving:

-   Azure Data Factory
-   cloud triggers
-   automated file ingestion
-   data lake environments
-   SQL Server
-   PostgreSQL
-   ETL/reporting

Important rule:

Do not claim that ADF/Azure Functions were implemented inside MAP Nexus
unless they actually are.

It is acceptable to describe these technologies as previous project
experience.

Similarly, do not claim hands-on dbt implementation in MAP Nexus unless
it has actually been implemented.

------------------------------------------------------------------------

# 17. DevOps / CI-CD Positioning

MAP Nexus already has foundations relevant to DevOps:

-   Git
-   branching
-   source control
-   automated testing
-   Terraform/IaC
-   controlled changes
-   deployment practices
-   troubleshooting/reliability practices

Do not claim a mature Azure DevOps/GitHub Actions CI/CD platform unless
it has actually been implemented.

Safe interview wording:

> I've used Git/source control, branching, automated testing,
> infrastructure-as-code and controlled deployment practices. MAP Nexus
> has those foundations, and I'm continuing to extend the CI/CD
> automation around them.

------------------------------------------------------------------------

# 18. AI

AI-assisted development is part of the founder's current development
workflow.

AI-related product capability is being explored as part of MAP Nexus.

Do not claim a fully deployed AI assistant or production AI service
unless it has actually been implemented and tested.

------------------------------------------------------------------------

# 19. Commercial / Market Context

Competitor research has identified an established
migration/data-validation market.

Relevant adjacent/competitive products include:

-   Datafold
-   Datagaps
-   SQLines
-   Precisely Connect
-   Qlik/Talend
-   AWS Glue

MAP Nexus should not claim to be the only migration-validation product.

The opportunity is to position MAP Nexus around:

**Migration assurance + evidence + repeatability + governance**

rather than generic ETL/data integration.

------------------------------------------------------------------------

# 20. Microsoft / Azure Context

MAP Nexus has an Azure-native direction.

Microsoft Founders Hub was being prepared/considered.

Do not assume Founders Hub benefits have been granted unless the account
actually confirms approval.

In particular:

-   Do not assume free Microsoft 365 Business Standard.
-   Do not assume Azure credits are active.
-   Verify current eligibility and benefits before relying on them.

Azure Static Web Apps Free is suitable for the current public
soft-launch website.

------------------------------------------------------------------------

# 21. Current Priority

The immediate objective is:

**Get MAP Nexus into early market validation as quickly as possible
without exposing IP or overbuilding.**

Priority order:

1.  Keep the temporary public website live.
2.  Ensure public copy reflects MAP Nexus and broad Migration Assurance
    & Data Validation positioning.
3.  Purchase/configure `mapnexus.co.uk` when approved.
4.  Configure professional email.
5.  Prepare LinkedIn personal profile and Company Page.
6.  Obtain founder approval before publishing.
7.  Begin small-scale founder-led market validation.
8.  Continue product engineering based on real feedback.

Avoid spending weeks polishing infrastructure before testing market
demand.

------------------------------------------------------------------------

# 22. OpenCode Operating Rules

OpenCode must:

1.  Inspect existing implementation before creating new implementation.
2.  Preserve backward compatibility.
3.  Maintain this handover document when major decisions change.
4.  Never publish externally without explicit founder approval.
5.  Never purchase domains, licences or services without explicit
    founder approval.
6.  Never expose MAP Nexus IP.
7.  Treat the simplified website as the default public-safe direction.
8.  Treat the detailed website as reference material unless fully
    sanitised.
9.  Keep financial services as an early segment, not the entire product
    definition.
10. Verify live pricing/licensing before making purchase
    recommendations.
11. Distinguish verified facts from recommendations.
12. Do not invent customers, employees, certifications, revenue,
    security certifications or business history.
13. When uncertain, inspect the repository and existing documentation
    before assuming something is missing.
14. Keep public copy business-focused rather than
    implementation-focused.

------------------------------------------------------------------------

# 23. Key Repository Locations

Primary areas to inspect:

`engineering/MAP_V1`

`engineering/MAP_V1/ver2/02_output`

`engineering/MAP_V2/02_output`

Website:

`engineering/MAP_V1/ver2/02_output/03_Website_Transformation`

Simplified public website:

`engineering/MAP_V1/ver2/02_output/03_Website_Transformation_Simplified`

Soft-launch website preparation:

`engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared`

------------------------------------------------------------------------

# 24. What a New ChatGPT Conversation Should Do

When this document is supplied to a new ChatGPT conversation, the
assistant should:

1.  Read this document completely.
2.  Treat it as the current MAP Nexus baseline.
3.  Ask only for information that is genuinely missing.
4.  Do not reconstruct months of history unnecessarily.
5.  Preserve the broad MAP Nexus positioning.
6.  Check existing files/code before recommending new architecture.
7.  Keep public communications safe from IP disclosure.
8.  Continue from the current priority rather than restarting the
    project.

------------------------------------------------------------------------

# 25. Current Status Snapshot

**Product:** MAP Nexus\
**Positioning:** Migration Assurance & Data Validation\
**Stage:** Early market validation / soft launch\
**Public website:** Azure Static Web Apps temporary URL\
**Domain:** mapnexus.co.uk not yet confirmed purchased\
**Company email:** hello@mapnexus.co.uk not yet confirmed provisioned\
**LinkedIn Company Page:** preparation stage; do not publish without
approval\
**Founder LinkedIn:** existing personal profile; update rather than
create a second profile\
**Primary public website direction:** Simplified\
**Financial services:** early validation segment, not product
restriction\
**IP protection:** mandatory\
**Immediate objective:** launch quickly and validate the market

------------------------------------------------------------------------

# 26. Change Log

  -----------------------------------------------------------------------
  Date                                Change
  ----------------------------------- -----------------------------------
  2026-09-02                          Created persistent MAP Nexus
                                      handover/context baseline.

  2026-09-02                          Confirmed broad positioning:
                                      Migration Assurance & Data
                                      Validation.

  2026-09-02                          Confirmed temporary Azure Static
                                      Web Apps public deployment.

  2026-09-02                          Confirmed `mapnexus.co.uk` is the
                                      preferred domain candidate but not
                                      yet purchased.

  2026-09-02                          Confirmed professional email should
                                      use MAP Nexus domain rather than
                                      personal Yahoo address.

  2026-09-02                          Confirmed simplified website is the
                                      preferred public-safe direction.

  2026-09-02                          Confirmed no external publishing
                                      without founder approval.
  -----------------------------------------------------------------------

**Document maintenance rule:** Add a new change-log entry whenever a
material decision changes.
