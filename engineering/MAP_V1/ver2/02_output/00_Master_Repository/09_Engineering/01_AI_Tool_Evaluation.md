# MAP AI Tool Evaluation

| Field | Value |
|-------|-------|
| **Document** | MAP AI Tool Evaluation |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal |
| **Owner** | MAP Engineering Leadership |

---

## 1. Evaluation Overview

This document evaluates 12 AI development platforms against MAP's requirements for AI-assisted development. Each tool is assessed across pricing, privacy, enterprise readiness, offline capability, and best use cases.

### Evaluation Criteria

- **Privacy:** How the tool handles code and data; data retention, training policies
- **Enterprise:** SSO, audit logs, admin controls, compliance certifications
- **Offline:** Ability to function without internet connectivity
- **MAP Fit:** Alignment with MAP's React/TypeScript + .NET 8 + Azure stack

---

## 2. Tool Comparison Matrix

| Tool | Type | Pricing | Privacy | Enterprise | Offline | Best For |
|------|------|---------|---------|------------|---------|----------|
| GitHub Copilot | Code completion | $19-39/mo | Good | Yes | No | Day-to-day coding |
| OpenAI ChatGPT | Chat assistant | $20/mo | Medium | Yes (Team/Enterprise) | No | Complex reasoning |
| Claude | Chat assistant | $20/mo | Strong | Yes (Team) | No | Long context, analysis |
| Gemini | Chat assistant | $20/mo | Medium | Yes (Workspace) | No | Google ecosystem |
| Cursor | AI IDE | $20/mo | Good | Yes | No | AI-first development |
| Windsurf | AI IDE | $15/mo | Good | Yes | No | Code completion |
| Codex | Code generation | Varies | Good | Yes | No | Autonomous coding |
| Azure OpenAI | API service | Pay-per-use | Enterprise | Yes | No | Custom AI solutions |
| Amazon Q Developer | Code assistant | $19/mo | AWS | Yes | No | AWS ecosystem |
| Tabnine | Code completion | $12/mo | Strong | Yes | Yes | Privacy-focused |
| Continue.dev | Open-source | Free | Strong | Yes | Yes | Self-hosted |
| Cline | Open-source | Free | Strong | Yes | Yes | VS Code extension |

---

## 3. Final Recommendation

### Primary Tools (Recommended for MAP)

| Tool | Role | Tier | Justification |
|------|------|------|---------------|
| **GitHub Copilot** | Day-to-day coding | Business ($39/mo) | Best code completion, GitHub integration, IP indemnity |
| **Azure OpenAI** | Custom AI solutions | Pay-per-use | Enterprise data privacy, Azure-native, VNet integration |

### Secondary Tools (Recommended as Alternatives)

| Tool | Role | Tier | Justification |
|------|------|------|---------------|
| **Continue.dev** | Open-source alternative | Free (BYO API) | Maximum privacy, self-hosted, open-source philosophy |

### Tertiary Tools (Evaluate as Needed)

| Tool | Use Case | Justification |
|------|----------|---------------|
| **Claude** | Code review, long-context analysis | Strong privacy, large context window |
| **ChatGPT** | Complex reasoning, brainstorming | Strong general reasoning |

---

## 4. Budget Estimate

| Tool | Users | Monthly Cost | Annual Cost |
|------|-------|-------------|-------------|
| GitHub Copilot Business | 20 | $780 | $9,360 |
| Azure OpenAI | Shared | ~$200 | ~$2,400 |
| Continue.dev | 5 (opt-in) | $0 | $0 |
| **Total** | | **~$980** | **~$11,760** |
