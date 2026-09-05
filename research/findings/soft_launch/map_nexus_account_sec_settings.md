Yes. I’d pay particular attention to the account-security settings, rather than the search/marketing settings. For MAP Nexus, the domain account is effectively a critical business asset: losing control of mapnexus.co.uk could mean losing the website, email forwarding, and eventually the company’s public identity.

Based specifically on the settings you pasted, this is what I recommend:

Setting	Recommendation	Priority
Hide Unavailable Domains	ON — personal preference	Low
Custom Search Results	OFF	Low
Early Auto Renew (45 days)	OFF	Medium
New Registrations Default Auto Renew	ON	High
Receive Non-transactional Email	OFF	Low
Optional Marketing Tracking	OFF	Medium
Support Chat Widget	OFF	Medium
Successful Login Notifications	ON	High
Failed Login Notifications	ON	High
API – Opt In All Domains	OFF unless you actually need API	High
WHOIS Privacy by Default	ON	High
Afternic Fast Transfer Opt-ins	OFF / reject	High
App-based 2FA	ON	Critical
Email-based 2FA	OFF if app/security key is enabled	Medium
Security key	ON if you have one	Critical
Passkey	ON	Critical
IP Restriction	OFF	High
Unrecognized Device 2FA	ON	High
Disable Forgotten Password	Don't enable yet	High

There are a few nuances worth explaining.

1. 🔴 Most important: 2FA
App-based 2FA — TURN ON

This is the first thing I'd configure.

Use an authenticator app such as 2FAS, Aegis, Google Authenticator, etc.

The important part isn't which app you choose; it's that the Porkbun account cannot be accessed with just your password.

For MAP Nexus, I'd consider this essential.

Even better: security key

Porkbun says security keys are its most secure 2FA method.

If you already have a hardware security key, I'd use it.

If you don't, app-based 2FA is absolutely fine for now.

You don't need to buy a YubiKey just to register this domain.

2. 🔴 Passkey — TURN ON

I'd also enable passkeys.

Passkeys are particularly attractive because they're resistant to phishing.

So ideally your hierarchy becomes:

Passkey/security key → authenticator app → one-time recovery codes

rather than:

password → email recovery

I'd enable passkeys on the device(s) you actually control and use.

3. 🔴 One-time-use 2FA codes — SAVE THEM

This is extremely important.

When Porkbun gives you the recovery/one-time codes, don't leave them sitting in an email or screenshot folder.

Store them securely somewhere you can access if your phone is lost.

For example, a reputable password manager's secure notes section is appropriate.

The worst scenario would be:

Enable 2FA → lose phone → discover recovery codes weren't saved → struggle to regain domain account.

So do this before relying on 2FA.

4. 🟢 Successful Login Notifications — ON

Definitely enable.

You want to know if somebody successfully logs into your Porkbun account.

For a domain account, an unexpected successful-login email is useful early warning.

5. 🟢 Failed Login Notifications — ON

Also enable.

This is useful because repeated failed attempts can tell you that somebody is trying to access the account.

You may get occasional noise, but I'd rather have that noise on an account controlling a company domain.

6. 🟢 Unrecognized Device 2FA — ON

Leave this enabled.

Porkbun describes it as a fallback protection when no other 2FA method is enabled.

Once you have app-based 2FA/passkey/security key enabled, those stronger mechanisms should take precedence.

So there's no reason to disable the fallback.

7. 🟢 WHOIS Privacy by Default — ON

Absolutely leave this ON.

Even though .co.uk doesn't support Porkbun's conventional WHOIS privacy mechanism, there's no downside to leaving the default enabled.

It means:

If you later register another TLD that does support WHOIS privacy, Porkbun won't accidentally register it publicly.

For MAP Nexus .co.uk, the important protection is still the Nominet privacy treatment we discussed earlier.

So:

WHOIS Privacy Default = ON.

8. 🔴 Afternic — reject fast-transfer opt-ins

This one is easy to overlook.

You have:

Allow Fast Transfer Opt-Ins

I would turn this OFF / enable "Reject Afternic fast transfer opt-ins."

You aren't trying to sell mapnexus.co.uk.

There's no benefit to allowing third-party domain-sale mechanisms to request/attempt fast-transfer enrolment.

For an important brand domain:

No domain selling → no fast-transfer opt-ins.

9. 🟢 New Registrations Default Auto Renew — ON

This one is important.

I'd set:

New registration auto renew default = ON

Why?

Because forgetting to renew mapnexus.co.uk could eventually cause a major business problem.

The domain will become the foundation for:

