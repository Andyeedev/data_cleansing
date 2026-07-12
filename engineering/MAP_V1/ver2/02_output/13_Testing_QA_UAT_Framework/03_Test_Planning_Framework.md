# Test Planning Framework

**Document:** Test Planning Framework
**Version:** 1.0
**Date:** July 2026
**Status:** Official
**Owner:** QA Lead
**Classification:** Internal

---

## 1. Purpose

This document defines the test planning framework for MAP. It establishes the structure for Master Test Plans, Sprint Test Plans, Release Test Plans, regression planning, acceptance criteria, deliverables, and dependencies.

The test planning framework ensures systematic and comprehensive test planning across all levels of the MAP programme.

---

## 2. Test Planning Hierarchy

```
┌─────────────────────────────────────────┐
│        Master Test Plan (MTP)           │  ← Programme level
├─────────────────────────────────────────┤
│        Release Test Plans (RTP)         │  ← Release level
├─────────────────────────────────────────┤
│        Sprint Test Plans (STP)          │  ← Sprint level
├─────────────────────────────────────────┤
│        Test Cases & Scripts             │  ← Execution level
└─────────────────────────────────────────┘
```

---

## 3. Master Test Plan (MTP)

### 3.1 MTP Structure

| Section | Content |
|---------|---------|
| 1. Introduction | Purpose, Scope, References |
| 2. Test Strategy | Testing levels, Types, Approaches |
| 3. Test Environment | Environment requirements, Configuration |
| 4. Test Data | Data requirements, Management approach |
| 5. Test Tools | Tools selection, Licenses |
| 6. Test Schedule | Timeline, Milestones, Dependencies |
| 7. Resource Plan | Roles, Responsibilities, Allocation |
| 8. Risk Management | Risks, Mitigations, Contingencies |
| 9. Entry/Exit Criteria | Phase gates, Release criteria |
| 10. Deliverables | Test plans, Reports, Metrics |

### 3.2 MTP Template

```markdown
# Master Test Plan — [Release Version]

## 1. Introduction
### 1.1 Purpose
### 1.2 Scope
### 1.3 References
### 1.4 Definitions

## 2. Test Strategy
### 2.1 Testing Levels
### 2.2 Test Types
### 2.3 Test Approach

## 3. Test Environment
### 3.1 Environment Requirements
### 3.2 Configuration

## 4. Test Data
### 4.1 Data Requirements
### 4.2 Management Approach

## 5. Test Tools
### 5.1 Tools
### 5.2 Licenses

## 6. Test Schedule
### 6.1 Timeline
### 6.2 Milestones

## 7. Resource Plan
### 7.1 Roles
### 7.2 Allocation

## 8. Risk Management
### 8.1 Risks
### 8.2 Mitigations

## 9. Entry/Exit Criteria
### 9.1 Entry Criteria
### 9.2 Exit Criteria

## 10. Deliverables
```

### 3.3 MTP Approval

| Role | Responsibility |
|------|----------------|
| QA Lead | Author and maintain |
| Technical Lead | Technical review |
| Programme Manager | Approval |
| Product Owner | Scope validation |

---

## 4. Release Test Plan (RTP)

### 4.1 RTP Structure

| Section | Content |
|---------|---------|
| 1. Release Overview | Features, Scope, Timeline |
| 2. Test Scope | What to test, What not to test |
| 3. Test Cases | Test cases for release features |
| 4. Test Schedule | Sprint-by-sprint test plan |
| 5. Test Data | Data requirements for release |
| 6. Test Environments | Environment allocation |
| 7. Risk Assessment | Release-specific risks |
| 8. Entry/Exit Criteria | Release-specific criteria |
| 9. Approval | Sign-off requirements |

### 4.2 RTP Template

```markdown
# Release Test Plan — [Release Version]

## 1. Release Overview
### 1.1 Features
### 1.2 Scope
### 1.3 Timeline

## 2. Test Scope
### 2.1 In Scope
### 2.2 Out of Scope

## 3. Test Cases
### 3.1 New Feature Tests
### 3.2 Regression Tests

## 4. Test Schedule
### 4.1 Sprint 1
### 4.2 Sprint 2
...

## 5. Test Data
### 5.1 Requirements
### 5.2 Preparation

## 6. Test Environments
### 6.1 Requirements
### 6.2 Schedule

## 7. Risk Assessment
### 7.1 Risks
### 7.2 Mitigations

## 8. Entry/Exit Criteria
### 8.1 Entry Criteria
### 8.2 Exit Criteria

## 9. Approval
```

---

## 5. Sprint Test Plan (STP)

### 5.1 STP Structure

| Section | Content |
|---------|---------|
| 1. Sprint Overview | Stories, Goals, Duration |
| 2. Test Scope | Stories to test, Regression scope |
| 3. Test Cases | Test cases for sprint stories |
| 4. Test Schedule | Daily test plan |
| 5. Test Data | Data requirements for sprint |
| 6. Risk Assessment | Sprint-specific risks |
| 7. Entry/Exit Criteria | Sprint-specific criteria |
| 8. Daily Checklist | Daily testing checklist |

### 5.2 STP Template

