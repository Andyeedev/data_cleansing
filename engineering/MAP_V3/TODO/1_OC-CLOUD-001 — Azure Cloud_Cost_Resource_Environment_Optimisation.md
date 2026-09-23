Proposed work item

OC-CLOUD-001 — Azure Cloud Cost, Resource & Environment Optimisation

OpenCode should investigate:

Current Azure monthly spend — current month and previous month
Cost by resource/resource group/service
The 4 databases:
2 × SQL Server
2 × PostgreSQL
Compute/service tiers and whether they are oversized
Storage and backup costs
Resources running when not required
Public IPs, networking, disks, monitoring/logging and other ancillary costs
DEV/TEST resources that can be stopped, scaled down or deleted
Whether Azure serverless/auto-pause options are appropriate
Whether databases should exist permanently or be created only for E2E testing and destroyed afterwards
Current MAP Nexus Azure infrastructure requirements
Future MAP Nexus DB engine hosting cost
Free/low-cost Azure options where appropriate
Cost-control mechanisms such as budgets and alerts
Resource tagging and ownership
Security implications of cost-saving changes
Backup/recovery implications
What should remain running versus ephemeral

Most importantly, OpenCode should not change or delete anything during the assessment.

It should produce a cost baseline and recommendations first.