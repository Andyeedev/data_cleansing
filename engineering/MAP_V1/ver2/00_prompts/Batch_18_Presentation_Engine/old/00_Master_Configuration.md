# Module 00 — Master Configuration

**Purpose:** Single source of truth for all branding, terminology, visual language, UX standards, output conventions
**Version:** 1.0
**Date:** 3 July 2026

---

## Colour Palette (Exact)

| Token | Hex | RGB |
|-------|-----|-----|
| primary | #0078D4 | 0, 120, 212 |
| secondary | #003B75 | 0, 59, 117 |
| success | #107C10 | 16, 124, 16 |
| warning | #FFB900 | 255, 185, 0 |
| critical | #D13438 | 209, 52, 56 |
| info | #5C2D91 | 92, 45, 145 |
| background | #F8F9FB | 248, 249, 251 |
| border | #E5E7EB | 229, 231, 235 |

---

## Typography

| Element | Font | Size | Weight | Colour |
|---------|------|------|--------|--------|
| Heading LG | Segoe UI | 18px | 700 | #0B2447 |
| Heading MD | Segoe UI | 14px | 700 | #0B2447 |
| Heading SM | Segoe UI | 13px | 600 | #374151 |
| Body | Segoe UI | 13px | 400 | #374151 |
| Caption | Segoe UI | 11px | 400 | #6B7280 |
| Label | Segoe UI | 11px | 600 | #6B7280 |
| KPI Value | Segoe UI | 24px | 700 | #0B2447 |

---

## Dashboard Names

1. Executive Dashboard
2. Migration Overview
3. Validation Centre
4. Governance Centre
5. Risk Assessment
6. Data Quality
7. Migration Progress

---

## Terminology

| Term | Use |
|------|-----|
| Passed | Control executed successfully |
| Attention Required | Warning, needs review |
| Blocked | Critical issue, migration halted |
| Completed | Phase finished |
| Validation Exception | Control failed |
| Migration Status | Overall state |

---

## Infrastructure Sanitisation

NEVER display in any output:
- localhost
- PostgreSQL
- SQL Server
- Docker
- VS Code
- Python
- Azure Storage
- .NET

Use instead:
- "Database" (not PostgreSQL)
- "Source Platform" / "Target Platform"
- "Development Environment"
- "Containerised Services"

---

## Output Conventions

- All outputs use Module 00 colour palette
- All outputs use Segoe UI font
- No dark theme
- No Font Awesome — inline SVGs only
- No "Sopra Steria" references
- Contact Us = modal button (not link)
- Active nav = border-bottom underline
