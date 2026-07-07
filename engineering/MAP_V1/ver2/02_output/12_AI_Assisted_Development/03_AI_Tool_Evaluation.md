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

## 3. Detailed Tool Analysis

### 3.1 GitHub Copilot

| Attribute | Detail |
|-----------|--------|
| **Type** | Code completion |
| **Pricing** | $19/mo Individual, $39/mo Business, $39/mo Enterprise |
| **Data Privacy** | Code snippets sent to API; Business/Enterprise tiers have no code retention for model training |
| **Enterprise Readiness** | SSO, audit logs, IP indemnity, org-wide policy management |
| **Offline Capability** | No |
| **IDE Integration** | VS Code, JetBrains, Neovim, Visual Studio |

#### Strengths
1. Deep GitHub ecosystem integration (PRs, Issues, Actions)
2. Best-in-class code completion latency and accuracy
3. Business tier provides IP indemnity and zero data retention
4. Supports all major languages including TypeScript, C#, and Python
5. Enterprise tier includes Copilot Chat for conversational assistance

#### Weaknesses
1. No offline mode; requires internet connectivity
2. Enterprise tier price point ($39/mo) adds up at scale
3. Occasional suggestions may include outdated patterns or deprecated APIs
4. Limited context window compared to chat-based tools
5. Dependent on GitHub as platform (vendor coupling)

#### MAP Recommendation
**Primary tool for day-to-day development.** Ideal for React/TypeScript and .NET 8 code completion. Business tier recommended for IP protection and data privacy.

---

### 3.2 OpenAI ChatGPT

| Attribute | Detail |
|-----------|--------|
| **Type** | Chat assistant |
| **Pricing** | $20/mo Plus, $25/mo Team, $60/mo Enterprise |
| **Data Privacy** | Medium; conversations may be used for model improvement on free tier; Team/Enterprise tiers opt out |
| **Enterprise Readiness** | Team and Enterprise tiers with admin controls, SSO, and usage analytics |
| **Offline Capability** | No |
| **IDE Integration** | Web interface, API integration |

#### Strengths
1. Strongest general reasoning and complex problem-solving
2. Large context window handles full codebase discussions
3. Plugin ecosystem extends capabilities (code interpreter, web browsing)
4. Excellent for architecture discussions and design brainstorming
5. Well-documented API for custom integrations

#### Weaknesses
1. Not purpose-built for code; less precise than Copilot for inline completion
2. Data privacy concerns on lower tiers
3. No native IDE integration; requires API or plugin setup
4. Pricing can escalate with API usage for custom solutions
5. Output quality varies; requires validation

#### MAP Recommendation
**Secondary tool for complex reasoning and architecture discussions.** Use Team or Enterprise tier for data privacy. Not suitable as primary coding tool.

---

### 3.3 Claude (Anthropic)

| Attribute | Detail |
|-----------|--------|
| **Type** | Chat assistant |
| **Pricing** | $20/mo Pro, $25/mo Team |
| **Data Privacy** | Strong; no training on user data by default; SOC 2 Type II certified |
| **Enterprise Readiness** | Team tier with admin controls, usage management, and audit logs |
| **Offline Capability** | No |
| **IDE Integration** | Web interface, API integration, VS Code extensions |

#### Strengths
1. Largest effective context window (200K tokens) for long codebase analysis
2. Strong privacy posture; no default data retention for training
3. Excellent at code review, refactoring suggestions, and documentation
4. Nuanced understanding of architectural trade-offs
5. Lower hallucination rate for code-related tasks

#### Weaknesses
1. No native IDE inline completion; chat-based workflow only
2. Smaller ecosystem and fewer integrations than competitors
3. Team tier more expensive than ChatGPT Plus
4. Less familiar to most developers; learning curve for prompt engineering
5. API pricing can be unpredictable for high-volume usage

#### MAP Recommendation
**Strong secondary option for code review and long-context analysis.** Particularly useful for reviewing large PRs, analyzing architecture, and generating documentation. Team tier recommended.

