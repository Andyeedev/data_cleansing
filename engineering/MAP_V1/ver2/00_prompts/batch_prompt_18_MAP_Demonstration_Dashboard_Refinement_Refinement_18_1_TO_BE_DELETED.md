
File locations: 

1) prompt 18 Executive Dashboard HTML - research\Packaging_our_Company\ver2\00_prompts\batch_prompt_18_MAP_Demonstration_Dashboard_Refinement_Refinement_18_1.md

2) output  - research\Packaging_our_Company\ver2\02_output


Objective

In addition to the existing JSON, Markdown, and analysis outputs, automatically generate a fully interactive demonstration portal that visualises all dashboard data produced by MAP.

The purpose is to:

Demonstrate MAP visually before the production UI is available.
Produce professional screenshots for Microsoft Founders Hub, investors, website, and marketing.
Validate dashboard design for the future MAP Portal.
Provide an executive demonstration environment driven by real MAP execution results.
Generate

Create the following folder:

dashboard_preview/

    index.html

    css/
        style.css

    js/
        dashboard.js

    data/
        *.json

    assets/

    screenshots/
Requirements

The dashboard shall:

Read all dashboard JSON files automatically.
Operate entirely offline.
Require no web server.
Require no Node.js.
Require no build tools.
Open directly by double-clicking index.html.

Use only:

HTML5
CSS3
JavaScript (ES6)
Chart.js
Microsoft Fluent-inspired styling
Include

Generate executive visualisations including:

Executive Dashboard
Migration Overview
Validation Results
Risk Dashboard
Data Quality Dashboard
Issue Summary
Readiness Score
Migration Progress
KPI Cards
Charts
Tables
Executive Recommendations
Screenshot Generation

Automatically create PNG screenshots for each dashboard:

screenshots/

dashboard_home.png

dashboard_validation.png

dashboard_quality.png

dashboard_risk.png

dashboard_progress.png

These screenshots should be suitable for:

Microsoft Founders Hub
Investor presentations
Website
Marketing collateral
Design Principles

The dashboard should resemble the future MAP Portal rather than a generic reporting application.

Use:

MAP branding
Microsoft Fluent design language
Azure colour palette
Executive-style layout
Responsive design
Professional typography

Avoid:

Developer tools
Debug information
Technical implementation details
Placeholder charts
Future Compatibility

The HTML demonstration portal should act as the prototype for the future MAP Portal frontend.

All visualisations must be driven from the generated JSON so that future React or Blazor frontends can reuse the same data contracts.