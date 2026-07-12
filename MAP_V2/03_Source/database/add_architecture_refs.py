import os
import glob

# Architecture references section to add
ARCH_SECTION = """

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
"""

def add_architecture_refs(filepath):
    """Add architecture references section to a prompt file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has architecture references
    if 'Architecture References' in content:
        return False
    
    # Add section at end of file
    new_content = content.rstrip() + ARCH_SECTION
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    # Process all Workstream 05 and 06 prompts
    patterns = [
        'engineering/MAP_V2/01_Prompts/Workstream_05_Database/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_05_Backend/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_05_Frontend/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_05_Testing/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_06_Administration/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_06_Database/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_06_Backend/*.md',
        'engineering/MAP_V2/01_Prompts/Workstream_06_Frontend/*.md',
    ]
    
    total = 0
    updated = 0
    
    for pattern in patterns:
        files = glob.glob(pattern)
        for filepath in files:
            total += 1
            if add_architecture_refs(filepath):
                updated += 1
                print(f"  Updated: {os.path.basename(filepath)}")
            else:
                print(f"  Skipped (already has refs): {os.path.basename(filepath)}")
    
    print(f"\nTotal: {total} files, Updated: {updated}")

if __name__ == "__main__":
    main()