---

### 3.4 Gemini (Google)

| Attribute | Detail |
|-----------|--------|
| **Type** | Chat assistant |
| **Pricing** | $20/mo Advanced, included with Workspace plans |
| **Data Privacy** | Medium; Google Workspace data policies apply; model training on user data varies by tier |
| **Enterprise Readiness** | Yes, through Google Workspace; SSO, admin controls, DLP |
| **Offline Capability** | Limited (some Gemini features in Google Workspace offline) |
| **IDE Integration** | Web interface, API, Android Studio integration |

#### Strengths
1. Deep integration with Google Cloud and Workspace ecosystem
2. Competitive pricing, especially for Google Workspace customers
3. Strong multimodal capabilities (code, text, images)
4. Good performance on Google Cloud-specific technologies
5. Large context window for comprehensive analysis

#### Weaknesses
1. Less mature for enterprise code development use cases
2. Privacy policies less transparent than competitors
3. Limited native IDE integration for .NET or React development
4. Enterprise features less developed than Azure OpenAI for Microsoft stack
5. Documentation and community support less extensive

#### MAP Recommendation
**Lower priority for MAP.** MAP's Azure-native stack aligns better with Azure OpenAI. Consider only if significant Google Cloud adoption occurs.

---

### 3.5 Cursor

| Attribute | Detail |
|-----------|--------|
| **Type** | AI-first IDE (fork of VS Code) |
| **Pricing** | $20/mo Pro, $40/mo Business |
| **Data Privacy** | Good; Business tier has no code retention for training; SOC 2 compliance |
| **Enterprise Readiness** | Business tier with admin controls, SSO, and audit logs |
| **Offline Capability** | Limited; basic editing works offline, AI features require connectivity |
| **IDE Integration** | Native; built as AI-first IDE based on VS Code |

#### Strengths
1. AI deeply integrated into the editing experience, not bolted on
2. Excellent codebase-aware suggestions using local indexing
3. Tab completion, chat, and multi-file editing in unified experience
4. Strong TypeScript and React support
5. Competitive pricing for feature set

#### Weaknesses
1. Requires adoption of new IDE; team must migrate from existing setup
2. VS Code fork means potential compatibility issues with extensions
3. Vendor risk; startup company with uncertain long-term viability
4. Business tier required for enterprise features
5. Less established than GitHub Copilot for enterprise adoption

#### MAP Recommendation
**Evaluate for individual engineer adoption.** Strong AI-first experience, but IDE migration risk is significant. Consider as optional tool rather than mandatory.

---

### 3.6 Windsurf

| Attribute | Detail |
|-----------|--------|
| **Type** | AI IDE |
| **Pricing** | $15/mo Pro |
| **Data Privacy** | Good; no code retention for training on paid plans |
| **Enterprise Readiness** | Limited; emerging enterprise features |
| **Offline Capability** | Limited; core editing offline, AI features online |
| **IDE Integration** | Native; based on VS Code |

#### Strengths
1. Competitive pricing at $15/mo
2. Integrated AI with codebase awareness
3. Smooth oncoming from VS Code
4. Good code completion and chat features
5. Growing feature set

#### Weaknesses
1. Newer product with smaller track record
2. Enterprise features less mature than competitors
3. Smaller community and fewer integrations
4. Less proven in enterprise environments
5. Vendor viability concerns

#### MAP Recommendation
**Monitor but not recommended for MAP.** Too early for enterprise adoption. Revisit when enterprise features mature.

---

### 3.7 Codex (OpenAI)

| Attribute | Detail |
|-----------|--------|
| **Type** | Autonomous code generation |
| **Pricing** | Varies by usage and model |
| **Data Privacy** | Good; enterprise data handling policies |
| **Enterprise Readiness** | Yes; available through Azure OpenAI |
| **Offline Capability** | No |
| **IDE Integration** | API-based; integrates with various tools |

