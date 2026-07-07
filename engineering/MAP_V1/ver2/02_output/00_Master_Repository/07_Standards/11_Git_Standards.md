# MAP MVP Git Standards

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Git Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Purpose

This document defines the Git branching strategy, commit conventions, code review process, and release management standards for the MAP (Migration Assurance Platform) repository. It ensures a consistent, traceable, and maintainable development workflow across all contributors.

## 2. Scope

Applies to all Git repositories owned by the MAP team, including:
- Application source code (frontend, backend, infrastructure)
- Infrastructure-as-code (Terraform, Bicep)
- Documentation and specifications
- CI/CD pipeline definitions

## 3. Branch Strategy

MAP follows a **trunk-based development** model with short-lived feature branches and release stabilization branches.

### 3.1 Branch Types

| Branch | Purpose | Lifetime | Protected |
|--------|---------|----------|:---------:|
| `main` | Production-ready code | Permanent | ✅ |
| `develop` | Integration branch for next release | Permanent | ✅ |
| `feature/*` | New features or enhancements | Temporary | ❌ |
| `hotfix/*` | Urgent production fixes | Temporary | ❌ |
| `release/*` | Release stabilization | Temporary | ✅ |

### 3.2 Branch Naming

```
feature/MAP-123-add-migration-validation
feature/MAP-456-improve-error-handling
hotfix/MAP-789-fix-timeout-crash
release/1.2.0
```

Format: `{type}/{ticket-id}-{short-description}`

- Type: `feature`, `hotfix`, `release`
- Ticket ID: Jira/Azure DevOps ticket reference
- Description: Lowercase, hyphen-separated, max 50 characters

### 3.3 Branch Flow

```
main ────────────────────────────────────────────●───────────────●───
                         \                    /                  \
                          ●── develop ────────●── release/1.2.0 ──●── merge to main
                           \              /
                            ●── feature/*──●
                             \          /
                              ●── feature/*──●
```

**Feature development:**
1. Branch from `develop`
2. Implement changes with commits
3. Open PR targeting `develop`
4. After approval and CI pass, merge to `develop`

**Release stabilization:**
1. Branch `release/x.y.z` from `develop`
2. Only bug fixes allowed on release branch
3. Merge to `main` and tag
4. Back-merge to `develop`

**Hotfix:**
1. Branch from `main`
2. Apply minimal fix
3. Merge to `main` and tag
4. Back-merge to `develop`

## 4. Commit Conventions

