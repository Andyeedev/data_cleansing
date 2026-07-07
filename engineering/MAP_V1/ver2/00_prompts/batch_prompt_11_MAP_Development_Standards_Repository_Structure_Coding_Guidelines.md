
File locations: 

1) prompt 09 Build Specification - research\Packaging_our_Company\ver2\00_prompts\batch_prompt_11_MAP_Development_Standards_Repository_Structure_Coding_Guidelines.md

2) output  - research\Packaging_our_Company\ver2\02_output


# Batch 11 — Development Standards, Repository Structure & Coding Guidelines

## Objective

Create the official MAP Engineering Standards and Development Handbook.

This batch establishes the complete software engineering standards that govern how MAP is designed, built, tested, reviewed, deployed and maintained.

The documentation should ensure consistency across all future contributors, including software developers, DevOps engineers, architects and AI coding assistants.

This batch becomes the authoritative Engineering Standards reference for the MAP platform.

---

# Source Material

Use ALL previously completed batches.

Priority:

Batch 10 – UX/UI Design System & Screen Wireframes

Batch 09 – MVP Build Specification & Sprint Planning

Batch 08 – MVP Technical Architecture

Batch 07 – Corporate Identity

Batch 06 – Brand Kit

Batch 05 – Logo

Batch 04 – Microsoft Founders Hub

Batch 03 – Website (Detailed)

Batch 03 – Website (Simplified)

Batch 02 – MVP Planning

Batch 01 – Delivery Planning

Also use:

00_Master_Repository

Business Repository

Architecture Repository

Brand Repository

Product Repository

---

# Objectives

Produce enterprise-grade engineering standards suitable for:

• Commercial SaaS software

• Enterprise customers

• Cloud-native deployment

• AI-assisted software development

• Multi-developer teams

• Long-term maintainability

---

# Deliverables

---

01 Engineering Handbook

Development philosophy

Engineering principles

Software craftsmanship

Architecture philosophy

Development lifecycle

Decision-making principles

---

02 Repository Structure

Define the complete Git repository structure.

Include:

src/

tests/

docs/

infra/

scripts/

database/

api/

frontend/

backend/

shared/

ai/

pipelines/

.github/

examples/

tools/

assets/

configuration/

Explain the purpose of every folder.

Recommend naming conventions.

---

03 Solution Structure

Define the recommended solution layout.

Include examples for:

Python

.NET

React

Microservices

Shared libraries

Database projects

Infrastructure

Testing

Documentation

---

04 Coding Standards

General coding principles

Naming conventions

Comments

Documentation

Formatting

File naming

Folder naming

Namespaces

Dependency management

Configuration management

Secrets

Logging

Error handling

---

05 Python Standards

Recommended Python versions

Project structure

Package management

Virtual environments

Type hints

Docstrings

Linting

Formatting

Testing

Dependency management

Best practices

Recommended libraries

Top five recommended frameworks

When each should be used

Advantages

Trade-offs

---

06 .NET Standards

Recommended .NET versions

Solution structure

Projects

Naming

Configuration

Dependency Injection

Minimal APIs

Clean Architecture

Recommended libraries

Top five frameworks

Advantages

Trade-offs

---

07 Frontend Standards

React

Next.js

TypeScript

Tailwind

State management

Forms

Validation

Accessibility

Component design

Recommended libraries

Top five frontend frameworks

When each is appropriate

Trade-offs

---

08 Database Standards

Evaluate and compare major database platforms.

Include at least:

PostgreSQL

Azure SQL

SQL Server

MySQL

Cosmos DB

SQLite

Redis

For each include:

Best use cases

Advantages

Disadvantages

Licensing

Scalability

Cloud portability

Cost considerations

Enterprise suitability

Recommendation for MAP

Explain why PostgreSQL remains one of the preferred options for MAP while Azure SQL provides excellent integration within Azure.

---

09 API Standards

REST conventions

Versioning

