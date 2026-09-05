# MAP Nexus Enterprise Platform — Enterprise Discovery and AI Mapping Architecture

**Document ID:** 23
**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft — Pending Review
**Classification:** Architecture Standard

---

## 1. Goal

Document the **Enterprise Discovery and AI Mapping architecture** for the MAP Nexus™ platform. Establish the architecture for automated source-to-target database discovery, schema discovery, relationship analysis, and AI-assisted semantic matching.

### 1.1 Purpose

Address critical gaps in the current system:
- Missing automated mapping engine
- No primary key discovery
- Incomplete foreign key detection
- No semantic matching/AI capabilities
- Limited database provider independence
- Absence of confidence scoring

### 1.2 Scope

This document defines:
- Architecture components for discovery engines
- AI integration and semantic matching
- Governance and workflow frameworks
- Integration with existing MAP architecture (Docs 16, 21, 22)
- Technical standards and architectural principles

| Component | Element | Description |
|-----------|---------|-------------|
| **Discovery Engine Layer** | Core discovery functionality | Database, schema, table, column discovery |
| **AI/Machine Learning Layer** | Intelligent matching | Semantic matching, classification, prediction |
| **Governance Layer** | Business rules | Approvals, validation, compliance |
| **Integration Layer** | Interface definitions | Connection to existing MAP components |

### 1.3 Architecture Constraints

- Architecture-only documentation
- No implementation details
- No redesign of existing components
- Follows existing MAP architectural patterns and conventions

### 1.4 Deliverable

Establish a comprehensive discovery architecture that:
- Addresses all identified gaps in the current system
- Provides clear pathways for future implementation
- Integrates seamlessly with existing MAP architecture
- Maintains architectural consistency across the enterprise

---

## 2. Context

### 2.anship Previous Effort Limitations

The current MAP v1.9 system exhibits significant discovery limitations:

1. **Missing Automated Mapping:** Legacy `app/mapping_engine/` directory is empty
2. **No Fuzzy Matching:** Missing `difflib.SequenceMatcher` and semantic matching capabilities
3. **No Primary Key Discovery:** Critical gap in constraint discovery
4. **Limited Foreign Key Detection:** Exists only for rule inference
5. **Restricted Database Support:** Primarily PostgreSQL-compatible only
6. **No Confidence Scoring:** Inability to assess discovery quality

**Key Findings:**

**Evidence Sources:**

### 2.3 Discovery Limitations and Their Impact

- **Primary Key Discovery:** Critical gap affecting data completeness and relationship identification
- **Semantic Matching:** Missing capability for intelligent schema matching
- **Database Provider Support:** Limited to specific database dialects
- **Confidence Scoring:** No capability to assess discovery results
- **Automated Mapping:** Complete absence of automated mapping generation

### 2.4 Architecture Problems Summary

| Problem | Component | Impact | Risk |
|---------|-----------|--------|------| |
| Missing Automated Mapping | `app/mapping_engine/` | Complete discovery failure | Critical |
| No Semantic Matching | `difflib.SequenceMatcher` | Inability to find structural similarities | High |
| No Primary Key Discovery | Constraint discovery | Broken relationship modeling | High |
| Limited DB Support | Database detection | Compatibility issues | Medium |

---

## 3. Documentation Approach

This architecture document establishes the foundation for discovery capabilities by defining:
- Core architecture components
- Technical standards and patterns
- Integration points with existing MAP components
- Governance frameworks
- Deployment and security considerations

The document follows the established MAP architecture documentation conventions and integrates seamlessly with existing enterprise architecture documents.

---

## 4. Core Architecture Components

### 4.1 Discovery Engine Layer

#### 4.1.1 Discovery Registry

**Purpose:** Centralized repository for all discovered metadata:

| Registry Item | Purpose |\n|---------------|---------|\n| SchemaRegistry | Database schema definitions with provider support |\n| TableRegistry | Table metadata including size, usage, compatibility |\n| ColumnRegistry | Column metadata with inferred roles and data types |\n| ConstraintRegistry | Primary key, foreign key, and unique constraint definitions |\n| RelationshipRegistry | Inter-schema and intra-schema relationships |\n| DiscoveryMetadata | Timestamps, confidence scores, discovery source |

