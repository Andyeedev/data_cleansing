# MAP Nexus --- Website & Domain Registration Handover

**Purpose:** Continuity document for future ChatGPT/OpenCode
conversations covering MAP Nexus domain/website registration, registrar
selection, privacy, security and related decisions.

**Current date of this handover:** 5 September 2026

------------------------------------------------------------------------

## 1. Project / Domain

-   **Company / product:** MAP Nexus
-   **Website/domain:** `mapnexus.co.uk`
-   **Business positioning:** Migration Assurance & Data Validation
-   **Core proposition:** MAP Nexus is the validation checkpoint for
    data migrations. It helps organisations establish, with evidence,
    that migrated data is correct, complete, reconciled, structurally
    valid and ready for cutover.
-   **Current stage:** Early market validation.
-   **Important positioning constraint:** Do not publicly imply that MAP
    Nexus is restricted to a fixed list of database/cloud technologies.
    Current validated environments include Snowflake, Azure SQL and
    PostgreSQL, but public wording should generally use broader language
    such as **modern cloud, hybrid and enterprise data environments**.

------------------------------------------------------------------------

## 2. Registrar / Porkbun Registration Review

The user reviewed a Porkbun checkout for `mapnexus.co.uk`.

### Cart details shown

-   Registration term: **2 years**
-   Displayed price: **\$11.32 crossed out / \$9.98 current price**
-   Estimated renewal: **\$5.66**
-   Total shown: **\$9.98 USD**
-   Porkbun stated: **No refunds / no exceptions** for domain
    registrations and renewals.
-   Porkbun also displayed a notice:
    -   The TLD does not provide a renewal upon transfer.
    -   The transfer price is for the transfer only.
-   Porkbun's order summary listed free-with-domain services including:
    -   WHOIS Privacy (where supported)
    -   Web Hosting Trial
    -   Email Hosting Trial
    -   Quick Connect
    -   SSL Certificate
    -   Email Forwarding
    -   URL Forwarding

### Critical privacy warning shown by Porkbun

Porkbun explicitly stated that this TLD **does not allow WHOIS
privacy**, although personal information is generally redacted from
public WHOIS.

Porkbun also warned that some registries may make contact information
public where the registrant is registering as a **company, organisation,
or something other than an individual**.

### Privacy conclusion / concern

This is the principal issue the user is concerned about.

For `.co.uk`, do **not** assume that Porkbun's generic "WHOIS Privacy"
service means the registrant information is completely private.
Porkbun's checkout warning specifically says this TLD does not support
WHOIS privacy.

Therefore:

1.  The registrar may still need the real registrant/contact details.
2.  Public exposure depends on the `.uk` registry's applicable rules and
    registrant status.
3.  The user is particularly concerned about personal privacy rights.
4.  Do not represent the Porkbun WHOIS privacy checkbox as providing
    full `.co.uk` privacy.
5.  Before finalising/locking in a registration structure, verify the
    current `.uk` registry treatment of individual vs company
    registrants and what information is publicly disclosed.

------------------------------------------------------------------------

## 3. Porkbun Account Settings Reviewed

The user provided the full Porkbun account settings screen. The
following settings were identified as relevant.

### Search settings

-   Hide unavailable domains
-   Custom search results

These are convenience settings and are **not central to MAP Nexus
privacy/security**.

### Domain renewal settings

#### Early Auto Renew --- 45 days

Porkbun says this attempts renewal 45 days before expiry instead of one
day before expiry, but only where auto-renew is enabled.

Important warning from Porkbun: - Early renewals are non-refundable. -
Turning the setting off later does not reverse a renewal already
processed.

**Decision/attention:** Review whether this should be enabled. There is
no need to enable early renewal merely for security. Standard auto-renew
is usually the more important setting for preventing accidental domain
expiry.

#### New Registration Auto Renew Default

Porkbun can default new registrations to auto-renew.

**Decision/attention:** For important production domains such as
`mapnexus.co.uk`, auto-renew is generally important to avoid accidental
expiry. However, the setting shown is only the **default for new
registrations** and does not change existing domains.

------------------------------------------------------------------------

## 4. Account Privacy / Marketing

### Non-transactional email

Porkbun can send newsletters, offers and other
marketing/non-transactional email.

**Privacy preference:** If minimising marketing exposure is a priority,
leave this disabled.

### Optional marketing tracking

Porkbun states that optional tracking uses cookies and similar
technologies to personalise content/ads, analyse traffic and improve the
website, and that information may be shared with advertising and
analytics partners.

**Privacy preference:** Leave optional marketing tracking disabled
unless there is a specific reason to enable it.

### Support Chat Widget

Porkbun says enabling the AI assistant/HelpScout support widget may
share account information with those services for contextual support.

**Privacy preference:** Leave disabled unless support is needed.

------------------------------------------------------------------------

## 5. Account Security Settings

These are more important than the search settings.

### Successful Login Notifications

Recommended: **ON**

This provides visibility if the account is accessed successfully.

### Failed Login Notifications

