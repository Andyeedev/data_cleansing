## Generate_00_Arch_Prompt_24_Enterprise_Pre_Migration_Validation_Architecture.md

Purpose

# Create 24_Enterprise_Pre_Migration_Validation_Architecture.md defining the enterprise validation architecture across the entire migration lifecycle.

The document must define architecture only.

It should establish three validation modes:

Source Validation
Validate source data independently
Assess source readiness
Data quality
Completeness
Referential integrity
Profiling
Target Validation
Validate target systems independently
Configuration
Schema readiness
Environment readiness
Reference data
Migration Validation
Existing MAP reconciliation engine
Source vs Target comparison
Rule execution
Certification

Also define:

Shared Rule Engine
Shared Rule Registry
Shared Metadata
Rule applicability by validation mode
Reporting
Governance
Integration with Docs 16, 21 and 22
Cross references

The architecture must treat all three as first-class enterprise capabilities while avoiding duplication of rule logic.



---
# Required Deliverables

Produce a draft document.
# Working Output

Generate artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └──24_Enterprise_Pre_Migration_Validation_Architecture/(folder-based architecture)


---


# Production Promotion

Only promote to production after engineering review draft document:

to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └──24_Enterprise_Pre_Migration_Validation_Architecture/ (folder-based architecture)