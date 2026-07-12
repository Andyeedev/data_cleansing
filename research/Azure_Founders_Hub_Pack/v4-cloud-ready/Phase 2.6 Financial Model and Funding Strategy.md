# Phase 2.6 — Financial Model & Funding Strategy

**Version:** 2.1  
**Product:** FS Migration Validation Engine  
**Currency:** GBP (£) — UK-based company

---

## Financial Model Summary

### 3-Year P&L

| Item | Year 1 | Year 2 | Year 3 |
|------|--------|--------|--------|
| **Customers** | 10 | 40 | 120 |
| **SaaS Revenue** | £450,000 | £2,400,000 | £8,400,000 |
| **Professional Services** | £100,000 | £300,000 | £500,000 |
| **Total Revenue** | **£550,000** | **£2,700,000** | **£8,900,000** |
| Cost of Sales | (£120,000) | (£370,000) | (£1,020,000) |
| **Gross Profit** | **£430,000** | **£2,330,000** | **£7,880,000** |
| OpEx (Staff + Other) | (£380,000) | (£596,000) | (£900,000) |
| **EBITDA** | **£50,000** | **£1,734,000** | **£6,980,000** |
| EBITDA Margin | 9% | 64% | 78% |

*The business reaches EBITDA-positive in Year 1 — achievable through low overhead, founder-led operations, and Azure Founders Hub credits (£120k) covering infrastructure costs.*

### Revenue Build-Up

| Component | Year 1 | Year 2 | Year 3 | Assumption |
|-----------|--------|--------|--------|------------|
| New customers | 10 | 30 | 80 | Growth driven by founder-led sales + SI partnerships |
| Retained customers | — | 9 | 37 | 90% retention Year 1 → 92% Year 2 |
| Total customers (EoY) | 10 | 40 | 120 | Net growth after churn |
| Average ARR/customer | £45,000 | £60,000 | £70,000 | Expansion via up-sell + new logos |
| SaaS ARR | £450,000 | £2,400,000 | £8,400,000 | Recurring subscription revenue |
| Professional services | £100,000 | £300,000 | £500,000 | Implementation + custom controls |

### Azure Infrastructure Cost Model

| Service | Monthly (MVP) | Monthly (Scale) |
|---------|--------------|-----------------|
| Azure Container Apps | £150–£400 | £800–£2,500 |
| Azure SQL Database | £120–£250 | £400–£1,200 |
| Azure Blob Storage | £40–£80 | £150–£400 |
| Azure API Management | £80–£150 | £250–£500 |
| Azure Key Vault | £8–£15 | £40–£80 |
| Azure Monitor | £40–£80 | £150–£400 |
| **Monthly Total** | **£438–£975** | **£1,790–£5,080** |
| **Annual Total per customer** | **£5,256–£11,700** | **£21,480–£60,960** |

*Year 1: Single-tenant deployment costs ~£5k/customer/year.*  
*Year 3: Multi-tenant SaaS model reduces per-customer costs to £1k–£2k/customer/year.*

### Hiring Plan

| Year | Role | Salary (GBP) | Notes |
|------|------|-------------|-------|
| Y1 | Founder/CEO | £60,000 | UK founder salary, below market |
| Y1 | Senior Engineer (Python/Azure) | £90,000 | UK market rate for senior engineer |
| Y1 | Junior Engineer | £50,000 | UK graduate + 1–2 years experience |
| Y2 | Sales/Business Development | £60,000 + commission | Target for 30 new customers |
| Y3 | Customer Success | £55,000 | Support 120 customer accounts |
| Y3 | Additional Engineer | £65,000 | Scale development capacity |

*All salaries based on UK market rates (outside London). Employer NI (13.8%) + pension (3–5%) = ~20% on top.*

---

## Funding Strategy

### Azure Founders Hub (Primary — Year 1)

| Benefit | Value (GBP) |
|---------|-------------|
| Free Azure credits | Up to £120,000 |
| Microsoft partner enrolment | Free |
| Azure Marketplace listing | Included |
| Technical support | Included |
| Go-to-market support | Included |

*The Founders Hub credits alone cover Year 1 Azure infrastructure (£60k), with remaining credits available for development and testing environments.*

### Seed Round (If Required)

| Item | Detail |
|------|--------|
| **Target** | £500,000–£750,000 |
| **Valuation basis** | UK angel/Seed typical: £1.5M–£3M pre-money for SaaS with working prototype |
| **Use** | Product development, AI module, customer pilots, security certifications |
| **Timing** | End of Year 1, after Founders Hub credits utilised |
| **Investor target** | UK angel networks, EIS-qualified investors |

### Future Funding

| Round | Target | Timing | Trigger |
|-------|--------|--------|---------|
| Seed | £500k–£750k | Year 1–2 | Product validation, 10+ customers, £450k ARR |
| Series A | £3M–£5M | Year 3 | £2M+ ARR, proven GTM, SI partnerships |

### UK-Specific Funding Options

| Source | Amount | Eligibility |
|--------|--------|-------------|
| **Azure Founders Hub** | Up to £120k credits | Startup stage |
| **Innovate UK Smart Grant** | Up to £500k | R&D projects, competitive application |
| **EIS (Enterprise Investment Scheme)** | Tax relief for investors | Must be EIS-qualified company |
| **UK SEIS** | Up to £250k investment | Early-stage, less than 2 years old |
| **British Business Bank** | Various | Startup loans, growth guarantee |

---

## Sensitivity Analysis

### Scenario: Slower Customer Acquisition

| Metric | Base Case | Downside (-30%) | Upside (+30%) |
|--------|-----------|-----------------|---------------|
| Year 1 customers | 10 | 7 | 13 |
| Year 1 revenue | £550,000 | £385,000 | £715,000 |
| Year 1 EBITDA | £50,000 | (£115,000) | £215,000 |
| Year 3 ARR | £8.4M | £5.9M | £10.9M |
| Breakeven | Year 1 | Year 2 (Q3) | Year 1 |

*The business model is resilient — even at 30% lower customer acquisition, breakeven is achieved by mid-Year 2 due to low fixed costs and variable infrastructure spend.*