Recommended: **ON**

This provides early warning of attempted account compromise.

### App-based 2FA

Porkbun describes app-based 2FA as a strong method.

Recommended: **ON** if a compatible authenticator is available.

### Security Key / WebAuthn

Porkbun describes this as its **most secure 2FA method**.

If the user has a compatible security key, this is the strongest
account-protection option.

### Passkeys

Porkbun states passkeys are phishing-resistant and can replace
passwords.

A passkey is a strong option where supported and practical.

### One-time-use 2FA recovery codes

These must be stored securely offline or in an appropriate secure
password manager/recovery location.

Do not leave recovery codes exposed in ordinary notes/email.

### Email-based 2FA

Porkbun explicitly describes this as the **least secure 2FA method**,
although better than nothing.

If app-based 2FA or a security key is enabled, those should take
precedence.

### IP restriction

Porkbun allows login only from specified IPv4/IPv6 addresses, but warns
that users can lock themselves out.

**Recommendation:** Do not use this unless the user's IP is static/known
and there is a deliberate operational reason. A normal changing home/ISP
IP makes this risky.

### Disable Forgotten Password / 2FA Bypass

Porkbun offers an additional security measure that prevents normal
forgotten-password/2FA bypass and instead requires identity
verification.

This provides stronger protection against account recovery abuse but
carries a serious lockout risk.

Porkbun explicitly warns that the account phone number, email address
and physical/mailing address must be accurate before using additional
security measures.

**Decision:** Treat this as an advanced hardening option. Do not enable
casually. Ensure account recovery details are correct first.

### Unrecognized Device 2FA

Porkbun states that if no other 2FA is enabled, it can require an email
one-time code when a device is not recognised.

**Security principle:** Do not disable this unless there is a deliberate
reason.

------------------------------------------------------------------------

## 6. Afternic

Porkbun includes an Afternic setting concerning fast-transfer opt-ins.

The user should **reject/disable unexpected fast-transfer opt-ins**
unless intentionally selling a domain.

MAP Nexus domains should not be listed for sale accidentally.

------------------------------------------------------------------------

## 7. Recent Login History

A recent successful login was shown in the user's Porkbun account:

-   Date/time shown: **2026-09-03 10:45:58**
-   IPv6 address was displayed.

The address itself should **not be copied into public documentation** or
shared unnecessarily.

------------------------------------------------------------------------

## 8. Important Domain Privacy Principle

For MAP Nexus, domain privacy and company privacy should be treated
separately.

### Registrar/account privacy

Protect: - registrar login - email address - phone number - physical
address - 2FA/recovery information - API keys - domain transfer/security
controls

### Public domain registration privacy

Separately determine what `.co.uk` registration data can be publicly
disclosed under current Nominet/UK registry rules, particularly
depending on whether the registrant is an individual or an
organisation/company.

Do not assume that a registrar's generic WHOIS Privacy product overrides
the TLD's rules.

------------------------------------------------------------------------

## 9. Outstanding Website/Domain Actions

1.  Confirm the final `mapnexus.co.uk` registration/ownership
    arrangement.
2.  Verify the current `.uk`/Nominet public-registration privacy rules
    before choosing an individual vs organisation/company registrant
    representation.
3.  Review Porkbun account settings with privacy and security as
    priorities.
4.  Enable strong account security:
    -   App 2FA and/or security key/passkey.
    -   Successful login notifications.
    -   Failed login notifications.
    -   Keep recovery codes secure.
5.  Keep optional marketing tracking disabled if privacy is the
    priority.
6.  Keep non-transactional marketing email disabled if not wanted.
7.  Avoid IP restriction unless there is a stable-IP requirement.
8.  Do not expose registrar credentials, recovery details or API keys in
    project documents.
9.  Ensure the public website consistently uses MAP Nexus positioning
    and does not expose internal implementation/IP.

------------------------------------------------------------------------

## 10. Public Messaging Constraints Relevant to Website

The website and public profiles should:

-   Describe MAP Nexus as a **migration assurance / validation
    checkpoint**.
-   Emphasise evidence, correctness, completeness, reconciliation,
    structural validity and readiness for cutover.
-   Describe the platform as working across **modern cloud, hybrid and
    enterprise data environments**.
-   Avoid implying that Snowflake, Azure SQL and PostgreSQL are the only
    supported technologies.
-   Current validated environments can be mentioned where useful using
    wording such as **"including Snowflake, Azure SQL and PostgreSQL"**.
-   Avoid exposing:
    -   internal rule IDs
    -   control IDs
    -   tenant IDs
    -   database schemas
    -   internal architecture
    -   internal implementation details
    -   proprietary validation logic
    -   credentials or secrets.

------------------------------------------------------------------------

## 11. Continuity Notes

This document is intended to be maintained as MAP Nexus evolves.

When new domains, registrar decisions, website infrastructure, privacy
decisions or security controls are introduced, update this file rather
than forcing a future ChatGPT conversation to reconstruct decisions from
old conversations.