MAP follows [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

### 4.1 Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 4.2 Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(migration): add parallel validation` |
| `fix` | Bug fix | `fix(api): handle null reference in status endpoint` |
| `docs` | Documentation only | `docs: update API standards for pagination` |
| `style` | Formatting, no logic change | `style(frontend): fix indentation in sidebar` |
| `refactor` | Code restructuring, no behavior change | `refactor(db): extract connection pooling logic` |
| `test` | Adding or updating tests | `test(api): add integration tests for job creation` |
| `chore` | Build, CI, tooling | `chore: update .NET SDK to 8.0.300` |
| `perf` | Performance improvement | `perf(query): optimize migration report fetch` |
| `ci` | CI/CD configuration | `ci: add Azure DevOps release pipeline` |
| `revert` | Revert a commit | `revert: revert "feat(api): add bulk export"` |

### 4.3 Scopes

Common scopes for MAP:

| Scope | Area |
|-------|------|
| `api` | Backend API layer |
| `frontend` | React frontend |
| `db` | Database migrations and schemas |
| `migration` | Migration validation logic |
| `auth` | Authentication and authorization |
| `infra` | Infrastructure and deployment |
| `docs` | Documentation |

### 4.4 Rules

- Description: imperative mood, lowercase, no period, max 72 characters
- Body: wrap at 72 characters, explain *what* and *why* (not *how*)
- Footer: reference issue IDs (`Closes #123`, `Refs MAP-456`)
- Breaking changes: add `BREAKING CHANGE:` in footer or `!` after type

### 4.5 Examples

```
feat(migration): add source-to-target field mapping validation

Implements automatic field mapping detection between source and target
databases during migration validation. Supports type compatibility
checking and nullable field warnings.

Closes #234
```

```
fix(api): prevent duplicate migration job creation

Added idempotency key validation to prevent race conditions when
clients retry POST requests.

Fixes #456
```

```
feat(auth)!: replace JWT signing keys with Azure Key Vault

BREAKING CHANGE: Authentication configuration now requires Azure Key Vault
connection string instead of local signing keys.
```

## 5. Pull Requests

### 5.1 Template

Every PR MUST use the provided template:

```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring
- [ ] Test

## Related Issue
Closes #XXX / Refs MAP-XXX

## How Has This Been Tested?
[Describe test cases]

## Checklist
- [ ] Code compiles without errors
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] No new compiler warnings
- [ ] Documentation updated (if applicable)
- [ ] Database migration reviewed (if applicable)
```

### 5.2 Size Limits

| Metric | Maximum |
|--------|---------|
| Lines changed | 400 |
| Files changed | 20 |
| Commits | 10 |

PRs exceeding these limits MUST be split into smaller, independently reviewable units. If a large PR is unavoidable (e.g., database migration), add a note in the PR description explaining why.

### 5.3 Approval Requirements

| Target Branch | Approvals Required |
|---------------|:------------------:|
| `develop` | 1 |
| `main` | 2 |
| `release/*` | 2 |

### 5.4 PR Requirements

- PR title MUST follow Conventional Commits format
- Linked issue(s) required (no orphan PRs)
- All CI checks must pass before merge
- Branch must be up-to-date with target before merge
- PR description must be filled out (no empty templates)
- Self-approval is not permitted

## 6. Code Reviews

### 6.1 Review Checklist

Reviewers MUST evaluate:

| Category | Items |
|----------|-------|
| **Correctness** | Does the code do what it claims? Edge cases handled? |
| **Security** | Input validation? SQL injection? XSS? Secrets in code? |
| **Performance** | N+1 queries? Unnecessary allocations? Blocking calls? |
| **Readability** | Clear naming? Reasonable complexity? Comments where needed? |
| **Testability** | Unit tests included? Integration tests for critical paths? |
| **Standards** | Follows API/DB/Git standards? Consistent with codebase patterns? |

### 6.2 Review Etiquette

- Be constructive; suggest alternatives rather than just pointing out issues
- Prefix non-blocking suggestions with "nit:" or "suggestion:"
- Focus on logic, security, and performance — not personal style preferences
- Approve with minor comments that can be addressed in follow-up
- Respond to all review comments before merge

### 6.3 Review Turnaround

| Priority | Expected Response Time |
|----------|:----------------------:|
| Standard | 24 hours |
| Hotfix | 4 hours |
| Blocking PR | 2 hours (business hours) |

## 7. Merge Policies

### 7.1 Merge Strategies

| Branch | Strategy | Rationale |
|--------|----------|-----------|
| Feature → `develop` | Squash merge | Clean linear history on develop |
| Release → `main` | Merge commit | Preserve release context and history |
| Hotfix → `main` | Merge commit | Preserve hotfix context |
| Back-merge to `develop` | Merge commit | Maintain branch synchronization |

### 7.2 Rules

- **No force push** to `main` or `develop` under any circumstances
- **No direct commits** to `main` (except via hotfix → merge)
- **Delete branches** after merge (feature and hotfix branches)
- **Preserve release branches** for audit trail (tag and archive)

### 7.3 Branch Protection

The following rules MUST be enforced via GitHub branch protection:

| Setting | `main` | `develop` | `release/*` |
|---------|:------:|:---------:|:-----------:|
| Require PR | ✅ | ✅ | ✅ |
| Required approvals | 2 | 1 | 2 |
| Dismiss stale reviews | ✅ | ❌ | ✅ |
| Require status checks | ✅ | ✅ | ✅ |
| Require branches up-to-date | ✅ | ✅ | ✅ |
| Require signed commits | ✅ | ✅ | ✅ |
| Restrict force push | ✅ | ✅ | ✅ |
| Restrict deletions | ✅ | ✅ | ✅ |

## 8. Release Branches

### 8.1 Creation

1. Branch `release/x.y.z` from `develop` when code freeze is reached
2. Only bug fixes allowed on release branch (no new features)
3. All fixes are cherry-picked from `develop` or committed directly with justification

### 8.2 Version Bump

Update version in the following files on the release branch:

| File | Update |
|------|--------|
| `Directory.Build.props` | `<Version>x.y.z</Version>` |
| `package.json` (frontend) | `"version": "x.y.z"` |
| `CHANGELOG.md` | Add release notes section |

### 8.3 Changelog

Maintain `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.2.0] - 2026-07-01

### Added
- Parallel migration validation for large datasets
- Real-time progress streaming via SignalR

### Fixed
- Timeout error when connecting to large source databases
- Incorrect field mapping detection for nullable columns

### Changed
- Improved error messages for validation failures

### Deprecated
- Legacy single-threaded validation endpoint (removed in 2.0.0)
```

### 8.4 Merge and Tag

1. Merge release branch to `main`
2. Create annotated Git tag `v{x.y.z}` on the merge commit
3. Back-merge release branch to `develop`
4. Delete release branch after merge

## 9. Hotfixes

### 9.1 Process

1. Branch `hotfix/MAP-{ticket}-{description}` from `main`
2. Apply minimal, focused fix
3. Add regression test
4. Open PR targeting `main` with 2 approvals required
5. After merge, create annotated tag `v{patch-version}`
6. Back-merge to `develop`
7. Cherry-pick to `release/*` branch if release is in progress

### 9.2 Expedited Review

- Hotfix PRs have a 4-hour review SLA
- May be reviewed and approved by a single senior engineer in emergencies
- Post-merge review by a second engineer is mandatory within 24 hours

### 9.3 Communication

- Post in `#map-releases` Slack channel when hotfix is deployed
- Update incident ticket with root cause, fix, and deployment time
- Add entry to `CHANGELOG.md` under `[Unreleased]` section

## 10. Semantic Versioning

MAP follows [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### 10.1 Version Increments

| Increment | When | Example |
|-----------|------|---------|
| **MAJOR** | Breaking API changes, data schema incompatibilities, deprecated feature removal | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backward-compatible additions, new API endpoints | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, security patches, backward-compatible fixes | 1.0.0 → 1.0.1 |

### 10.2 Pre-release Tags

```
1.2.0-alpha.1    # Early development, unstable
1.2.0-beta.1     # Feature complete, testing
1.2.0-rc.1       # Release candidate, final validation
```

### 10.3 Build Metadata

```
1.2.0+build.2026.07.01.abc1234
```

Build metadata is ignored for version precedence but included in tags for traceability.

## 11. Git Tags

### 11.1 Format

All release tags use the format `v{x.y.z}`:

```
v1.0.0
v1.1.0
v1.1.1
v2.0.0-beta.1
```

### 11.2 Annotated Tags

ALL tags MUST be annotated (not lightweight):

```bash
git tag -a v1.2.0 -m "Release v1.2.0: Add parallel validation and real-time streaming"
```

### 11.3 Tag Message

Include in annotated tag message:
- Version number
- Release date
- Key changes summary
- Link to changelog

### 11.4 Release Notes

Attach release notes to each tag via GitHub Releases:

```markdown
## v1.2.0 (July 1, 2026)

### Highlights
- Parallel migration validation (3x faster for large datasets)
- Real-time progress updates via SignalR
- Improved field mapping accuracy

### Upgrade Notes
- Database migration required (add `validation_parallel_config` table)
- API: New optional `parallelism` parameter on `/v1/migration-jobs`
```

## 12. GitHub Workflows

### 12.1 CI Pipeline (on every push and PR)

```yaml
# Trigger
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

# Jobs
jobs:
  build:
    - Restore dependencies
    - Build solution
    - Run unit tests
    - Run integration tests
    - Run linting (ESLint, dotnet format)
    - Run security scanning (SAST)
    - Upload test results and coverage

  quality-gate:
    - Require 80% code coverage
    - No critical/high security findings
    - All tests pass
    - Build succeeds on Windows and Linux
```

### 12.2 CD Pipeline (on release tag)

```yaml
# Trigger
on:
  push:
    tags: ['v*']

# Jobs
jobs:
  deploy-staging:
    - Deploy to staging environment
    - Run smoke tests
    - Run end-to-end tests

  deploy-production:
    - Manual approval gate
    - Blue-green deployment
    - Health check validation
    - Notify team on success/failure
```

### 12.3 Branch Protection Rules

| Rule | Configuration |
|------|---------------|
| Require pull request reviews | 2 approvals for main, 1 for develop |
| Dismiss stale approvals | Enabled for main |
| Require status checks | CI build must pass |
| Require up-to-date branches | Enabled for main |
| Require signed commits | Enabled for all protected branches |
| Restrict force pushes | Enabled for main and develop |
| Restrict deletions | Enabled for all protected branches |
| Require linear history | Squash merge only on develop |
| Require conversation resolution | All comments must be resolved |

### 12.4 Required Status Checks

The following checks MUST pass before merge:

| Check | Description |
|-------|-------------|
| `build` | Solution compiles without errors |
| `unit-tests` | All unit tests pass |
| `integration-tests` | All integration tests pass |
| `lint` | ESLint and dotnet format pass |
| `security-scan` | No critical/high vulnerabilities |
| `test-coverage` | Coverage >= 80% |

---

*End of MAP MVP Git Standards*
