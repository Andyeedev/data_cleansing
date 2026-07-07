# Test Automation Framework

---

| Field | Value |
|---|---|
| **Document Title** | Test Automation Framework for MAP (Migration Assurance Platform) |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Confidential |
| **Owner** | MAP Quality Engineering Team |
| **Approved By** | MAP Architecture Review Board |
| **Last Revised** | 02 July 2026 |
| **Review Cycle** | Quarterly |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Automation Strategy](#3-automation-strategy)
4. [Framework Architecture](#4-framework-architecture)
5. [Tool Selection and Justification](#5-tool-selection-and-justification)
6. [Test Automation Pyramid](#6-test-automation-pyramid)
7. [CI/CD Integration](#7-cicd-integration)
8. [Reporting and Dashboards](#8-reporting-and-dashboards)
9. [Environment Management](#9-environment-management)
10. [Test Data Management](#10-test-data-management)
11. [Automation Priorities](#11-automation-priorities)
12. [Best Practices](#12-best-practices)
13. [Code Standards and Examples](#13-code-standards-and-examples)
14. [Maintenance Strategy](#14-maintenance-strategy)
15. [Metrics and KPIs](#15-metrics-and-kpis)
16. [Dependencies and References](#16-dependencies-and-references)
17. [Revision History](#17-revision-history)
18. [Approval](#18-approval)

---

## 1. Purpose

This document defines the comprehensive test automation framework for the **Migration Assurance Platform (MAP)**. It establishes the architectural patterns, tool selections, coding standards, CI/CD integration points, reporting mechanisms, and maintenance strategies that govern all automated testing within the MAP programme.

MAP operates in the financial services domain where data integrity, regulatory compliance, and operational reliability are non-negotiable. The test automation framework is the primary mechanism through which MAP achieves rapid, repeatable, and reliable quality assurance across every release cycle.

### 1.1 Why a Formal Automation Framework

| # | Reason | Impact |
|---|--------|--------|
| R1 | Consistent test execution across environments | Eliminates environment-specific defects |
| R2 | Rapid regression feedback on every commit | Reduces defect detection time from days to minutes |
| R3 | Scalable quality assurance as MAP grows | New features inherit automated coverage automatically |
| R4 | Regulatory audit trail for financial services | Automated test results serve as evidence of due diligence |
| R5 | Reduced manual testing cost over time | Initial investment yields exponential long-term savings |
| R6 | Enable continuous delivery and deployment | Automation gates block defective releases |
| R7 | Support AI-assisted development quality | AI-generated code validated against automated standards |

### 1.2 Framework Principles

| # | Principle | Description |
|---|-----------|-------------|
| FP1 | Automation-first | Every new feature must be accompanied by automated tests |
| FP2 | Single responsibility | Each test validates one behaviour or assertion |
| FP3 | Independence | Tests execute in any order without mutual dependency |
| FP4 | Determinism | Tests produce the same result on every execution |
| FP5 | Readability | Test code is self-documenting; intent is immediately clear |
| FP6 | Maintainability | Flaky or broken tests are fixed within one sprint cycle |
| FP7 | Traceability | Every automated test maps to a requirement or user story |

---

## 2. Scope

### 2.1 In Scope

| Area | Coverage |
|------|----------|
| Backend API Testing | REST/GraphQL endpoint validation, contract testing |
| Frontend UI Testing | Browser-based E2E flows, accessibility, visual regression |
| Data Migration Testing | ETL pipeline validation, data integrity, reconciliation |
| Integration Testing | Service-to-service communication, message queues, events |
| Performance Testing | Load, stress, soak, and spike testing |
| Security Testing | OWASP Top 10, SAST, DAST, dependency scanning |
| AI Quality Testing | Prompt validation, output accuracy, hallucination detection |
| Smoke Testing | Post-deployment verification of critical paths |
| Regression Testing | Full suite execution on every pull request |

### 2.2 Out of Scope

| Area | Rationale |
|------|-----------|
| Manual exploratory testing | Complements automation, not replaced by it |
| Hardware/cloud provider testing | Azure responsibility under shared responsibility model |
| Third-party SaaS testing | Vendor SLA monitoring only |
| Business process testing | Business Analysts execute via UAT framework |

---

## 3. Automation Strategy

### 3.1 What to Automate

| Priority | Category | Automation Rate Target | Rationale |
|----------|----------|----------------------|-----------|
| P1 | Critical path regression | 100% | Revenue-impacting flows must never regress |
| P2 | High-frequency regression | 100% | Frequently executed tests yield highest ROI |
| P3 | Data migration validation | 100% | Financial data accuracy is non-negotiable |
| P4 | API contract tests | 100% | Prevents breaking changes in service interfaces |
| P5 | Smoke tests | 100% | Post-deployment gate; must be fast and reliable |
| P6 | Edge cases and negative tests | 80% | Important but lower frequency |
| P7 | Visual regression | 70% | UI changes are high-risk; partial automation |
| P8 | Accessibility compliance | 60% | Automated scans catch ~30% of issues |
| P9 | Performance baselines | 50% | Requires dedicated environments and orchestration |

### 3.2 What NOT to Automate

| Category | Rationale | Alternative |
|----------|-----------|-------------|
| Exploratory testing | Requires human intuition and creativity | Skilled exploratory sessions |
| Usability testing | Subjective assessment of user experience | User interviews, A/B testing |
| One-off data fixes | Not worth automating; one-time operation | Manual scripts with review |
| Complex multi-system UAT | Too many external dependencies | Coordinated manual execution |
| Regulatory sign-off | Requires human judgement and accountability | Documented manual validation |

### 3.3 ROI Analysis Model

| Metric | Formula | Target |
|--------|---------|--------|
| Test Execution Time Saved | Manual time per run - Automated time per run | 80% reduction |
| Defect Escape Rate | Defects found in prod / Total defects | < 2% |
| Cost of Automation | Dev hours x Hourly rate | Tracked per test suite |
| Cost Avoidance | Prevented defects x Cost per defect | 10x investment within 12 months |
| Time to Feedback | Commit to test results time | < 15 minutes for smoke tests |

### 3.4 Prioritisation Matrix

| Impact \ Effort | Low Effort | Medium Effort | High Effort |
|-----------------|-----------|--------------|-------------|
| **High Impact** | Automate immediately | Automate in Sprint 1 | Automate in Sprint 2 |
| **Medium Impact** | Automate in Sprint 1 | Automate if capacity allows | Defer to backlog |
| **Low Impact** | Automate if time permits | Manual testing | Manual testing |

---

## 4. Framework Architecture

### 4.1 Page Object Model (POM)

The Page Object Model encapsulates UI element interactions behind well-named page classes. This separation ensures that when the UI changes, only the page object is updated, not every test referencing that page.

#### 4.1.1 Python Implementation (Playwright)

```python
# pages/dashboard_page.py

from playwright.sync_api import Page, Locator


class DashboardPage:
    """Page object for the MAP Migration Dashboard."""

    # Locators
    PAGE_TITLE = "h1[data-testid='dashboard-title']"
    MIGRATION_TABLE = "table[data-testid='migration-table']"
    ROW_COUNT = "table[data-testid='migration-table'] tbody tr"
    STATUS_FILTER = "select[data-testid='status-filter']"
    SEARCH_INPUT = "input[data-testid='search-input']"
    CREATE_MIGRATION_BUTTON = "button[data-testid='create-migration']"
    LOADING_SPINNER = "div[data-testid='loading-spinner']"

    def __init__(self, page: Page):
        self.page = page

    def navigate(self) -> "DashboardPage":
        """Navigate to the MAP dashboard."""
        self.page.goto("/dashboard")
        self.page.wait_for_selector(self.PAGE_TITLE)
        return self

    def get_page_title_text(self) -> str:
        """Return the dashboard page title."""
        return self.page.text_content(self.PAGE_TITLE)

    def get_migration_rows(self) -> Locator:
        """Return all migration table rows."""
        return self.page.locator(self.ROW_COUNT)

    def filter_by_status(self, status: str) -> "DashboardPage":
        """Filter migrations by status."""
        self.page.select_option(self.STATUS_FILTER, status)
        self.page.wait_for_load_state("networkidle")
        return self

    def search_migrations(self, query: str) -> "DashboardPage":
        """Search migrations by name."""
        self.page.fill(self.SEARCH_INPUT, query)
        self.page.press(self.SEARCH_INPUT, "Enter")
        self.page.wait_for_load_state("networkidle")
        return self

    def click_create_migration(self) -> "CreateMigrationPage":
        """Click the create migration button."""
        self.page.click(self.CREATE_MIGRATION_BUTTON)
        from pages.create_migration_page import CreateMigrationPage
        return CreateMigrationPage(self.page)

    def is_loading(self) -> bool:
        """Check if the dashboard is in a loading state."""
        return self.page.is_visible(self.LOADING_SPINNER)
```

#### 4.1.2 TypeScript Implementation (Playwright)

```typescript
// pages/dashboard.page.ts

import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly migrationTable: Locator;
  readonly rowCount: Locator;
  readonly statusFilter: Locator;
  readonly searchInput: Locator;
  readonly createMigrationButton: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator("[data-testid='dashboard-title']");
    this.migrationTable = page.locator("[data-testid='migration-table']");
    this.rowCount = page.locator(
      "[data-testid='migration-table'] tbody tr"
    );
    this.statusFilter = page.locator("[data-testid='status-filter']");
    this.searchInput = page.locator("[data-testid='search-input']");
    this.createMigrationButton = page.locator(
      "[data-testid='create-migration']"
    );
    this.loadingSpinner = page.locator("[data-testid='loading-spinner']");
  }

  async navigate(): Promise<this> {
    await this.page.goto("/dashboard");
    await this.pageTitle.waitFor();
    return this;
  }

  async getPageTitleText(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? "";
  }

  async getMigrationRowCount(): Promise<number> {
    return this.rowCount.count();
  }

  async filterByStatus(status: string): Promise<this> {
    await this.statusFilter.selectOption(status);
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  async searchMigrations(query: string): Promise<this> {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  async clickCreateMigration(): Promise<void> {
    await this.createMigrationButton.click();
  }
}
```

### 4.2 Keyword-Driven Framework

Keyword-driven testing separates test logic from test data using action keywords. This enables non-technical stakeholders to author and maintain test scenarios.

#### 4.2.1 Keyword Registry

| Category | Keyword | Method | Parameters |
|----------|---------|--------|------------|
| Navigation | NAVIGATE_TO | `page.goto(url)` | url: string |
| Navigation | WAIT_FOR_ELEMENT | `page.wait_for_selector(locator)` | locator: string |
| Interaction | CLICK | `page.click(locator)` | locator: string |
| Interaction | FILL | `page.fill(locator, value)` | locator: string, value: string |
| Interaction | SELECT_OPTION | `page.select_option(locator, value)` | locator: string, value: string |
| Interaction | CHECK | `page.check(locator)` | locator: string |
| Interaction | UNCHECK | `page.uncheck(locator)` | locator: string |
| Assertion | ASSERT_VISIBLE | `page.is_visible(locator)` | locator: string |
| Assertion | ASSERT_TEXT | `page.text_content(locator)` | locator: string, expected: string |
| Assertion | ASSERT_VALUE | `page.input_value(locator)` | locator: string, expected: string |
| Assertion | ASSERT_COUNT | `page.locator(locator).count()` | locator: string, expected: int |
| API | GET_REQUEST | `requests.get(url)` | url: string, headers: dict |
| API | POST_REQUEST | `requests.post(url, json)` | url: string, body: dict |
| API | ASSERT_STATUS | Response status assertion | expected: int |
| Data | WAIT_FOR_TABLE | Wait for table rows to load | row_count: int |

#### 4.2.2 Keyword Engine Implementation

```python
# core/keyword_engine.py

from typing import Callable, Any
from playwright.sync_api import Page


class KeywordEngine:
    """Keyword-driven test execution engine."""

    def __init__(self, page: Page):
        self.page = page
        self.keywords: dict[str, Callable] = {
            "NAVIGATE_TO": self._navigate_to,
            "CLICK": self._click,
            "FILL": self._fill,
            "SELECT_OPTION": self._select_option,
            "WAIT_FOR_ELEMENT": self._wait_for_element,
            "ASSERT_VISIBLE": self._assert_visible,
            "ASSERT_TEXT": self._assert_text,
            "ASSERT_COUNT": self._assert_count,
        }

    def execute(self, keyword: str, **kwargs: Any) -> Any:
        """Execute a keyword with given parameters."""
        if keyword not in self.keywords:
            raise ValueError(f"Unknown keyword: {keyword}")
        return self.keywords[keyword](**kwargs)

    def _navigate_to(self, url: str) -> None:
        self.page.goto(url)

    def _click(self, locator: str) -> None:
        self.page.click(locator)

    def _fill(self, locator: str, value: str) -> None:
        self.page.fill(locator, value)

    def _select_option(self, locator: str, value: str) -> None:
        self.page.select_option(locator, value)

    def _wait_for_element(self, locator: str) -> None:
        self.page.wait_for_selector(locator)

    def _assert_visible(self, locator: str) -> bool:
        visible = self.page.is_visible(locator)
        assert visible, f"Element {locator} is not visible"
        return visible

    def _assert_text(self, locator: str, expected: str) -> str:
        actual = self.page.text_content(locator)
        assert actual == expected, (
            f"Expected '{expected}', got '{actual}'"
        )
        return actual

    def _assert_count(self, locator: str, expected: int) -> int:
        actual = self.page.locator(locator).count()
        assert actual == expected, (
            f"Expected {expected} elements, got {actual}"
        )
        return actual
```

### 4.3 Data-Driven Framework

Data-driven testing externalises test data into structured files. A single test template executes against multiple data sets, maximising coverage while minimising code duplication.

#### 4.3.1 Test Data Format (YAML)

```yaml
# test_data/migration_validation_scenarios.yaml

scenarios:
  - name: "Valid single server migration"
    input:
      source_type: "on-premise"
      server_count: 1
      storage_gb: 100
      os: "Windows Server 2019"
    expected:
      estimated_cost: 2500.00
      estimated_duration_days: 14
      risk_level: "low"
      validation_status: "passed"

  - name: "Large-scale multi-server migration"
    input:
      source_type: "on-premise"
      server_count: 50
      storage_gb: 5000
      os: "Mixed"
    expected:
      estimated_cost: 125000.00
      estimated_duration_days: 90
      risk_level: "high"
      validation_status: "passed"

  - name: "Zero server migration"
    input:
      source_type: "on-premise"
      server_count: 0
      storage_gb: 0
      os: "N/A"
    expected:
      estimated_cost: 0
      estimated_duration_days: 0
      risk_level: "low"
      validation_status: "failed"
      error: "Server count must be greater than zero"

  - name: "Negative storage value"
    input:
      source_type: "on-premise"
      server_count: 5
      storage_gb: -100
      os: "Linux"
    expected:
      validation_status: "failed"
      error: "Storage size cannot be negative"
```

#### 4.3.2 Data-Driven Test Runner

```python
# tests/test_migration_validation.py

import pytest
import yaml
from pathlib import Path
from core.migration_calculator import MigrationCalculator


def load_scenarios() -> list[dict]:
    """Load test scenarios from YAML file."""
    data_path = Path(__file__).parent.parent / "test_data"
    with open(data_path / "migration_validation_scenarios.yaml") as f:
        data = yaml.safe_load(f)
    return data["scenarios"]


@pytest.mark.parametrize(
    "scenario",
    load_scenarios(),
    ids=lambda s: s["name"],
)
def test_migration_validation(scenario: dict) -> None:
    """Run a data-driven migration validation test."""
    calculator = MigrationCalculator()
    input_data = scenario["input"]
    expected = scenario["expected"]

    if expected.get("validation_status") == "failed":
        with pytest.raises(ValueError, match=expected.get("error", "")):
            calculator.calculate_migration_estimate(**input_data)
    else:
        result = calculator.calculate_migration_estimate(**input_data)
        assert result.estimated_cost == expected["estimated_cost"]
        assert result.estimated_duration_days == expected["estimated_duration_days"]
        assert result.risk_level == expected["risk_level"]
```

### 4.4 Hybrid Architecture

MAP adopts a **hybrid framework** combining POM, keyword-driven, and data-driven patterns:

| Layer | Pattern | Purpose |
|-------|---------|---------|
| Page Objects | POM | Encapsulate UI element interactions |
| Test Templates | Data-Driven | Parameterise test scenarios across data sets |
| Business Flows | Keyword-Driven | Enable non-technical scenario authoring |
| API Clients | POM | Wrap HTTP endpoints in typed client classes |
| Test Data | Data-Driven | Externalise all test data from test code |
| Fixtures | pytest Fixtures | Share setup/teardown across test suites |

---

## 5. Tool Selection and Justification

### 5.1 Tool Comparison Matrix

| Criterion | pytest + Playwright | Selenium WebDriver | Cypress | REST Assured (Java) |
|-----------|--------------------|--------------------|---------|---------------------|
| **Language** | Python | Multi-language | TypeScript | Java |
| **Browser Automation** | Excellent | Excellent | Excellent | N/A (API only) |
| **API Testing** | requests + pytest | Limited | Limited | Excellent |
| **Auto-Wait** | Built-in | Manual waits | Built-in | N/A |
| **Parallel Execution** | pytest-xdist | Selenium Grid | Native | Maven Surefire |
| **Cloud Integration** | Playwright Cloud | Selenium Grid | Cypress Cloud | N/A |
| **CI/CD Support** | Excellent | Good | Good | Good |
| **Learning Curve** | Low | Medium | Low | Medium |
| **Financial Domain Use** | Strong | Strong | Growing | Strong |
| **Community Support** | Large | Very Large | Large | Large |

### 5.2 Recommended Tool Stack

| Test Type | Primary Tool | Supporting Tools | Rationale |
|-----------|-------------|-----------------|-----------|
| **Unit Tests (Python)** | pytest | pytest-mock, pytest-cov | Industry standard; excellent plugin ecosystem |
| **Unit Tests (.NET)** | xUnit | Moq, FluentAssertions | MAP backend standard per Batch 11 |
| **E2E UI Testing** | Playwright | Playwright Test | Auto-wait, multi-browser, codegen |
| **API Testing** | pytest + requests | hypothesis, schemathesis | Python-native; property-based testing |
| **API Contract Testing** | Pact | pytest-pact | Consumer-driven contract testing |
| **Performance Testing** | k6 | Grafana Cloud | Scriptable, CI-integrated, cloud-native |
| **Security Testing** | OWASP ZAP | bandit (Python) | SAST/DAST integration |
| **Accessibility Testing** | axe-core | Playwright + axe | WCAG 2.1 AA compliance |
| **Visual Regression** | Playwright | Percy | Pixel-diff comparison |

### 5.3 Tool Version Matrix

| Tool | Minimum Version | Recommended Version | Upgrade Policy |
|------|-----------------|--------------------| -------------- |
| Python | 3.11 | 3.12 | Track latest stable |
| pytest | 7.4 | 8.0+ | Upgrade within 30 days of release |
| Playwright | 1.40 | 1.45+ | Upgrade within 14 days of release |
| Node.js | 20 LTS | 20 LTS | Track LTS only |
| .NET | 8.0 | 8.0 | Track STS/LTS releases |
| xUnit | 2.6 | 2.8+ | Upgrade within 30 days |
| k6 | 0.48 | 0.50+ | Upgrade within 30 days |

---

## 6. Test Automation Pyramid

### 6.1 MAP Automation Pyramid

```
                    ┌─────────────┐
                    │   Manual    │  5%
                    │ Exploratory │
                    ├─────────────┤
                   │   E2E UI     │  15%
                   │  Playwright  │
                  ├───────────────┤
                 │   Integration   │  25%
                 │ API + Contract  │
                ├───────────────────┤
               │     Unit Tests     │  55%
               │   pytest / xUnit   │
              └───────────────────────┘
```

### 6.2 Coverage Targets by Layer

| Layer | Coverage Target | Metric | Enforcement |
|-------|----------------|--------|-------------|
| Unit Tests | 80% line coverage | Coverage report | CI gate |
| Integration Tests | 80% API endpoint coverage | Endpoint matrix | CI gate |
| E2E Tests | 100% critical path | User story traceability | Sprint review |
| Contract Tests | 100% inter-service contracts | Pact verification | CI gate |
| Performance Tests | 100% critical path | Baseline comparison | Release gate |

---

## 7. CI/CD Integration

### 7.1 Azure DevOps Pipeline Configuration

```yaml
# azure-pipelines.yml

trigger:
  branches:
    include:
      - main
      - develop
      - feature/*
  paths:
    include:
      - src/*
      - tests/*

pr:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: "ubuntu-latest"

variables:
  pythonVersion: "3.12"
  nodeVersion: "20"

stages:
  # ─── Stage 1: Build and Unit Tests ───────────────────────────────
  - stage: BuildAndUnitTests
    displayName: "Build & Unit Tests"
    jobs:
      - job: PythonUnitTests
        displayName: "Python Unit Tests"
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: "$(pythonVersion)"
            displayName: "Use Python $(pythonVersion)"

          - script: |
              pip install -r requirements.txt
              pip install -r requirements-dev.txt
            displayName: "Install dependencies"

          - script: |
              pytest tests/unit/ \
                --cov=src/ \
                --cov-report=xml:coverage.xml \
                --cov-report=html:htmlcov/ \
                --junitxml=test-results.xml \
                -v --tb=short
            displayName: "Run unit tests"

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: "JUnit"
              testResultsFiles: "test-results.xml"
            displayName: "Publish test results"

          - task: PublishCodeCoverageResults@2
            inputs:
              summaryFileLocation: "coverage.xml"
            displayName: "Publish coverage"

      - job: DotNetUnitTests
        displayName: ".NET Unit Tests"
        steps:
          - task: UseDotNet@2
            inputs:
              version: "8.0.x"
            displayName: "Use .NET 8"

          - script: |
              dotnet restore
              dotnet build --no-restore
            displayName: "Build solution"

          - script: |
              dotnet test \
                --no-build \
                --collect:"XPlat Code Coverage" \
                --results-directory ./TestResults \
                --logger "trx;LogFileName=test-results.trx"
            displayName: "Run unit tests"

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: "VSTest"
              testResultsFiles: "**/test-results.trx"
            displayName: "Publish test results"

  # ─── Stage 2: Integration Tests ──────────────────────────────────
  - stage: IntegrationTests
    displayName: "Integration Tests"
    dependsOn: BuildAndUnitTests
    jobs:
      - job: APITests
        displayName: "API Integration Tests"
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: "$(pythonVersion)"

          - script: |
              pip install -r requirements.txt
              pip install -r requirements-dev.txt
            displayName: "Install dependencies"

          - script: |
              docker-compose -f docker-compose.test.yml up -d
              sleep 30
            displayName: "Start test containers"

          - script: |
              pytest tests/integration/ \
                --env=test \
                --junitxml=integration-results.xml \
                -v --tb=short
            displayName: "Run integration tests"

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: "JUnit"
              testResultsFiles: "integration-results.xml"

          - script: |
              docker-compose -f docker-compose.test.yml down
            displayName: "Stop test containers"

  # ─── Stage 3: E2E Tests ──────────────────────────────────────────
  - stage: E2ETests
    displayName: "E2E Tests"
    dependsOn: IntegrationTests
    jobs:
      - job: PlaywrightTests
        displayName: "Playwright E2E Tests"
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: "$(pythonVersion)"

          - script: |
              pip install -r requirements.txt
              pip install -r requirements-dev.txt
              playwright install --with-deps chromium firefox
            displayName: "Install Playwright browsers"

          - script: |
              pytest tests/e2e/ \
                --env=staging \
                --junitxml=e2e-results.xml \
                --html=e2e-report.html \
                -v --tb=short
            displayName: "Run E2E tests"

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: "JUnit"
              testResultsFiles: "e2e-results.xml"

          - task: PublishBuildArtifact@1
            inputs:
              pathToPublish: "e2e-report.html"
              artifactName: "e2e-report"

  # ─── Stage 4: Quality Gate ────────────────────────────────────────
  - stage: QualityGate
    displayName: "Quality Gate"
    dependsOn:
      - BuildAndUnitTests
      - IntegrationTests
      - E2ETests
    jobs:
      - job: Gate
        displayName: "Evaluate Quality Metrics"
        steps:
          - script: |
              python scripts/quality_gate.py \
                --min-unit-coverage 80 \
                --min-integration-coverage 80 \
                --max-flaky-tests 0 \
                --max-pending-defects 0
            displayName: "Evaluate quality gate"
```

### 7.2 GitHub Actions Configuration

```yaml
# .github/workflows/test-automation.yml

name: Test Automation

on:
  push:
    branches: [main, develop]
    paths: ["src/**", "tests/**"]
  pull_request:
    branches: [main, develop]

env:
  PYTHON_VERSION: "3.12"
  NODE_VERSION: "20"

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: "pip"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run unit tests
        run: |
          pytest tests/unit/ \
            --cov=src/ \
            --cov-report=xml:coverage.xml \
            --junitxml=test-results.xml \
            -v

      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Unit Test Results
          path: test-results.xml
          reporter: java-junit

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: coverage.xml

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: unit-tests
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: map_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports: ["6379:6379"]

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: "pip"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/map_test
          REDIS_URL: redis://localhost:6379
        run: |
          pytest tests/integration/ \
            --junitxml=integration-results.xml \
            -v

  e2e-tests:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: "pip"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
          playwright install --with-deps chromium

      - name: Run E2E tests
        run: |
          pytest tests/e2e/ \
            --browser=chromium \
            --junitxml=e2e-results.xml \
            -v

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests]
    steps:
      - uses: actions/checkout@v4

      - name: Evaluate quality metrics
        run: |
          python scripts/quality_gate.py \
            --min-unit-coverage 80 \
            --min-integration-coverage 80 \
            --max-flaky-tests 0
```

### 7.3 Pipeline Stage Summary

| Stage | Duration Target | Gate | Failure Action |
|-------|----------------|------|----------------|
| Unit Tests | < 5 minutes | Block merge | Block PR |
| Integration Tests | < 10 minutes | Block merge | Block PR |
| E2E Tests | < 15 minutes | Block merge | Block PR |
| Quality Gate | < 2 minutes | Block release | Block deployment |
| Performance Tests | < 30 minutes | Warn on regression | Notify team |
| Security Scan | < 10 minutes | Block on critical | Block PR |

---

## 8. Reporting and Dashboards

### 8.1 Test Report Structure

| Report Type | Format | Frequency | Audience |
|-------------|--------|-----------|----------|
| Unit Test Results | JUnit XML + HTML | Per commit | Developers |
| Integration Test Results | JUnit XML + HTML | Per PR | Developers, QA |
| E2E Test Results | HTML + Screenshots | Per PR | Developers, QA, PO |
| Regression Summary | Dashboard | Daily | All stakeholders |
| Coverage Report | HTML + XML | Per PR | Developers, Tech Lead |
| Defect Trend Report | Dashboard | Weekly | QA Lead, PM |
| Release Quality Report | PDF + Dashboard | Per release | Management |

### 8.2 pytest Configuration

```ini
# pytest.ini

[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*

markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    smoke: Smoke tests
    regression: Regression tests
    performance: Performance tests
    security: Security tests
    ai: AI-specific tests
    slow: Slow-running tests (>30s)

addopts =
    --strict-markers
    --tb=short
    -q
    --junitxml=test-results.xml

filterwarnings =
    ignore::DeprecationWarning
    ignore::PendingDeprecationWarning

log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_cli_date_format = %Y-%m-%d %H:%M:%S
```

### 8.3 Custom Reporting Plugin

```python
# plugins/quality_reporter.py

import json
from datetime import datetime, timezone
from pathlib import Path
from pytest import hookimpl
from dataclasses import dataclass, field


@dataclass
class TestMetrics:
    total: int = 0
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    duration_seconds: float = 0.0
    coverage_percent: float = 0.0
    flaky_count: int = 0
    timestamp: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    @property
    def pass_rate(self) -> float:
        if self.total == 0:
            return 0.0
        return (self.passed / self.total) * 100

    def to_dict(self) -> dict:
        return {
            "total": self.total,
            "passed": self.passed,
            "failed": self.failed,
            "skipped": self.skipped,
            "pass_rate": round(self.pass_rate, 2),
            "duration_seconds": round(self.duration_seconds, 2),
            "coverage_percent": round(self.coverage_percent, 2),
            "flaky_count": self.flaky_count,
            "timestamp": self.timestamp,
        }


class QualityReporter:
    """Custom pytest plugin for quality metrics reporting."""

    def __init__(self):
        self.metrics = TestMetrics()
        self.test_durations: list[float] = []

    @hookimpl(hookwrapper=True)
    def pytest_runtest_makereport(self, item, call):
        outcome = yield
        report = outcome.get_result()

        if report.when == "call":
            self.metrics.total += 1
            if report.passed:
                self.metrics.passed += 1
            elif report.failed:
                self.metrics.failed += 1
            elif report.skipped:
                self.metrics.skipped += 1
            self.test_durations.append(report.duration)

    def pytest_sessionfinish(self, session, exitstatus):
        self.metrics.duration_seconds = sum(self.test_durations)
        self._write_report()
        self._check_quality_gates()

    def _write_report(self) -> None:
        report_path = Path("test-output/quality-report.json")
        report_path.parent.mkdir(parents=True, exist_ok=True)
        with open(report_path, "w") as f:
            json.dump(self.metrics.to_dict(), f, indent=2)

    def _check_quality_gates(self) -> None:
        gates = {
            "pass_rate": self.metrics.pass_rate >= 99.0,
            "coverage": self.metrics.coverage_percent >= 80.0,
            "flaky": self.metrics.flaky_count == 0,
        }
        gate_path = Path("test-output/quality-gates.json")
        with open(gate_path, "w") as f:
            json.dump(gates, f, indent=2)

        if not all(gates.values()):
            failed_gates = [k for k, v in gates.items() if not v]
            raise RuntimeError(
                f"Quality gates failed: {', '.join(failed_gates)}"
            )


def pytest_configure(config):
    config.pluginmanager.register(QualityReporter(), "quality_reporter")
```

### 8.4 Dashboard Metrics

| Metric | Target | Alert Threshold | Source |
|--------|--------|----------------|--------|
| Overall Pass Rate | >= 99% | < 98% | Quality report |
| Unit Test Coverage | >= 80% | < 75% | Coverage report |
| API Endpoint Coverage | >= 80% | < 75% | Coverage matrix |
| E2E Critical Path | 100% | < 100% | Traceability matrix |
| Mean Test Duration | < 2 min | > 5 min | Execution logs |
| Flaky Test Count | 0 | > 0 | Historical results |
| Defect Escape Rate | < 2% | > 3% | Defect tracker |
| Time to Feedback | < 15 min | > 20 min | Pipeline logs |

---

## 9. Environment Management

### 9.1 Environment Matrix

| Environment | Purpose | Data | Access | Refresh Cycle |
|-------------|---------|------|--------|---------------|
| Local (Docker) | Developer testing | Synthetic subset | Individual | On-demand |
| CI (Containers) | Automated tests | Synthetic full | CI pipeline | Per run |
| Staging | Pre-production validation | Anonymised production | Team | Weekly |
| Performance | Load testing | Production-scale synthetic | QA team | Per release |
| UAT | User acceptance testing | Anonymised production | Business users | Per sprint |

### 9.2 Docker Test Environment

```yaml
# docker-compose.test.yml

version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.test
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://test:test@postgres:5432/map_test
      - REDIS_URL=redis://redis:6379
      - AZURE_STORAGE_CONNECTION=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://azurite:10001/devstoreaccount1;
      - ENVIRONMENT=test
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - test-network

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: map_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5432:5432"
    volumes:
      - ./scripts/init-test-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test -d map_test"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - test-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - test-network

  azurite:
    image: mcr.microsoft.com/azure-storage/azurite
    ports:
      - "10000:10000"
      - "10001:10001"
      - "10002:10002"
    volumes:
      - azurite-data:/data
    networks:
      - test-network

volumes:
  azurite-data:

networks:
  test-network:
    driver: bridge
```

### 9.3 Testcontainers (Python)

```python
# conftest.py

import pytest
from testcontainers.postgres import PostgresContainer
from testcontainers.redis import RedisContainer


@pytest.fixture(scope="session")
def postgres():
    """Start a PostgreSQL testcontainer for the test session."""
    with PostgresContainer("postgres:16") as pg:
        pg.with_env("POSTGRES_DB", "map_test")
        yield pg


@pytest.fixture(scope="session")
def redis():
    """Start a Redis testcontainer for the test session."""
    with RedisContainer("redis:7-alpine") as r:
        yield r


@pytest.fixture(scope="session")
def database_url(postgres):
    """Provide a database connection URL."""
    return postgres.get_connection_url()


@pytest.fixture(autouse=True)
def reset_database(database_url):
    """Reset database state before each test."""
    yield
    # Teardown: truncate all tables
    import sqlalchemy

    engine = sqlalchemy.create_engine(database_url)
    with engine.connect() as conn:
        conn.execute("TRUNCATE CASCADE")
        conn.commit()
```

---

## 10. Test Data Management

### 10.1 Test Data Strategy

| Data Type | Strategy | Source | Refresh |
|-----------|----------|--------|---------|
| Unit test data | Inline fixtures | Test code | N/A |
| Integration test data | Factory pattern | Faker library | Per test |
| E2E test data | YAML/JSON files | Test data directory | Per suite |
| Performance test data | Generated dataset | Data generator script | Per release |
| UAT test data | Anonymised production | Data anonymisation pipeline | Per sprint |

### 10.2 Factory Pattern Implementation

```python
# factories/migration_factory.py

from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime, timezone
import uuid


@dataclass
class MigrationRecord:
    """Data class for a migration record."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    source_type: str = "on-premise"
    server_count: int = 1
    storage_gb: int = 100
    status: str = "pending"
    created_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    estimated_cost: Optional[float] = None
    estimated_duration_days: Optional[int] = None


class MigrationFactory:
    """Factory for creating migration test records."""

    @staticmethod
    def create(**kwargs) -> MigrationRecord:
        """Create a migration record with custom overrides."""
        defaults = {
            "name": f"Migration-{uuid.uuid4().hex[:8]}",
            "source_type": "on-premise",
            "server_count": 1,
            "storage_gb": 100,
            "status": "pending",
        }
        defaults.update(kwargs)
        return MigrationRecord(**defaults)

    @staticmethod
    def create_batch(count: int, **kwargs) -> list[MigrationRecord]:
        """Create a batch of migration records."""
        return [
            MigrationFactory.create(**kwargs) for _ in range(count)
        ]

    @staticmethod
    def create_completed() -> MigrationRecord:
        """Create a completed migration record."""
        return MigrationFactory.create(
            status="completed",
            estimated_cost=2500.00,
            estimated_duration_days=14,
        )

    @staticmethod
    def create_failed() -> MigrationRecord:
        """Create a failed migration record."""
        return MigrationFactory.create(status="failed")

    @staticmethod
    def create_large_scale() -> MigrationRecord:
        """Create a large-scale migration record."""
        return MigrationFactory.create(
            server_count=500,
            storage_gb=50000,
            name="Enterprise Migration - 500 Servers",
        )
```

### 10.3 Fixture Strategy

```python
# conftest.py

import pytest
from factories.migration_factory import MigrationFactory


@pytest.fixture
def sample_migration() -> MigrationRecord:
    """Provide a standard migration record for testing."""
    return MigrationFactory.create()


@pytest.fixture
def large_migration() -> MigrationRecord:
    """Provide a large-scale migration record for testing."""
    return MigrationFactory.create_large_scale()


@pytest.fixture
def migration_batch() -> list[MigrationRecord]:
    """Provide a batch of 10 migration records."""
    return MigrationFactory.create_batch(10)


@pytest.fixture
def completed_migrations() -> list[MigrationRecord]:
    """Provide 5 completed migration records."""
    return MigrationFactory.create_batch(5, status="completed")


@pytest.fixture(autouse=True)
def clean_test_data():
    """Ensure test data is cleaned up after each test."""
    yield
    # Cleanup logic
```

---

## 11. Automation Priorities

### 11.1 Critical Path Automation

| # | Critical Path | Priority | Target Coverage |
|---|--------------|----------|-----------------|
| CP1 | User login and authentication | P1 | 100% |
| CP2 | Migration creation wizard | P1 | 100% |
| CP3 | Migration execution and monitoring | P1 | 100% |
| CP4 | Data validation and reconciliation | P1 | 100% |
| CP5 | Report generation and export | P2 | 100% |
| CP6 | User management and roles | P2 | 100% |
| CP7 | Dashboard navigation and filtering | P2 | 100% |
| CP8 | Settings and configuration | P3 | 80% |

### 11.2 Regression Test Suite Organisation

| Suite | Scope | Execution Trigger | Timeout |
|-------|-------|-------------------|---------|
| `smoke` | Critical path only | Every commit | 5 min |
| `regression-fast` | Fast unit + integration | Every PR | 10 min |
| `regression-full` | Complete regression | Nightly / release | 60 min |
| `performance` | Performance baselines | Weekly / release | 30 min |
| `security` | Security scanning | Weekly / release | 20 min |

### 11.3 Test Execution Schedule

```
┌──────────────────────────────────────────────────────────────┐
│                    Test Execution Schedule                    │
├─────────────┬────────────────────────────────────────────────┤
│ Trigger     │ Test Suite                                    │
├─────────────┼────────────────────────────────────────────────┤
│ Commit      │ Lint + Type Check + Unit Tests (smoke)       │
│ Pull Request│ Smoke + Regression-Fast + Coverage Gate       │
│ Merge to dev│ Smoke + Regression-Full + Integration         │
│ Merge to main│ All suites + Quality Gate + Performance     │
│ Nightly     │ Full regression + Security scan              │
│ Release     │ Full regression + Performance + Security     │
│ Post-deploy │ Smoke tests in target environment            │
└─────────────┴────────────────────────────────────────────────┘
```

---

## 12. Best Practices

### 12.1 Test Independence

| Rule | Description | Example |
|------|-------------|---------|
| No shared state | Tests must not depend on execution order | Use fresh fixtures per test |
| No test-to-test calls | Tests must not invoke other tests | Each test is self-contained |
| Unique test data | Each test uses unique identifiers | Generate UUIDs per test |
| Independent setup/teardown | Each test manages its own resources | Use pytest fixtures |

### 12.2 Naming Conventions

```python
# Convention: test_<unit_under_test>_<scenario>_<expected_outcome>

# GOOD
def test_migration_calculator_valid_input_returns_cost():
    ...

def test_migration_calculator_negative_server_count_raises_error():
    ...

def test_migration_calculator_large_scale_returns_high_risk():
    ...

# BAD
def test_calc():
    ...

def test_migration():
    ...

def test_it_works():
    ...
```

### 12.3 Arrange-Act-Assert (AAA) Pattern

```python
def test_migration_estimate_calculates_correct_cost() -> None:
    """Test that migration estimate calculates cost correctly."""
    # Arrange
    calculator = MigrationCalculator()
    request = MigrationRequest(server_count=10, storage_gb=500)

    # Act
    result = calculator.calculate_estimate(request)

    # Assert
    assert result.total_cost == 12500.00
    assert result.duration_days == 30
    assert result.risk_level == "medium"
```

### 12.4 Maintainability Standards

| Standard | Description | Enforcement |
|----------|-------------|-------------|
| DRY (within reason) | Extract shared setup into fixtures, but keep tests self-contained | Code review |
| Single assertion concept | One test validates one logical assertion | Code review |
| Descriptive docstrings | Every test function has a descriptive docstring | Linting |
| Page object encapsulation | UI locators never appear in test code | Code review |
| No magic numbers | Use constants or descriptive variables | Linting |
| Fast feedback | Unit tests < 1s, integration < 5s, E2E < 30s | CI timing |

### 12.5 Readability Standards

| Standard | Example |
|----------|---------|
| Use descriptive variable names | `migration_record` not `m` |
| Use context managers for resources | `with PostgresContainer() as pg:` |
| Keep test functions under 30 lines | Extract helpers for complex setup |
| Use section comments | `# Arrange`, `# Act`, `# Assert` |
| Group related tests | Use classes or files per feature |

### 12.6 Flake Prevention

| Prevention | Description |
|-----------|-------------|
| Auto-wait | Use Playwright's built-in waiting mechanisms |
| Explicit waits | Never use `time.sleep()`; use condition-based waits |
| Deterministic data | Generate test data inline, never rely on external state |
| Isolated cleanup | Clean up only what you create |
| Retry only flaky | Never retry failed assertions; fix the root cause |

---

## 13. Code Standards and Examples

### 13.1 Python/pytest E2E Test Example

```python
# tests/e2e/test_migration_lifecycle.py

import pytest
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.create_migration_page import CreateMigrationPage
from pages.migration_detail_page import MigrationDetailPage
from factories.migration_factory import MigrationFactory


@pytest.mark.e2e
@pytest.mark.regression
class TestMigrationLifecycle:
    """E2E tests for the complete migration lifecycle."""

    def test_full_migration_lifecycle(
        self, page, base_url, test_user_credentials
    ) -> None:
        """Test complete migration creation to completion."""
        # Arrange
        login_page = LoginPage(page)
        migration_data = MigrationFactory.create(
            server_count=5,
            storage_gb=500,
        )

        # Act - Login
        login_page.navigate(base_url)
        login_page.login(
            test_user_credentials["username"],
            test_user_credentials["password"],
        )

        # Act - Create Migration
        dashboard = DashboardPage(page)
        dashboard.navigate()
        create_page = dashboard.click_create_migration()
        create_page.fill_migration_form(migration_data)
        create_page.submit()

        # Act - Verify Migration Created
        detail_page = MigrationDetailPage(page)
        assert detail_page.get_migration_name() == migration_data.name
        assert detail_page.get_status() == "pending"

        # Act - Execute Migration
        detail_page.click_execute()
        detail_page.wait_for_status("in_progress")
        detail_page.wait_for_status("completed", timeout=300)

        # Assert - Verify Completion
        assert detail_page.get_status() == "completed"
        assert detail_page.get_validation_results()["passed"] is True

    def test_dashboard_filter_by_status(self, page, base_url) -> None:
        """Test dashboard filtering by migration status."""
        # Arrange
        login_page = LoginPage(page)
        login_page.navigate(base_url)
        login_page.login("admin@map.test", "TestPassword123!")

        # Act
        dashboard = DashboardPage(page)
        dashboard.navigate()
        dashboard.filter_by_status("completed")

        # Assert
        rows = dashboard.get_migration_rows()
        for row in rows:
            status_cell = row.locator("td:nth-child(4)")
            assert status_cell.text_content() == "completed"
```

### 13.2 API Integration Test Example

```python
# tests/integration/test_migration_api.py

import pytest
import httpx
from pytest import fixture


@fixture
def api_client() -> httpx.Client:
    """Provide an HTTP client for API testing."""
    return httpx.Client(
        base_url="http://localhost:8000/api/v1",
        timeout=30.0,
        headers={"Authorization": "Bearer test-token"},
    )


@pytest.mark.integration
class TestMigrationAPI:
    """Integration tests for the Migration API."""

    def test_create_migration_returns_201(
        self, api_client: httpx.Client
    ) -> None:
        """Test creating a migration returns 201 Created."""
        # Arrange
        payload = {
            "name": "API Test Migration",
            "source_type": "on-premise",
            "server_count": 10,
            "storage_gb": 1000,
        }

        # Act
        response = api_client.post("/migrations", json=payload)

        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "API Test Migration"
        assert data["status"] == "pending"
        assert "id" in data

    def test_get_migration_returns_200(
        self, api_client: httpx.Client
    ) -> None:
        """Test retrieving a migration returns 200 OK."""
        # Arrange
        create_response = api_client.post(
            "/migrations",
            json={
                "name": "GET Test",
                "server_count": 1,
                "storage_gb": 100,
            },
        )
        migration_id = create_response.json()["id"]

        # Act
        response = api_client.get(f"/migrations/{migration_id}")

        # Assert
        assert response.status_code == 200
        assert response.json()["id"] == migration_id

    def test_list_migrations_returns_paginated_results(
        self, api_client: httpx.Client
    ) -> None:
        """Test listing migrations returns paginated results."""
        # Act
        response = api_client.get("/migrations?page=1&per_page=10")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert len(data["items"]) <= 10

    def test_create_migration_with_invalid_data_returns_422(
        self, api_client: httpx.Client
    ) -> None:
        """Test creating migration with invalid data returns 422."""
        # Arrange
        invalid_payload = {
            "name": "",  # Empty name
            "server_count": -1,  # Negative count
            "storage_gb": 0,
        }

        # Act
        response = api_client.post("/migrations", json=invalid_payload)

        # Assert
        assert response.status_code == 422
        errors = response.json()["detail"]
        assert any("name" in err["loc"][-1] for err in errors)
```

### 13.3 Contract Test Example

```python
# tests/integration/test_contract_migration_api.py

import pytest
from pact import Consumer, Provider
from pact.matchers import Like, EachLike


@pytest.fixture
def pact():
    """Create a Pact consumer-provider pair."""
    return Consumer("MAP-Frontend").has_pact_with(
        Provider("MAP-API"),
        pact_dir="pacts",
    )


@pytest.mark.contract
class TestMigrationAPIContract:
    """Contract tests for the Migration API."""

    def test_get_migration_contract(self, pact) -> None:
        """Test the GET /migrations/:id contract."""
        expected = {
            "id": Like("550e8400-e29b-41d4-a716-446655440000"),
            "name": Like("Test Migration"),
            "source_type": Like("on-premise"),
            "server_count": Like(10),
            "storage_gb": Like(1000),
            "status": Like("pending"),
            "estimated_cost": Like(25000.00),
            "estimated_duration_days": Like(60),
        }

        pact.given("a migration exists with ID 550e8400-e29b-41d4-a716-446655440000")
        pact.upon_receiving("a request for the migration")
        pact.with_request(
            method="GET",
            path="/api/v1/migrations/550e8400-e29b-41d4-a716-446655440000",
        ).will_respond_with(
            status=200,
            body=expected,
        )

        with pact:
            # Consumer side verification
            response = pact.method("GET")
            assert response.status_code == 200

    def test_list_migrations_contract(self, pact) -> None:
        """Test the GET /migrations contract."""
        expected = {
            "items": EachLike(
                {
                    "id": Like("550e8400-e29b-41d4-a716-446655440000"),
                    "name": Like("Test Migration"),
                    "status": Like("pending"),
                }
            ),
            "total": Like(1),
            "page": Like(1),
            "per_page": Like(10),
        }

        pact.given("migrations exist")
        pact.upon_receiving("a request for migration list")
        pact.with_request(
            method="GET",
            path="/api/v1/migrations",
            query={"page": "1", "per_page": "10"},
        ).will_respond_with(
            status=200,
            body=expected,
        )

        with pact:
            response = pact.method("GET", query={"page": "1", "per_page": "10"})
            assert response.status_code == 200
```

### 13.4 Performance Test Example

```javascript
// tests/performance/migration_load_test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const errorRate = new Rate("errors");
const migrationDuration = new Trend("migration_create_duration");

export const options = {
  stages: [
    { duration: "2m", target: 10 },   // Ramp up
    { duration: "5m", target: 50 },   // Stay at 50 users
    { duration: "2m", target: 100 },  // Spike to 100 users
    { duration: "5m", target: 100 },  // Stay at 100 users
    { duration: "2m", target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    errors: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export default function () {
  // Create migration
  const createPayload = JSON.stringify({
    name: `Load Test Migration ${Date.now()}`,
    source_type: "on-premise",
    server_count: Math.floor(Math.random() * 50) + 1,
    storage_gb: Math.floor(Math.random() * 5000) + 100,
  });

  const createRes = http.post(`${BASE_URL}/api/v1/migrations`, createPayload, {
    headers: { "Content-Type": "application/json" },
    tags: { name: "create_migration" },
  });

  check(createRes, {
    "create migration status is 201": (r) => r.status === 201,
    "create migration has id": (r) => JSON.parse(r.body).id !== undefined,
  });

  migrationDuration.add(createRes.timings.duration);
  errorRate.add(createRes.status !== 201);

  sleep(1);

  // List migrations
  const listRes = http.get(`${BASE_URL}/api/v1/migrations?page=1&per_page=10`, {
    tags: { name: "list_migrations" },
  });

  check(listRes, {
    "list migrations status is 200": (r) => r.status === 200,
    "list migrations has items": (r) => JSON.parse(r.body).items !== undefined,
  });

  errorRate.add(listRes.status !== 200);

  sleep(Math.random() * 3 + 1);
}
```

---

## 14. Maintenance Strategy

### 14.1 Flaky Test Management

| Category | Definition | Action | SLA |
|----------|-----------|--------|-----|
| Infrastructure Flaky | Failures due to environment issues | Fix environment, not test | 24 hours |
| Timing Flaky | Failures due to race conditions | Add proper waits/retry | 48 hours |
| Data Flaky | Failures due to test data conflicts | Use isolated test data | 48 hours |
| Assertion Flaky | Failures due to brittle assertions | Rewrite assertion logic | 72 hours |
| Permanently Flaky | Consistently fail across environments | Quarantine and fix | 1 sprint |

### 14.2 Flaky Test Quarantine Process

```python
# conftest.py - Flaky test detection and quarantine

import pytest
from collections import defaultdict


flaky_tracker: dict[str, int] = defaultdict(int)
FLAKY_THRESHOLD = 3


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        flaky_tracker[item.nodeid] += 1
        if flaky_tracker[item.nodeid] >= FLAKY_THRESHOLD:
            item.add_marker(pytest.mark.flaky)


def pytest_collection_modifyitems(config, items):
    """Separate flaky tests into their own section."""
    flaky_items = []
    stable_items = []
    for item in items:
        if item.nodeid in flaky_tracker and flaky_tracker[item.nodeid] >= FLAKY_THRESHOLD:
            flaky_items.append(item)
        else:
            stable_items.append(item)

    items[:] = stable_items + flaky_items
```

### 14.3 Test Refactoring Guidelines

| Trigger | Action | Priority |
|---------|--------|----------|
| Test > 50 lines | Refactor into helper methods | Medium |
| Duplicate assertions across tests | Extract shared assertion helpers | High |
| Hardcoded URLs/endpoints | Move to configuration | High |
| Deprecated API usage | Update to current API | High |
| Slow test (> 30s) | Optimize or split | High |
| Fragile selector | Switch to data-testid | Medium |

### 14.4 Technical Debt Management

| Debt Type | Detection | Remediation | Budget |
|-----------|-----------|-------------|--------|
| Flaky tests | CI failure history | Quarantine + fix | 10% of sprint |
| Slow tests | Timing reports | Optimize or parallelize | 5% of sprint |
| Outdated assertions | Code review | Rewrite | 5% of sprint |
| Deprecated dependencies | Dependabot alerts | Upgrade | 5% of sprint |
| Missing coverage | Coverage reports | Add tests | 10% of sprint |

---

## 15. Metrics and KPIs

### 15.1 Automation Health Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Test Pass Rate | >= 99% | Passed / Total x 100 | Per run |
| Test Coverage | >= 80% | Lines covered / Total lines x 100 | Per PR |
| Flaky Test Rate | 0% | Flaky tests / Total tests x 100 | Weekly |
| Mean Time to Feedback | < 15 min | Commit to test results | Per commit |
| Test Execution Time | < 60 min full suite | Total execution time | Per run |
| Defect Escape Rate | < 2% | Prod defects / Total defects x 100 | Monthly |
| Automation ROI | > 10x within 12 months | Cost avoided / Cost invested | Quarterly |

### 15.2 Test Quality Metrics

| Metric | Target | Source |
|--------|--------|--------|
| Test Independence | 100% | No inter-test dependencies |
| Test Determinism | 100% | Same result every run |
| Test Readability Score | >= 8/10 | Peer review assessment |
| Page Object Coverage | 100% | All UI tests use POM |
| Data-Driven Coverage | >= 50% | Tests using external data |
| Assertion Quality | 1 assertion per test | Static analysis |

### 15.3 Reporting Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│              MAP Test Automation Dashboard                   │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  Pass Rate   │  Coverage    │  Flaky Rate  │  Feedback     │
│   99.2%      │   82.5%      │   0.0%       │   12 min      │
│   [GREEN]    │   [GREEN]    │   [GREEN]    │   [GREEN]     │
├──────────────┴──────────────┴──────────────┴───────────────┤
│                                                             │
│  Test Execution Trend (Last 30 Days)                       │
│  ───────────────────────────────────────                    │
│  [Line chart showing pass rate, coverage, and flaky rate]  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Coverage by Module                                        │
│  ─────────────────                                         │
│  Migration Core      ████████████████░░░░  85%             │
│  Data Validation     █████████████████░░░  82%             │
│  API Layer           ███████████████████░  95%             │
│  Dashboard           ████████████████░░░░  78%             │
│  Authentication      ██████████████████░░  90%             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Recent Test Failures                                      │
│  ───────────────────                                       │
│  [List of recent failures with timestamps and details]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 16. Dependencies and References

### 16.1 Batch 11 - Development Standards

| Document | Reference | Relationship |
|----------|-----------|-------------|
| Testing Standards | `11_Development_Standards/11_Testing_Standards.md` | Foundation for test coverage targets and tool selection |
| Python Standards | `11_Development_Standards/05_Python_Standards.md` | Python code style and typing requirements for test code |
| .NET Standards | `11_Development_Standards/06_DotNet_Standards.md` | .NET unit test framework requirements |
| Code Quality | `11_Development_Standards/16_Code_Quality_Standards.md` | Quality gates enforced in CI pipeline |
| DevOps Standards | `11_Development_Standards/15_DevOps_Standards.md` | CI/CD pipeline patterns and deployment gates |
| API Standards | `11_Development_Standards/09_API_Standards.md` | API contract testing requirements |
| Security Coding | `11_Development_Standards/14_Security_Coding_Standards.md` | Security testing integration requirements |
| Repository Structure | `11_Development_Standards/02_Repository_Structure.md` | Test directory layout and file organisation |

### 16.2 Batch 12 - AI Standards

| Document | Reference | Relationship |
|----------|-----------|-------------|
| AI Testing Standards | `12_AI_Assisted_Development/07_AI_Testing_Standards.md` | AI code testing requirements; AI-generated test validation |
| AI Code Review | `12_AI_Assisted_Development/06_AI_Code_Review_Standards.md` | Review standards for AI-generated test code |
| AI Quality Assurance | `12_AI_Assisted_Development/11_AI_Quality_Assurance.md` | AI quality gates and validation requirements |
| AI Coding Standards | `12_AI_Assisted_Development/05_AI_Coding_Standards.md` | Coding standards for AI-generated test code |
| AI Governance | `12_AI_Assisted_Development/10_AI_Governance.md` | Governance model for AI-assisted test automation |

### 16.3 Testing Framework Documents

| Document | Reference | Relationship |
|----------|-----------|-------------|
| Quality Assurance Strategy | `13_Testing_QA_UAT_Framework/01_Quality_Assurance_Strategy.md` | Overall QA strategy that automation supports |
| Testing Strategy | `13_Testing_QA_UAT_Framework/02_Testing_Strategy.md` | Test lifecycle and entry/exit criteria |
| Test Planning Framework | `13_Testing_QA_UAT_Framework/03_Test_Planning_Framework.md` | Test planning and estimation |
| Unit Testing Standards | `13_Testing_QA_UAT_Framework/04_Unit_Testing_Standards.md` | Unit test standards automation builds upon |
| Integration Testing Standards | `13_Testing_QA_UAT_Framework/05_Integration_Testing_Standards.md` | Integration test automation requirements |
| System Testing Framework | `13_Testing_QA_UAT_Framework/06_System_Testing_Framework.md` | System test automation scope |
| UAT Framework | `13_Testing_QA_UAT_Framework/07_UAT_Framework.md` | UAT handoff process from automated suites |

### 16.4 External Standards and References

| Standard | Reference | Application |
|----------|-----------|-------------|
| ISTQB Automation | ISTQB Test Automation Engineer Syllabus | Framework design principles |
| OWASP Testing Guide | owasp.org/www-project-testing | Security test automation |
| WCAG 2.1 | w3.org/TR/WCAG21 | Accessibility test automation |
| ISO 25010 | ISO/IEC 25010:2023 | Software quality model |
| Azure DevOps | learn.microsoft.com/azure/devops | Pipeline configuration |

---

## 17. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 01 Jul 2026 | Quality Engineering Team | Initial draft |
| 0.2 | 01 Jul 2026 | Quality Engineering Team | Added CI/CD pipeline configurations |
| 0.3 | 02 Jul 2026 | Quality Engineering Team | Added code examples and tool comparison |
| 0.4 | 02 Jul 2026 | Quality Engineering Team | Incorporated Batch 11 and Batch 12 references |
| 0.5 | 02 Jul 2026 | Quality Engineering Team | Added maintenance strategy and debt management |
| 1.0 | 02 Jul 2026 | MAP Architecture Review Board | Approved as Official |

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Quality Engineering Lead | _________________ | ____/____/2026 | _________________ |
| Technical Architect | _________________ | ____/____/2026 | _________________ |
| QA Lead | _________________ | ____/____/2026 | _________________ |
| DevOps Lead | _________________ | ____/____/2026 | _________________ |
| Programme Manager | _________________ | ____/____/2026 | _________________ |

---

**Document Classification:** Internal / Confidential

**Distribution:** MAP Engineering Team, Quality Assurance Team, DevOps Team, Programme Management

**Review Schedule:** Quarterly (next review: October 2026)

---

*End of Document*