#### 4.1.2 Discovery Services

##### 4.1.2.1 Schema Discovery Service

**Purpose:** Extract and standardize database schema information from all supported providers:

- **Input:** Database connection parameters
- **Output:** Standardized schema metadata in registry format
- **Coverage:** All supported database types (PostgreSQL, MySQL, SQL Server, Oracle, Snowflake, BigQuery, Databricks)

##### 4.1.2.2 Table Discovery Service

**Purpose:** Discover tables and generate semantic signatures for matching:

- **Input:** Schema metadata
- **Output:** Structured table definitions with semantic signatures
- **Methods:** Structural matching, metadata analysis, statistical analysis

##### 4.1.2.3 Column Discovery Service

**Purpose:** Discover columns and classify semantic roles:

- **Input:** Table structure
- **Output:** Column metadata with inferred roles
- **Algorithms:** Heuristic rules based on naming, data types, context

##### 4.1.2.4 Relationship Discovery Service

**Purpose:** Identify and model relationships between schemas, tables, columns:

- **Input:** Column metadata, foreign key references
- **Output:** Graph-based relationship models
- **Types:** Foreign key, derived, semantic relationships

##### 4.1.2.5 Constraint Discovery Service

**Purpose:** Extract and validate all database constraints:

- **Input:** Database connection
- **Output:** Structured constraint metadata
- **Coverage:** Primary keys, foreign keys, unique, check, indexes

### 4.2 AI/Machine Learning Layer

#### 4.2.1 Semantic Matching Engine

**Purpose:** Apply intelligent matching algorithms to discover semantic similarities:

- **Algorithms:** String similarity, sequence matching, machine learning classifiers
- **Input:** Paired schema definitions
- **Output:** Ranked matches with confidence scores

#### 4.2.2 Column Role Classification

**Purpose:** Classify column semantic roles using supervised/unsupervised learning:

- **Classes:** Dimensions, Measures, Times, Identifiers, Documentation
- **Features:** Column name, data type, usage context
- **Output:** Role classification with confidence scores

#### 4.2.3 Schema Matching Engine

**Purpose:** Match entire schemas using hierarchical similarity analysis:

- **Approach:** Block-based and element-based matching
- **Integration:** With Table Discovery Service output
- **Output:** Schema similarity scores and candidates

### 4.3 Governance Layer

##### 4.3.1 Discovery Approval Workflow

**Process:** Human-in-the-loop validation:

1. Initial discovery completes
2. Confidence assessment
3. Review interface
4. Manual override
5. Documentation
6. Feedback loop

##### 4.3.2 Metadata Validation Framework

**Purpose:** Ensure discovered metadata meets MAP standards:

- Schema validation
- Content validation
- Integration validation

### 4.4 Integration Layer

**Key Integration Points:**

```\nDiscovery Results\n    ↓\nDiscovery_API_(app/api/v1/discovery/)\n    ↓\nDiscovery_Workflow_Service_(app/services/discovery_workflow.py)\n    ↓\nRegistration_to_Metadata_(app/scripts/discovery_to_metadata.py)\n    ↓\nConsumption_by_Frontend_(useDiscoveryResults.ts)\n```\n
---

## 5. Technical Architecture Requirements

### 5.1 Database Provider Support Matrix

| Provider | Connection Pattern | Discovery SQL | Confidence |\n|----------|-------------------|---------------|-----------|\n| PostgreSQL | `postgres://host:port/db` | Information schema queries | ✅ |\n| MySQL | `mysql://host:port/db` | `information_schema` with backticks | ✅ |\n| SQL Server | `jdbc:sqlserver://host:port;database` | `INFORMATION_SCHEMA` with square brackets | ⚠️ |\n| Oracle | `oracle://user/password@host:port/db` | `ALL_TAB_FILTERED` views | 🔶 |\n| Snowflake | `snowflake://user:pass@account/database` | `INFORMATION_SCHEMA` with ANSI | 🔶 |\n| BigQuery | `gcloud://project/dataset` | Information schema (REST API) | 🔶 |\n| Databricks | `spark://host:port` | Custom connectors | 🔶 |\n
### 5.2 Technical Standards

