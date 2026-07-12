# Phase 2.4 — Business Model & Pricing Strategy

**Version:** 2.1  
**Product:** FS Migration Validation Engine  
**Currency:** GBP (£) — UK-based company

---

## Executive Summary

The FS Migration Validation Engine follows a **SaaS subscription model** with tiered pricing based on migration project volume, number of systems, and support level. The model is designed for predictable recurring revenue (ARR) while allowing expansion through professional services and future AI modules.

Revenue is generated from four complementary streams:
1. **Enterprise SaaS subscriptions** — Core recurring revenue
2. **Professional services** — Implementation, custom controls, migration advisory
3. **Enterprise support & SLAs** — Premium support tiers (future)
4. **AI mapping module** — Azure OpenAI-powered recommendations (future)

---

## Revenue Streams

### 1. SaaS Subscriptions (Primary)

| Tier | Target | Price (GBP/month) | Includes |
|------|--------|-------------------|----------|
| **Starter** | Pilot projects, small migrations | £1,500–£3,500 | 1 migration project, 2 databases, CLI access |
| **Professional** | Mid-size bank migrations | £3,500–£10,000 | 3 concurrent projects, 5 databases, API access |
| **Enterprise** | Large-scale migrations | £10,000–£35,000 | Unlimited projects, multi-database, audit export, priority support |
| **Strategic** | Enterprise-wide deployment | Custom | Custom controls, multi-region, dedicated support, SLA |

**Typical annual contract value (ACV):** £30,000–£80,000 per customer — consistent with UK enterprise regtech SaaS benchmarks.

### 2. Professional Services

| Service | Description | Price (GBP) |
|---------|-------------|-------------|
| **Implementation** | Platform setup, CI/CD integration, customer onboarding | £15,000–£40,000 |
| **Custom Controls** | Development of customer-specific validation rules | £5,000–£20,000 per control |
| **Migration Advisory** | Migration validation planning and governance consulting | £1,500–£7,500/day |

Professional services are typically 15–20% of total revenue in Years 1–2, reducing to 5–10% as the platform scales — consistent with SaaS industry benchmarks.

### 3. Future Revenue Streams

| Stream | Description | Expected Launch |
|--------|-------------|-----------------|
| **AI Mapping Module** | Azure OpenAI-powered schema mapping recommendations | Phase 2 (Year 2) |
| **Enterprise Support & SLA** | 24/7 support, guaranteed SLAs, account management | Phase 3 (Year 2–3) |
| **Regulatory Templates** | Pre-built controls for specific regulations (Basel, SOX, FCA, PRA) | Phase 3 (Year 3) |

---

## Revenue Model Rationale

The pricing model is based on:

- **Value-based pricing** — Priced on migration project value (typically £500k–£5M per programme), not per-record. A validation platform delivering 0.5–1% risk reduction on a £2M migration programme justifies £50k–£100k annual investment.
- **Tiered progression** — Clear upgrade path from pilot (£1.5k/mo) to enterprise-scale (£35k+/mo) as customers expand usage.
- **Subscription model** — Predictable ARR with annual contracts (typical UK enterprise procurement).
- **Low upfront, high lifetime** — Low barrier to entry (£1.5k/mo starter), high expansion revenue as customers validate more migrations.

---

## Unit Economics (Illustrative)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Customers** | 10 | 40 | 120 |
| **Average ARR/Customer** | £45,000 | £60,000 | £70,000 |
| **ARR** | £450,000 | £2,400,000 | £8,400,000 |
| **Gross Margin** | 78% | 82% | 85% |
| **CAC** | £28,000 | £22,000 | £18,000 |
| **LTV (avg 4 years)** | £180,000 | £240,000 | £280,000 |
| **LTV:CAC** | 6:1 | 11:1 | 16:1 |

*Notes:*
- *CAC includes founder-led sales time (Year 1) and dedicated sales resource (Years 2–3)*
- *LTV:CAC ratio of 6:1 in Year 1 is healthy for enterprise SaaS; improves to 16:1 at scale*
- *Churn expected at <10% in Year 1, declining to <5% by Year 3 — consistent with enterprise regtech benchmarks*

---

## Azure Infrastructure Cost Model

| Service | Monthly (GBP) — MVP | Monthly (GBP) — Scale |
|---------|--------------------|---------------------|
| Azure Container Apps | £150–£400 | £800–£2,500 |
| Azure SQL Database | £120–£250 | £400–£1,200 |
| Azure Blob Storage | £40–£80 | £150–£400 |
| Azure API Management | £80–£150 | £250–£500 |
| Azure Key Vault | £8–£15 | £40–£80 |
| Azure Monitor | £40–£80 | £150–£400 |
| **Total per customer** | **£438–£975** | **£1,790–£5,080** |

As the platform moves to multi-tenant SaaS, infrastructure costs per customer reduce significantly through shared tenancy.

---

## Pricing Principles

| Principle | Rationale |
|-----------|-----------|
| **Value-based** | Priced on migration project value, not per-record |
| **Tiered** | Clear upgrade path as customer needs grow |
| **Subscription** | Predictable recurring revenue (ARR) — essential for UK investors |
| **Enterprise annual contracts** | Standard UK enterprise procurement model — annual commitments |
| **Low entry, high expansion** | Starter tier for pilots, expansion revenue from Enterprise tier |

---

## UK Market Context

This pricing reflects UK Financial Services market conditions:

- UK banks typically spend **£500k–£5M** per migration programme
- UK enterprise regtech SaaS pricing ranges **£30k–£150k ACV**
- UK investors expect GBP-denominated projections with realistic UK salary costs
- UK corporate tax rate: 25% (2024–25)
- R&D tax credits available for software development (up to 27% of qualifying costs)
- Azure Founders Hub provides up to **£120,000 in free Azure credits** (GBP equivalent of $150k)

---

## Azure Marketplace Strategy

The platform will be available through:
- **Azure Marketplace** — Transactable SaaS offer (GBP pricing)
- **Microsoft Co-Sell** — Eligible for Microsoft field seller incentives
- **Private Offers** — Custom pricing for large enterprise deals

This aligns with Microsoft's partner ecosystem and provides UK Financial Services customers with Azure consumption commitment benefits.