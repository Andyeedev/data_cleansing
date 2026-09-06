# OC-SEC-004 — Domain & Email Security Assessment
**WORK PACKAGE:** OC-SEC-004 | **ID:** OC-SEC-004 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**PARENT:** Split from OC-SEC-001 (domain and email security)
**OBJECTIVE:** Investigate actual email architecture, assess SPF/DKIM/DMARC requirements, and recommend DNS records — investigation and assessment only, no DNS changes yet.

**INVESTIGATION REQUIRED (per review):**

### 1. How `hello@mapnexus.co.uk` Currently Receives Mail
* Porkbun email forwarding: `hello@mapnexus.co.uk` → `mapnexus@outlook.com`
* Forwarding is configured in Porkbun DNS/email settings
* Mail is received at a free Outlook.com (personal Microsoft account) mailbox
* **No dedicated mailbox** at `mapnexus.co.uk` — forwarding only

### 2. Whether MAP Nexus Sends Email from `@mapnexus.co.uk`
* **No evidence of email sending from `@mapnexus.co.uk`** anywhere in the codebase.
* `lead_service.py` does not send email notifications.
* No SMTP configuration, no SendGrid, no Mailgun, no SES references.
* The only email-related code is the `mailto:hello@mapnexus.co.uk` link in website forms.
* **Conclusion:** MAP Nexus does not currently send email from the domain.

### 3. Whether Mail is Sent Through Outlook.com, Microsoft 365, Porkbun, or Another Provider
* **Receiving:** Porkbun forwarding → Outlook.com (free personal account)
* **Sending:** Not configured — no email sent from `@mapnexus.co.uk`
* **No Microsoft 365 subscription** — using free Outlook.com, not Exchange Online
* **No Porkbun email hosting** — Porkbun provides forwarding only, not mailbox hosting

### 4. Whether Porkbun Forwarding Remains Part of Intended Production Architecture
* **Unknown.** Current setup is a temporary/soft-launch arrangement.
* Production options:
  * **Option A:** Keep Porkbun forwarding (free, but no DKIM, breaks SPF)
  * **Option B:** Microsoft 365 Business Basic ($6/user/month) — proper Exchange Online, DKIM, DMARC, shared mailbox
  * **Option C:** Porkbun email hosting ($3/month) — POP3/IMAP, no DKIM support
  * **Option D:** Other provider (Google Workspace, Zoho, etc.)

**EXISTING IMPLEMENTATION:**

### DNS Records (Porkbun)
| Record Type | Name | Value | Purpose |
|---|---|---|---|
| CNAME | www | blue-forest-0e40c5a03.6.azurestaticapps.net | Website hosting |
| URL Forward | @ | www.mapnexus.co.uk (301) | Apex domain redirect |
| TXT | (not set) | (not set) | **No SPF record** |
| TXT | _dmarc | (not set) | **No DMARC record** |
| MX | (not set) | (not set) | **No MX record** (Porkbun forwarding handles inbound) |

### Email Security Assessment
| Control | Status | Risk |
|---|---|---|
| SPF | NOT CONFIGURED | Anyone can spoof `@mapnexus.co.uk` |
| DKIM | NOT CONFIGURED | No cryptographic signing of outbound mail |
| DMARC | NOT CONFIGURED | No policy for unauthenticated mail |
| MX | NOT SET (Porkbun forwarding) | Inbound mail handled by Porkbun redirect, not direct delivery |

### SPF Analysis
* **Current state:** No SPF record exists.
* **Risk:** Without SPF, anyone can send email from `@mapnexus.co.uk` — recipient servers cannot verify authenticity.
* **Complication:** Porkbun email forwarding **breaks SPF** — when Porkbun forwards mail to Outlook.com, the forwarding server re-sends the mail, which fails the original SPF check. The receiving server (Outlook.com) sees the forwarder's IP, not the original sender's IP.
* **If MAP Nexus starts sending email:** SPF record must authorise the sending infrastructure (e.g., Microsoft 365, SendGrid).
* **If MAP Nexus only receives email:** SPF is still recommended to prevent spoofing of the domain for phishing.

### DKIM Analysis
* **Not possible with current setup.** DKIM requires the sending server to cryptographically sign outbound messages. Porkbun forwarding does not support DKIM signing.
* **If MAP Nexus starts sending email:** DKIM is configured by the sending provider (e.g., Microsoft 365 provides DKIM signing).
* **If MAP Nexus only receives email:** DKIM is not applicable (DKIM is for outbound signing).

### DMARC Analysis
* **Recommended regardless of sending status.** DMARC tells receiving servers what to do with mail that fails SPF/DKIM checks.
* **Minimum viable DMARC:** `v=DMARC1; p=none; rua=mailto:hello@mapnexus.co.uk` (monitor mode — collect reports but don't reject).
* **Production DMARC:** `v=DMARC1; p=quarantine; rua=mailto:hello@mapnexus.co.uk` (quarantine suspicious mail).
* **Strict DMARC:** `v=DMARC1; p=reject; rua=mailto:hello@mapnexus.co.uk` (reject unauthenticated mail).

**FINDINGS:**
* **Positive:** Domain is registered for 2 years. Website uses HTTPS. Email forwarding works.
* **Issues:**
  1. No SPF record — domain can be spoofed
  2. No DKIM — no cryptographic verification possible
  3. No DMARC — no policy for unauthenticated mail
  4. Porkbun forwarding breaks SPF for inbound mail
  5. No email sending infrastructure configured
  6. Using free Outlook.com mailbox (no business email features)

**RISKS:**
* Domain spoofing for phishing — attackers can send email as `@mapnexus.co.uk`
* Spoofed emails may be used in BEC (Business Email Compromise) attacks
* Brand reputation damage if domain is impersonated
* No DMARC reports — cannot detect spoofing attempts

**GAPS:**
* SPF record (after determining sending architecture)
* DKIM (after determining sending architecture)
* DMARC record (can be set immediately in monitor mode)
* Production email architecture decision (keep Porkbun forwarding vs Microsoft 365)

**DEPENDENCIES:**
* Decision on email architecture (Porkbun forwarding vs Microsoft 365) — required before SPF/DKIM
* OC-SEC-003 (privacy) — email processing may be relevant to privacy assessment

**RECOMMENDATION:**
* **Do not add SPF record yet** — wait until email architecture decision is made.
* **Add DMARC record immediately** in monitor mode: `v=DMARC1; p=none; rua=mailto:hello@mapnexus.co.uk` — this starts collecting DMARC reports without affecting mail delivery.
* **Decision required:** Should MAP Nexus adopt Microsoft 365 Business Basic for proper email (DKIM, DMARC, shared mailbox, business features) at $6/user/month?
* **If Microsoft 365 adopted:** SPF record becomes: `v=spf1 include:spf.protection.outlook.com -all`

**STATUS:** ASSESSMENT AND INVESTIGATION — ready for CHATGPT REVIEW → APPROVAL before any DNS changes. No DNS records shall be modified until email architecture decision is made and proposal approved.