#### Strengths
1. Can generate complete features from specifications
2. Autonomous coding with minimal human input
3. Strong on well-defined, repetitive tasks
4. Available through Azure OpenAI for enterprise governance
5. Can handle multi-file changes

#### Weaknesses
1. High cost for complex generation tasks
2. Requires extensive review; autonomous output is higher risk
3. Less control over generation process
4. Not suitable for sensitive or complex business logic
5. Still evolving; capabilities and reliability vary

#### MAP Recommendation
**Use cautiously for boilerplate and scaffolding.** Not recommended for business logic or production-critical code. Always requires thorough human review.

---

### 3.8 Azure OpenAI

| Attribute | Detail |
|-----------|--------|
| **Type** | API service |
| **Pricing** | Pay-per-use (token-based); no per-user licensing |
| **Data Privacy** | Enterprise-grade; data stays within Azure boundary; no model training on customer data |
| **Enterprise Readiness** | Full Azure enterprise features; SSO, audit logs, compliance certifications, VNet injection |
| **Offline Capability** | No |
| **IDE Integration** | API; custom integrations, GitHub Copilot uses Azure OpenAI backend |

#### Strengths
1. Enterprise-grade data privacy; data never leaves Azure
2. Pay-per-use pricing scales with actual consumption
3. Full Azure compliance and governance (SOC 2, HIPAA, FedRAMP)
4. Custom model deployment with fine-tuning capabilities
5. VNet integration for private networking
6. Seamless integration with MAP's Azure infrastructure

#### Weaknesses
1. Requires engineering effort for custom integrations
2. No out-of-the-box IDE experience; must build tooling
3. Token-based pricing can be unpredictable without monitoring
4. Requires Azure expertise for deployment and management
5. Less user-friendly than commercial chat tools for ad-hoc use

#### MAP Recommendation
**Primary choice for custom AI solutions and production integrations.** Ideal for MAP's Azure-native architecture. Use for RAG pipelines, custom agents, and backend AI features. Complement with GitHub Copilot for IDE experience.

---

### 3.9 Amazon Q Developer

| Attribute | Detail |
|-----------|--------|
| **Type** | Code assistant |
| **Pricing** | $19/mo per user |
| **Data Privacy** | AWS data policies; code not used for training on Pro tier |
| **Enterprise Readiness** | Yes; AWS IAM integration, CloudTrail audit logs |
| **Offline Capability** | No |
| **IDE Integration** | VS Code, JetBrains, Visual Studio, CLI |

#### Strengths
1. Deep AWS integration; excellent for AWS-native workloads
2. Good code completion and chat capabilities
3. AWS security scanning and compliance checks
4. Competitive pricing at $19/mo
5. CLI support for infrastructure tasks

#### Weaknesses
1. Strongest value proposition is AWS-centric; less compelling for Azure
2. Smaller community and ecosystem than GitHub Copilot
3. Less proven for React/TypeScript workloads
4. Enterprise features require AWS Organizations setup
5. No offline capability

#### MAP Recommendation
**Not recommended for MAP.** MAP's Azure-native stack makes AWS Q a poor fit. Consider only if significant AWS adoption occurs.

---

### 3.10 Tabnine

| Attribute | Detail |
|-----------|--------|
| **Type** | Code completion |
| **Pricing** | $12/mo Pro, $39/mo Enterprise |
| **Data Privacy** | Strong; Enterprise tier offers full code privacy, no data leaves device |
| **Enterprise Readiness** | Yes; self-hosted option, SSO, admin controls, audit logs |
| **Offline Capability** | Yes; full offline support on Enterprise tier |
| **IDE Integration** | VS Code, JetBrains, Neovim, Eclipse, Visual Studio |

#### Strengths
1. Best-in-class privacy; self-hosted and fully offline options
2. Competitive pricing at $12/mo Pro
3. Supports all major languages
4. Zero data retention on Enterprise tier
5. Self-hosted deployment for air-gapped environments