#### 5.2.1 Discovery Protocol

**Error Handling:** Graceful degradation:

- Retry logic with exponential backoff
- Fallback discovery methods
- Partial discovery status tracking
- System functionality preservation

#### 5.2.2 Data Privacy and Security

**Compliance:**

- Secure credential storage
- Data minimization (schema-level only)
- Complete audit trail
- Role-based access control

#### 5.2.3 Performance Considerations

**Scalability:**

- Parallel processing across databases
- Incremental discovery
- Caching mechanisms
- Configurable discovery complexity

### 5.3 Quality Gates

**Implementation Requirements:**

- Comprehensive unit testing
- End-to-end integration testing
- Performance testing across database providers
- Security testing
- User acceptance testing

---

## 6. Relationships with Existing Architecture

### 6.1 Integration with Doc 16

**Relationship:** Business capability alignment:

```\nDiscovery Results\n    ↓\nCapability Mapping\n    ↓\nDatabase Capability Coverage\n    ↓\nFrontend Generation Planning\n```\n
### 6.2 Integration with Doc 21

**Integration Points:**

| Discovery Component | Me21 Integration |\n|-------------------|------------------|\n| Schema Registry | Population of `core.schemas` |\n| Table Registry | Population of `core.datasets` |\n| Column Registry | Population of `core.columns` |\n| Constraint Registry | Population of `core.dataset_columns`, `core.column_mappings` |\n
### 6.3 Integration with Doc 22

**Navigation Impact:**\n
```\nDiscovery Results\n    ↓\nSchema Comprehension\n    ↓\nNavigation Item Generation\n    ↓\nDashboard and Portal Navigation\n```\n
---

## 7. Risk and Mitigation Strategies

### 7.1 Discovery Risks

**Risk Mitigation:**

- **Performance Issues:** Parallel processing, caching
- **Security Risks:** Access control, data protection
- **Integration Issues:** Comprehensive testing
- **Quality Issues:** Validation and verification

### 7.2 Security Considerations

**Security Requirements:**

- **Credential Management:** Secure storage and rotation
- **Access Control:** Role-based access
- **Audit Trail:** Complete logging of activities
- **Data Privacy:** Minimization of data collection

### 7.3 Deployment Considerations

**Deployment Strategy:**

- Incremental rollout with feature flags
- Testing across multiple database providers
- Performance optimization
- Documentation and support

---

## 建设 phase 8: Architecture Evolution

### 8.1 Phase 1: Foundation (Week 1-2)

**Development Focus:**

- Database provider abstraction layer
- Core discovery infrastructure
- Development environment setup

### 8.2 Phase 2: Enhanced Discovery (Week 3-4)

**Development Focus:**

- AI semantic matching capabilities
- Enhanced constraint discovery
- Advanced column classification

### 8.3 Phase 3: Production Readiness (Week 5-6)

**Development Focus:**

- Discovery quality validation
- Human approval workflow
- Integration with MAP architecture
- Performance optimization

---

## 9. Additional Architecture Considerations

### 9.1 Cross-references

| Document | Relationship |\n|----------|-------------|\n| Doc 16 — Enterprise Business Capability Model | Provides capability definitions to align with discovery results |\n| Doc 21 — Enterprise Runtime Metadata Contract | Defines metadata structure for discovered objects |\n| Doc 22 — Enterprise Navigation Contract | Enables navigation derivation from discovered schemas |\n| MAP v1.9 Current Architecture | Reference for compatibility and enhancements |\n
### 9.2 Implementation Notes

**Deployment Strategy:**

1. Development Environment: PostgreSQL for development
2. Testing Environment: Test databases
3. Production Environment: Production databases
4. Hybrid Discovery: Incremental rollout with feature flags

**Quality Assurance:**

- Unit Testing: Comprehensive unit tests
- Integration Testing: End-to-end workflows
- Performance Testing: Load testing across providers
- Security Testing: Penetration testing
- User Acceptance Testing: Human approval workflow

---

## 10. Version History

| Version | Date | Author | Changes |\n|---------|------|--------|---------|\n| 1.0 | 2026-07-20 | Architecture Team | Initial draft — defines discovery architecture |\n
---

**END OF DOCUMENT**
