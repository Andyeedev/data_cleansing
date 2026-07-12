import os

# Workflow prompt template
WORKFLOW_TEMPLATE = """# MAP Nexus Enterprise Platform

## Prompt {id}: {title}

**Version:** 1.0

**Status:** Pending

**Workstream:** 05 - Workflow

---

# Purpose

This prompt defines the implementation requirements for {title}.

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.

---

# Prerequisites

- Workstream 05 Database prompts completed
- Workstream 05 Backend prompts completed

---

# Implementation TODO

- [ ] Define database tables
- [ ] Create API routes
- [ ] Build frontend components
- [ ] Write tests

---

# Acceptance Criteria

- [ ] All tables created in platform schema
- [ ] All API endpoints functional
- [ ] Frontend components working
- [ ] Tests passing
"""

# AI Provider prompt template
AI_TEMPLATE = """# MAP Nexus Enterprise Platform

## Prompt {id}: {title}

**Version:** 1.0

**Status:** Pending

**Workstream:** 07 - AI Provider Integration

---

# Purpose

This prompt defines the implementation requirements for {title}.

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 06_AI_Architecture.md — AI provider integration architecture
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.

## AI Architecture

From 06_AI_Architecture.md:

- AI never accesses PostgreSQL directly
- AI communicates only through API Layer → AI Framework → Provider Adapter → Configured Provider
- Provider Connector handles: authentication, API calls, retries, timeouts, error handling, usage tracking

---

# Prerequisites

- Workstream 06 Administration prompts completed
- AI architecture defined in 06_AI_Architecture.md

---

# Implementation TODO

- [ ] Define provider connector interface
- [ ] Implement provider adapters
- [ ] Create AI service layer
- [ ] Build admin UI for provider management

---

# Acceptance Criteria

- [ ] Provider connector interface defined
- [ ] At least one provider adapter implemented
- [ ] AI service functional
- [ ] Admin UI working
"""

# Workflow prompts
workflow_prompts = [
    (26, "Create Workflow Framework"),
    (27, "Create Approval Workflows"),
    (28, "Create Notifications"),
    (29, "Create Task Manager"),
    (30, "Create Calendar"),
]

# AI Provider prompts
ai_prompts = [
    (36, "Create AI Provider Framework"),
    (37, "Create Local AI Providers"),
    (38, "Create Cloud AI Providers"),
    (39, "Create AI Provider Administration"),
    (40, "Create AI Model Management"),
]

def create_prompt(filepath, template, prompt_id, title):
    content = template.format(id=prompt_id, title=title)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {os.path.basename(filepath)}")

def main():
    # Create Workflow prompts
    for prompt_id, title in workflow_prompts:
        filepath = f"engineering/MAP_V2/01_Prompts/Workstream_05_Workflow/{prompt_id}_Create_{title.replace(' ', '_')}.md"
        create_prompt(filepath, WORKFLOW_TEMPLATE, prompt_id, title)
    
    # Create AI Provider prompts
    for prompt_id, title in ai_prompts:
        filepath = f"engineering/MAP_V2/01_Prompts/Workstream_07_AI_Provider_Integration/{prompt_id}_Create_{title.replace(' ', '_')}.md"
        create_prompt(filepath, AI_TEMPLATE, prompt_id, title)
    
    print("\nDone!")

if __name__ == "__main__":
    main()