#### Weaknesses
1. Code completion quality lower than GitHub Copilot
2. Enterprise tier required for self-hosting and offline
3. Smaller community and fewer integrations
4. Less advanced chat and reasoning capabilities
5. Requires infrastructure for self-hosted deployment

#### MAP Recommendation
**Strong option if privacy is the top priority.** Consider for environments with strict data sovereignty requirements. Enterprise tier for self-hosted deployment. Good fallback if GitHub Copilot data policies are insufficient.

---

### 3.11 Continue.dev

| Attribute | Detail |
|-----------|--------|
| **Type** | Open-source AI code assistant |
| **Pricing** | Free (open-source); pay for premium features or BYO API keys |
| **Data Privacy** | Strong; self-hosted; code stays local; no vendor data collection |
| **Enterprise Readiness** | Self-managed; no vendor enterprise features, but fully controllable |
| **Offline Capability** | Yes; fully offline with local models |
| **IDE Integration** | VS Code, JetBrains |

#### Strengths
1. Fully open-source; complete transparency and control
2. Self-hosted; code never leaves your infrastructure
3. BYO API keys (OpenAI, Azure OpenAI, local models)
4. Offline capability with local model support
5. Highly customizable and extensible
6. No per-user licensing costs

#### Weaknesses
1. Requires engineering effort for setup and maintenance
2. No vendor support; community-driven
3. Quality depends on underlying model choice
4. No enterprise management features out of the box
5. Requires infrastructure for self-hosted deployment

#### MAP Recommendation
**Primary open-source alternative.** Ideal for MAP's cloud-portable strategy. Use Azure OpenAI as backend for enterprise governance. Self-hosted option provides maximum data control. Recommended for engineers who prefer open-source tooling.

---

### 3.12 Cline

| Attribute | Detail |
|-----------|--------|
| **Type** | VS Code extension (open-source) |
| **Pricing** | Free (open-source); BYO API keys |
| **Data Privacy** | Strong; BYO API keys; no vendor data collection |
| **Enterprise Readiness** | Self-managed; no vendor enterprise features |
| **Offline Capability** | Limited; depends on backend model |
| **IDE Integration** | VS Code only |

#### Strengths
1. Lightweight VS Code extension; easy to install
2. BYO API keys for full control
3. Good multi-file editing and refactoring capabilities
4. Active open-source community
5. Transparent codebase

#### Weaknesses
1. VS Code only; no JetBrains or other IDE support
2. No enterprise management features
3. Limited offline capability
4. Smaller community than Continue.dev
5. Less mature for enterprise use

#### MAP Recommendation
**Optional for VS Code users.** Good lightweight alternative, but Continue.dev offers more features and broader IDE support for open-source preference.

---

## 4. Comparison Summary

### Privacy Ranking

| Rank | Tool | Privacy Level |
|------|------|---------------|
| 1 | Continue.dev | Strongest (self-hosted, open-source) |
| 2 | Tabnine | Strong (self-hosted, offline) |
| 3 | Cline | Strong (BYO API, open-source) |
| 4 | Claude | Strong (no training on user data) |
| 5 | Azure OpenAI | Enterprise (data stays in Azure) |
| 6 | GitHub Copilot | Good (Business/Enterprise tier) |
| 7 | Cursor | Good (Business tier) |
| 8 | Windsurf | Good (paid plans) |
| 9 | Codex | Good (enterprise tier) |
| 10 | ChatGPT | Medium (varies by tier) |
| 11 | Gemini | Medium (varies by tier) |
| 12 | Amazon Q | AWS-dependent |

### Enterprise Readiness Ranking

| Rank | Tool | Enterprise Level |
|------|------|-----------------|
| 1 | Azure OpenAI | Full Azure governance |
| 2 | GitHub Copilot | Full enterprise features |
| 3 | Amazon Q | AWS enterprise integration |
| 4 | ChatGPT | Team/Enterprise tiers |
| 5 | Claude | Team tier |
| 6 | Cursor | Business tier |
| 7 | Tabnine | Enterprise with self-hosting |
| 8 | Gemini | Google Workspace |
| 9 | Windsurf | Emerging |
| 10 | Codex | Via Azure OpenAI |
| 11 | Continue.dev | Self-managed |
| 12 | Cline | Self-managed |

