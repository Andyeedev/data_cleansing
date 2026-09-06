# OC-SEC-003 — Website Privacy & Data Collection Assessment
**WORK PACKAGE:** OC-SEC-003 | **ID:** OC-SEC-003 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**PARENT:** Split from OC-SEC-001 (privacy and data collection)
**OBJECTIVE:** Assess UK GDPR/privacy requirements, lawful basis, privacy notice, data collection, retention, deletion, subject access, data controller, processors, international transfers, access controls, consent, cookies, breach considerations — assessment and gap report only, no remediation yet.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/index.html` — lead form (7 fields + source_form + utm_source + referrer)
* `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/contact.html` — contact form (same 7 fields)
* `app/services/lead_service.py` — `core.leads` INSERT (12 columns)
* `app/api/routes/lead_routes.py` — `POST /api/v1/leads` (anonymous, no auth)
* `app/db/connection.py` — PostgreSQL connection (hosting location unknown)
* `hello@mapnexus.co.uk` → `mapnexus@outlook.com` — Porkbun email forwarding
* `www.mapnexus.co.uk` — Azure Static Web Apps Free (West Europe region)
* Footer links: `Privacy Policy` → `#` (placeholder), `Terms of Service` → `#` (placeholder)

**EXISTING IMPLEMENTATION:**

### Data Controller
* **Not identified.** No privacy notice, no data controller information on the website.
* MAP Nexus appears to be the data controller (Edward Odewale, Founder), but this is not stated anywhere.

### Lawful Basis for Processing Leads
* **Not established.** No lawful basis documented.
* Lead form collects: full name, work email, company, org size, industry, role, challenge, message, source form, UTM source, referrer.
* Implicit consent via form submission, but no explicit consent checkbox, no link to Privacy Policy.
* Potential lawful bases: Consent (Article 6(1)(a)), Legitimate Interests (Article 6(1)(f)) for B2B marketing.
* **Decision required:** Which lawful basis applies? This is a decision requiring review, not a legal claim.

### Privacy Notice
* **Not exists.** Footer links point to `#` (placeholder). No privacy notice on the website.
* UK GDPR Article 13/14 requires a privacy notice when collecting personal data.

### Information Collected
| Data Point | Category | Required | Purpose |
|---|---|---|---|
| Full Name | Personal data | Yes | Contact lead |
| Work Email | Personal data | Yes | Contact lead |
| Company | Business data | No | Qualify lead |
| Org Size | Business data | No | Segment lead |
| Industry | Business data | No | Segment lead |
| Role | Business data | No | Segment lead |
| Challenge | Business data | No | Qualify lead |
| Message | Personal data | No | Context |
| Source Form | Analytics | Auto | Form attribution |
| UTM Source | Analytics | Auto | Marketing attribution |
| Referrer | Analytics | Auto | Marketing attribution |

### Purpose Limitation
* **Not documented.** Purposes implied by form labels but not formally stated.
* Implied purposes: respond to inquiry, qualify lead, send marketing communications.
* No distinction between sales follow-up and marketing communications.

### Retention
* **Not defined.** Leads stored indefinitely in `core.leads`. No retention policy.
* No automatic purge, no anonymization, no review schedule.

### Deletion / Erasure
* **Not implemented.** No API endpoint or process for lead data deletion.
* UK GDPR Article 17 (Right to Erasure) requires ability to delete personal data on request.
* No `DELETE FROM core.leads WHERE ...` endpoint exists.

### Subject Access Process
* **Not implemented.** No process for leads to request their data (Article 15 Subject Access Request).
* No self-service portal, no email address for SAR, no response timeline documented.

### Data Processor / Sub-Processor
* **Not documented.** Processors include:
  * Azure (Static Web Apps hosting — West Europe region)
  * Porkbun (domain registration + email forwarding)
  * Microsoft (Outlook.com email receiving)
  * PostgreSQL database (hosting location — likely Azure, not confirmed)
* No Data Processing Agreements (DPAs) documented.