mapnexus.co.uk
hello@mapnexus.co.uk
website
LinkedIn/company presence
future Microsoft 365
DNS
potentially application services

You don't want the domain accidentally expiring because you forgot a renewal email.

But...

I would NOT enable:

Early Auto Renew (45 days)

Leave that OFF.

Normal renewal shortly before expiry is sufficient.

There's no meaningful advantage for you in having Porkbun charge you 45 days early, particularly since they explicitly warn:

Early renewals are non-refundable.

So my combination is:

Auto-renew new registrations: ON
Early 45-day renewal: OFF

That's what I'd use.

10. 🟢 Marketing tracking — OFF

You have:

Allow Optional Marketing Tracking

I'd leave it OFF.

There is absolutely no reason to grant additional marketing/analytics consent just to manage your domain.

This doesn't affect the domain itself.

So:

OFF.

11. 🟢 Non-transactional email — OFF

I'd leave this OFF unless you actually want Porkbun newsletters and promotional emails.

It has zero bearing on domain security.

You will still receive transactional/security emails.

So:

OFF is fine.

12. 🟢 Support Chat Widget — OFF

I'd leave this OFF.

The wording is particularly relevant:

"your account information may be shared with these services to provide contextual support."

Since you're specifically concerned about privacy, there's little reason to enable an external support widget unless you need it.

If you need support later, you can enable/use support when required.

So:

OFF.

13. 🔴 API — leave it OFF

This is important from a security perspective.

You currently don't need Porkbun's API to register or operate MAP Nexus.

Don't enable API access simply because it's available.

Once you start using APIs, you introduce:

API credentials
programmatic domain/DNS access
another credential that needs protection
another potential attack surface

For now:

API = OFF

If later we decide that MAP Nexus needs automated DNS/domain management, we can deliberately configure it then.

14. 🔴 IP Restriction — DO NOT ENABLE

I'd leave this OFF.

It sounds attractive:

"Only allow logins from certain IP addresses."

But your own Porkbun screen gives the reason:

"You can lock yourself out."

And your connection may have a changing public IP.

You don't need this.

You've already got stronger practical controls available:

Password + 2FA + passkey/security key + login notifications

That's a much better fit for you.

15. ⚠️ Disable Forgotten Password — don't enable it yet

This is interesting.

Porkbun allows you to make account recovery considerably more difficult:

"You will need to complete an ID verification process."

For a highly sensitive account, there is an argument for doing this.

But I wouldn't enable it immediately.

First establish:

Correct account email
Correct phone
Correct physical/mailing address
App-based 2FA
Passkey/security key
Recovery codes securely stored
Successful login notifications
Failed login notifications

Then, once you've got all that documented and safely stored, we can reconsider whether you want to disable the weaker account-recovery path.

For now:

Leave it alone.

Your ideal Porkbun configuration

If you're looking at the settings page now, I'd aim for roughly this:

Search

Hide unavailable domains: ON
Custom search results: OFF

Renewal

Early Auto Renew (45 days): OFF
New Registrations Default Auto Renew: ON

Privacy/marketing

Non-transactional email: OFF
Optional Marketing Tracking: OFF
Support Chat: OFF
WHOIS Privacy Default: ON

Domain selling

Afternic Fast Transfer Opt-ins: REJECT / OFF

Security

Successful Login Notifications: ON
Failed Login Notifications: ON

App-based 2FA: ON
Email-based 2FA: OFF once stronger 2FA is established
Security Key: ON if available
Passkey: ON
Unrecognized Device 2FA: ON

IP Restriction: OFF

Disable Forgotten Password: OFF for now

One thing I want to emphasise about your privacy concern

There are two separate problems here:

Privacy

"Can somebody publicly look up MAP Nexus and find my home address?"

For .co.uk, this is primarily governed by Nominet, not the Porkbun "WHOIS Privacy" toggle.

Security

"Can somebody take control of the MAP Nexus domain?"

This is primarily about your Porkbun account security.

And looking at the settings you've posted, the second issue is actually the one I'd be most concerned about.

I'd therefore prioritise:

1. App/passkey/security-key 2FA
2. Recovery codes
3. Login alerts
4. Auto-renew
5. WHOIS privacy default
6. Reject Afternic transfers
7. Keep tracking/API/IP restriction disabled

Once you've configured those, I'd be quite comfortable proceeding with the mapnexus.co.uk purchase on Porkbun.

And one final point: don't use your MAP Nexus domain as the only recovery route for your Porkbun account. Your registrar account must remain recoverable independently of the domain/email services it