### MAP Stack Alignment

| Tool | React/TypeScript | .NET 8 | Azure | Overall Fit |
|------|-----------------|--------|-------|-------------|
| GitHub Copilot | Excellent | Excellent | Good | Excellent |
| Azure OpenAI | Good | Good | Excellent | Excellent |
| Continue.dev | Good | Good | Good | Good |
| Claude | Good | Good | Good | Good |
| ChatGPT | Good | Good | Good | Good |
| Cursor | Excellent | Good | Good | Good |
| Tabnine | Good | Good | Good | Good |
| Codex | Good | Good | Good | Good |
| Windsurf | Good | Good | Good | Average |
| Amazon Q | Good | Good | Poor | Poor |
| Gemini | Good | Good | Average | Average |
| Cline | Good | Good | Good | Good |

---

## 5. Final Recommendation

### Primary Tools (Recommended for MAP)

| Tool | Role | Tier | Justification |
|------|------|------|---------------|
| **GitHub Copilot** | Day-to-day coding | Business ($39/mo) | Best code completion, GitHub integration, IP indemnity, strong TypeScript/.NET support |
| **Azure OpenAI** | Custom AI solutions | Pay-per-use | Enterprise data privacy, Azure-native, VNet integration, custom model deployment |

### Secondary Tools (Recommended as Alternatives)

| Tool | Role | Tier | Justification |
|------|------|------|---------------|
| **Continue.dev** | Open-source alternative | Free (BYO API) | Maximum privacy, self-hosted, open-source philosophy, Azure OpenAI backend |

### Tertiary Tools (Evaluate as Needed)

| Tool | Use Case | Justification |
|------|----------|---------------|
| **Claude** | Code review, long-context analysis | Strong privacy, large context window for architecture discussions |
| **ChatGPT** | Complex reasoning, brainstorming | Strong general reasoning for architecture and design decisions |

### Tool Stack Summary

```
IDE Experience:
  GitHub Copilot (primary)
  + Continue.dev (open-source alternative)

AI Backend:
  Azure OpenAI (enterprise, custom integrations)

Supplementary:
  Claude (code review, long-context)
  ChatGPT (complex reasoning, brainstorming)
```

### Migration Path

1. **Phase 1 (Month 1-2):** Deploy GitHub Copilot Business to all engineers
2. **Phase 2 (Month 2-3):** Set up Azure OpenAI for custom integrations and Continue.dev for open-source preference
3. **Phase 3 (Month 3-4):** Evaluate Claude and ChatGPT for supplementary use cases
4. **Phase 4 (Ongoing):** Monitor usage, measure ROI, adjust tool mix quarterly

### Budget Estimate

| Tool | Users | Monthly Cost | Annual Cost |
|------|-------|-------------|-------------|
| GitHub Copilot Business | 20 | $780 | $9,360 |
| Azure OpenAI | Shared | ~$200 | ~$2,400 |
| Continue.dev | 5 (opt-in) | $0 | $0 |
| **Total** | | **~$980** | **~$11,760** |

---

## Appendix: Evaluation Methodology

### Scoring Criteria

Each tool was evaluated on a 1-5 scale across:

- **Functionality:** How well does it serve MAP's development needs?
- **Privacy:** How strong is data protection and privacy?
- **Enterprise:** How ready is it for enterprise deployment?
- **Stack Fit:** How well does it align with MAP's tech stack?
- **Cost:** How does pricing compare to value delivered?

### Evaluation Process

1. Hands-on testing with MAP codebase (representative samples)
2. Enterprise feature documentation review
3. Privacy and compliance documentation review
4. Community and support ecosystem assessment
5. Cost modeling for MAP team size