### International Transfer
* **Not assessed.** Azure West Europe region is EU/UK, but:
  * Porkbun is US-based (domain registrar)
  * Microsoft Outlook.com may process data in US/Global
  * PostgreSQL hosting location unknown
* UK GDPR Chapter V requires assessment of international transfers.

### Access Controls
* `POST /api/v1/leads` is anonymous (no auth required) — appropriate for public form.
* `GET /api/v1/leads` has NO authentication — **任何人都 can list all leads** (personal data exposed).
* No role-based access control on lead data.

### Lead Data Security
* Leads stored in plain text (`full_name`, `work_email`, `company`, etc.).
* No encryption at rest (depends on PostgreSQL/Azure config — not confirmed).
* No encryption in transit beyond HTTPS (which is in place).
* `work_email_hash` field is actually plain text (not hashed) — misleading column name.

### Auditability
* No audit log for lead data access.
* No tracking of who accessed which lead record.
* `core.leads` has `created_at` timestamp but no `accessed_at` or `accessed_by`.

### Consent / Marketing Distinction
* **Not distinguished.** Form submission implies consent to be contacted, but:
  * No explicit consent checkbox
  * No distinction between "contact me about my inquiry" and "send me marketing emails"
  * No opt-in for marketing communications
  * No unsubscribe mechanism

### Cookies / Tracking
* **No cookies used** (confirmed — no `document.cookie`, no analytics scripts, no tracking pixels).
* No Google Analytics, Clarity, Hotjar, Facebook Pixel, LinkedIn Insight Tag.
* **Positive for privacy** — but no Cookie Policy confirming this.

### Breach / Incident
* **No breach notification process documented.**
* UK GDPR Article 33 requires notification to ICO within 72 hours.
* Article 34 requires notification to affected individuals if high risk.
* No incident response plan for lead data breach.

**FINDINGS:**
* **Positive:** No cookies/tracking (privacy-friendly), no analytics scripts, forms are simple and transparent about what they collect.
* **Issues:**
  1. No Privacy Policy (UK GDPR Article 13/14 violation)
  2. No lawful basis established (Article 6)
  3. No consent mechanism (no checkbox, no explicit consent)
  4. No retention policy (leads stored indefinitely)
  5. No deletion process (Article 17 right to erasure not implementable)
  6. No subject access process (Article 15)
  7. `GET /api/v1/leads` has NO authentication — anyone can list all leads
  8. No data controller information
  9. No processor/sub-processor documentation
  10. No international transfer assessment
  11. No audit logging for lead access
  12. No consent/marketing distinction
  13. No breach notification process

**RISKS:**
* UK GDPR non-compliance — ICO enforcement action
* Lead data exposure via unauthenticated `GET /api/v1/leads`
* No ability to fulfil SAR or erasure requests
* No breach notification process

**GAPS:**
* Privacy Policy page (UK GDPR compliant)
* Cookie Policy page (confirm no cookies)
* Consent checkbox on lead forms
* Retention policy (e.g., 24 months, then anonymize)
* Deletion API endpoint + process
* Subject Access Request process
* Authentication on `GET /api/v1/leads`
* Data controller information
* Processor/sub-processor documentation
* International transfer assessment
* Audit logging for lead access
* Consent/marketing distinction
* Breach notification process

**DEPENDENCIES:**
* OC-SEC-001 (rate limiting on leads) — independent
* OC-COM-001a (tenant middleware) — may affect lead data access controls
* Legal advice — recommended for Privacy Policy wording

**RECOMMENDATION:**
* **Do not draft legal claims or assume a lawful basis** — this requires a decision by the data controller (Edward Odewale) with legal review.
* **First priority:** Add authentication to `GET /api/v1/leads` (currently anyone can list all personal data).
* **Second priority:** Create Privacy Policy page with required UK GDPR information.
* **Third priority:** Add consent checkbox + retention policy + deletion endpoint.

**STATUS:** ASSESSMENT AND GAP REPORT — ready for CHATGPT REVIEW → APPROVAL before any remediation. No privacy remediation shall be committed until reviewed.