```markdown
# Sprint Test Plan — Sprint [Number]

## 1. Sprint Overview
### 1.1 Stories
### 1.2 Goals
### 1.3 Duration

## 2. Test Scope
### 2.1 New Stories
### 2.2 Regression

## 3. Test Cases
### 3.1 Story Tests
### 3.2 Regression Tests

## 4. Test Schedule
### 4.1 Day 1
### 4.2 Day 2
...

## 5. Test Data
### 5.1 Requirements
### 5.2 Preparation

## 6. Risk Assessment
### 6.1 Risks
### 6.2 Mitigations

## 7. Entry/Exit Criteria
### 7.1 Entry Criteria
### 7.2 Exit Criteria

## 8. Daily Checklist
- [ ] Test cases reviewed
- [ ] Test data prepared
- [ ] Test execution on track
- [ ] Defects logged
- [ ] Metrics updated
```

---

## 6. Regression Planning

### 6.1 Regression Test Selection

| Criteria | Selection Method |
|----------|------------------|
| Critical path | Always included |
| High-risk areas | Risk-based selection |
| Previously failed | Defect-based selection |
| Modified areas | Change-based selection |
| Frequently used | Usage-based selection |

### 6.2 Regression Test Levels

| Level | Scope | Frequency | Automation |
|-------|-------|-----------|------------|
| Smoke | Critical paths | Every build | 100% |
| Sanity | Modified areas | Every build | 90% |
| Functional | All features | Every sprint | 80% |
| Full regression | Complete system | Every release | 95% |

### 6.3 Regression Test Maintenance

| Activity | Frequency |
|----------|-----------|
| Add new tests | Every sprint |
| Remove obsolete tests | As needed |
| Update existing tests | As needed |
| Review test coverage | Monthly |
| Optimise test suite | Quarterly |

---

## 7. Acceptance Criteria

### 7.1 Story Acceptance Criteria

| Criterion | Description |
|-----------|-------------|
| Functional | All acceptance criteria met |
| Quality | No P1/P2 defects open |
| Testing | All test cases executed |
| Automation | Automated tests updated |
| Documentation | Technical docs updated |

### 7.2 Sprint Acceptance Criteria

| Criterion | Description |
|-----------|-------------|
| Test Execution | ≥ 95% test cases executed |
| Pass Rate | ≥ 95% test cases passing |
| Defects | No open P1/P2 defects |
| Coverage | Test coverage maintained |
| Metrics | Quality metrics within targets |

### 7.3 Release Acceptance Criteria

| Criterion | Description |
|-----------|-------------|
| All sprints | All sprint acceptance criteria met |
| Performance | Performance baselines met |
| Security | Security scan passed |
| UAT | UAT sign-off obtained |
| Documentation | All documentation complete |

---

## 8. Test Deliverables

### 8.1 Pre-Test Deliverables

| Deliverable | Owner | Timing |
|-------------|-------|--------|
| Master Test Plan | QA Lead | Programme start |
| Release Test Plan | QA Lead | Release start |
| Sprint Test Plan | QA Engineer | Sprint start |
| Test Cases | QA Engineer | Before test execution |
| Test Data | QA Engineer | Before test execution |
| Environment Setup | DevOps | Before test execution |

### 8.2 During-Test Deliverables

| Deliverable | Owner | Timing |
|-------------|-------|--------|
| Test Execution Report | QA Engineer | Daily |
| Defect Reports | QA Engineer | As needed |
| Test Progress Report | QA Lead | Weekly |
| Risk Updates | QA Lead | As needed |

### 8.3 Post-Test Deliverables

| Deliverable | Owner | Timing |
|-------------|-------|--------|
| Test Summary Report | QA Lead | Test phase complete |
| Defect Summary | QA Lead | Test phase complete |
| Quality Metrics | QA Lead | Test phase complete |
| Lessons Learned | QA Lead | Test phase complete |
| Release Recommendation | QA Lead | Before release |

---

## 9. Test Dependencies

### 9.1 External Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| Requirements | Input | Cannot create test cases without requirements |
| Development | Input | Cannot test without working software |
| Test Environment | Infrastructure | Cannot execute tests without environment |
| Test Data | Input | Cannot test without test data |

### 9.2 Internal Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| Test Planning | Prerequisite | Cannot design tests without planning |
| Test Design | Prerequisite | Cannot implement tests without design |
| Test Implementation | Prerequisite | Cannot execute tests without implementation |
| Defect Management | Support | Cannot log defects without process |

---

## 10. Test Metrics

### 10.1 Planning Metrics

| Metric | Target |
|--------|--------|
| Test plan completion | 100% |
| Test case design | 100% |
| Test data preparation | 100% |
| Environment setup | 100% |

### 10.2 Execution Metrics

| Metric | Target |
|--------|--------|
| Test execution rate | ≥ 95% |
| Test pass rate | ≥ 95% |
| Defect detection rate | ≥ 90% |
| Defect resolution rate | ≥ 95% |

---

## 11. Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| Batch 08 — MVP Architecture | Technical | Architecture affects test planning |
| Batch 09 — MVP Build Specification | Process | Sprint planning affects test scheduling |
| Batch 11 — Development Standards | Process | Coding standards affect test automation |
| Batch 01 — Delivery Planning | Process | Test integration with delivery |

---

## 12. References

| Document | Location |
|----------|----------|
| Quality Assurance Strategy | `01_Quality_Assurance_Strategy.md` |
| Testing Strategy | `02_Testing_Strategy.md` |
| Unit Testing Standards | `04_Unit_Testing_Standards.md` |
| Integration Testing Standards | `05_Integration_Testing_Standards.md` |

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | July 2026 | MAP QA Team | Initial release |

---

## 14. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | [TBD] | [TBD] | |
| Technical Lead | [TBD] | [TBD] | |
| Product Owner | [TBD] | [TBD] | |

---

*End of Test Planning Framework*