Authentication

Pagination

Filtering

Sorting

Validation

Error handling

OpenAPI

Swagger

Rate limiting

Idempotency

---

10 Git Standards

Branch strategy

Commit conventions

Pull Requests

Code Reviews

Merge policies

Release branches

Hotfixes

Semantic Versioning

Git tags

GitHub workflows

---

11 Testing Standards

Unit testing

Integration testing

UI testing

API testing

Performance testing

Security testing

Coverage targets

Test naming

Mocking

Fixtures

Automation

---

12 Documentation Standards

Markdown rules

Architecture documents

Code documentation

README structure

Decision records

API documentation

Developer guides

Release notes

---

13 AI Development Standards

How AI assistants should contribute.

Include:

Prompt engineering

Context management

Code review expectations

Verification

Security

Human approval

Limitations

Responsible AI usage

---

14 Security Coding Standards

Secure coding

OWASP

Secrets

Encryption

Authentication

Authorisation

Input validation

Logging

Dependency scanning

Static analysis

---

15 DevOps Standards

Infrastructure as Code

CI/CD

Build pipelines

Release pipelines

Monitoring

Rollback

Environment management

Secrets

Containerisation

---

16 Code Quality Standards

Linting

Formatting

Complexity

Maintainability

Performance

Reliability

Accessibility

Technical debt

Quality gates

---

17 Development Workflow

Planning

Design

Build

Review

Test

Deploy

Operate

Improve

Developer lifecycle

---

18 Engineering Decision Matrix

When to choose:

Python

.NET

PostgreSQL

Azure SQL

React

Next.js

Redis

Containers

Serverless

Microservices

Modular monolith

Explain decision criteria.

---

19 Recommended Technology Catalogue

Provide balanced comparisons.

Do not recommend Azure technologies solely because MAP targets Microsoft Founders Hub.

Evaluate technologies objectively.

For every category include:

Top five recommendations

Strengths

Weaknesses

Ideal use cases

Cloud portability

Enterprise suitability

Learning curve

Long-term viability

---

20 Engineering Roadmap

How engineering standards evolve.

Version 1

Version 2

Version 3

Future governance

---

# Output Structure

Generate:

02_output/

11_Development_Standards/

---

# Automatic Master Repository Publishing

Publish into:

00_Master_Repository

---

04_Architecture

Add:

29_Engineering_Handbook.md

30_Solution_Structure.md

31_API_Standards.md

32_Database_Standards.md

33_Development_Workflow.md

34_Engineering_Decision_Matrix.md

35_Engineering_Roadmap.md

---

07_Standards

Add:

01_Repository_Structure.md

02_Coding_Standards.md

03_Python_Standards.md

04_DotNet_Standards.md

05_Frontend_Standards.md

06_Git_Standards.md

07_Testing_Standards.md

08_Documentation_Standards.md

09_AI_Development_Standards.md

10_Security_Coding_Standards.md

11_DevOps_Standards.md

12_Code_Quality_Standards.md

13_Recommended_Technology_Catalogue.md

---

# Repository Maintenance

When publishing:

• Automatically maintain sequential numbering inside each Master Repository folder.

• Preserve logical ordering.

• Rename files where required.

• Remove duplicate numbering.

• Replace previous versions.

• Preserve original Batch outputs unchanged.

---

# Documentation Standards

Every document shall contain:

Title

Purpose

Version

Status

Dependencies

References

Revision History

Owner

Related Documents

---

# Quality Requirements

The output should be suitable for:

Enterprise Software Engineers

Software Architects

Solution Architects

DevOps Engineers

Security Engineers

AI Coding Assistants

Technical Leads

Engineering Managers

The documentation should become the official engineering handbook governing all future MAP software development.

Technology recommendations must remain balanced, objective and cloud-portable where practical.

Where Azure-specific recommendations are made, always explain equivalent alternatives for AWS, Google Cloud and on-premises deployments where appropriate.