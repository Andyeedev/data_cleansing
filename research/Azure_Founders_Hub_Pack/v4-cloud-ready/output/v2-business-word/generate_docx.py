#!/usr/bin/env python3
"""
Generate Business Word Document (.docx) for FS Migration Validation Engine
Microsoft Founders Hub Application Pack
Version 2.1 - With diagrams and PDF conversion
"""

import os
import sys
import time
import shutil
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

# ============================================================
# PATHS
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = os.path.join(BASE_DIR, "..", "..")
DIAGRAMS_DIR = os.path.join(BASE_DIR, "..", "diagrams")
OUTPUT_DOCX = os.path.join(BASE_DIR, "FS_Migration_Validation_Engine_Founders_Hub_Master_v2.docx")
OUTPUT_PDF = os.path.join(BASE_DIR, "FS_Migration_Validation_Engine_Founders_Hub_Master_v2.pdf")
TEMP_PATH = os.path.join(BASE_DIR, "_temp_output.docx")

# ============================================================
# DOCUMENT SETUP
# ============================================================
doc = Document()

# Set default font
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)
font.color.rgb = RGBColor(51, 51, 51)

# Set margins
for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

# ============================================================
# STYLE CONFIGURATION
# ============================================================
# Heading 1
h1_style = doc.styles['Heading 1']
h1_style.font.name = 'Calibri'
h1_style.font.size = Pt(18)
h1_style.font.bold = True
h1_style.font.color.rgb = RGBColor(0, 51, 102)
h1_style.paragraph_format.space_before = Pt(24)
h1_style.paragraph_format.space_after = Pt(12)

# Heading 2
h2_style = doc.styles['Heading 2']
h2_style.font.name = 'Calibri'
h2_style.font.size = Pt(14)
h2_style.font.bold = True
h2_style.font.color.rgb = RGBColor(0, 102, 178)
h2_style.paragraph_format.space_before = Pt(18)
h2_style.paragraph_format.space_after = Pt(8)

# Heading 3
h3_style = doc.styles['Heading 3']
h3_style.font.name = 'Calibri'
h3_style.font.size = Pt(12)
h3_style.font.bold = True
h3_style.font.color.rgb = RGBColor(51, 51, 51)
h3_style.paragraph_format.space_before = Pt(12)
h3_style.paragraph_format.space_after = Pt(6)

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def add_page_break():
    """Add a page break."""
    doc.add_page_break()


def add_horizontal_line():
    """Add a horizontal line with bottom border."""
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(
        '<w:pBdr {} >'
        '  <w:bottom w:val="single" w:sz="6" w:space="1" w:color="003366"/>'
        '</w:pBdr>'.format(nsdecls('w'))
    )
    pPr.append(pBdr)
    return p


def add_formatted_paragraph(text, bold=False, italic=False, size=Pt(11),
                            color=None, alignment=None, font_name='Calibri',
                            space_before=None, space_after=None):
    """Add a formatted paragraph."""
    p = doc.add_paragraph()
    if alignment:
        p.alignment = alignment
    run = p.add_run(text)
    run.font.name = font_name
    run.font.size = size
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = color
    if space_before:
        p.paragraph_format.space_before = space_before
    if space_after:
        p.paragraph_format.space_after = space_after
    return p


def add_image_with_caption(image_path, caption, width=Inches(5.5)):
    """Add an image with caption below it."""
    if os.path.exists(image_path):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run()
        run.add_picture(image_path, width=width)

        caption_para = doc.add_paragraph()
        caption_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        caption_run = caption_para.add_run(caption)
        caption_run.font.size = Pt(9)
        caption_run.font.italic = True
        caption_run.font.color.rgb = RGBColor(128, 128, 128)
    else:
        add_formatted_paragraph(f"[Diagram: {caption} - file not found]",
                                italic=True, color=RGBColor(128, 128, 128),
                                alignment=WD_ALIGN_PARAGRAPH.CENTER)


def add_table(headers, rows, col_widths=None):
    """Add a formatted table."""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Header row
    header_row = table.rows[0]
    for i, header in enumerate(headers):
        cell = header_row.cells[i]
        cell.text = ''
        p = cell.paragraphs[0]
        run = p.add_run(header)
        run.font.name = 'Calibri'
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        # Dark blue background
        shading = parse_xml(
            '<w:shd {} w:fill="003366"/>'.format(nsdecls('w'))
        )
        cell._tc.get_or_add_tcPr().append(shading)

    # Data rows
    for row_idx, row_data in enumerate(rows):
        row = table.rows[row_idx + 1]
        for col_idx, cell_text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.text = ''
            p = cell.paragraphs[0]
            run = p.add_run(str(cell_text))
            run.font.name = 'Calibri'
            run.font.size = Pt(10)
            # Alternating row colors
            if row_idx % 2 == 0:
                shading = parse_xml(
                    '<w:shd {} w:fill="EBF5FB"/>'.format(nsdecls('w'))
                )
                cell._tc.get_or_add_tcPr().append(shading)

    return table


def add_code_block(text):
    """Add a formatted code block with gray background."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)

    # Add background shading to paragraph
    pPr = p._p.get_or_add_pPr()
    shd = parse_xml(
        '<w:shd {} w:fill="F0F0F0" w:val="clear"/>'.format(nsdecls('w'))
    )
    pPr.append(shd)

    run = p.add_run(text)
    run.font.name = 'Courier New'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(51, 51, 51)
    return p


def add_bullet_point(text):
    """Add a bullet point paragraph."""
    p = doc.add_paragraph(text, style='List Bullet')
    for run in p.runs:
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
    return p


def add_numbered_item(text):
    """Add a numbered list item."""
    p = doc.add_paragraph(text, style='List Number')
    for run in p.runs:
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
    return p


def parse_inline_formatting(paragraph, text):
    """Parse bold, italic, and inline code in text and add runs."""
    import re
    # Pattern for **bold**, *italic*, `code`
    parts = re.split(r'(\*\*.*?\*\*|`[^`]+`|\*[^*]+\*)', text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            run = paragraph.add_run(part[2:-2])
            run.font.bold = True
        elif part.startswith('`') and part.endswith('`'):
            run = paragraph.add_run(part[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(0, 102, 178)
        elif part.startswith('*') and part.endswith('*') and not part.startswith('**'):
            run = paragraph.add_run(part[1:-1])
            run.font.italic = True
        else:
            run = paragraph.add_run(part)
    for run in paragraph.runs:
        if not run.font.name:
            run.font.name = 'Calibri'
        if not run.font.size:
            run.font.size = Pt(11)


def process_markdown_content(content, diagram_insertions=None):
    """Process markdown content and add to document."""
    lines = content.split('\n')
    in_code_block = False
    code_block_lines = []
    in_table = False
    table_rows = []
    table_headers = []
    figure_num = 1

    i = 0
    while i < len(lines):
        line = lines[i]

        # Code block handling
        if line.strip().startswith('```'):
            if in_code_block:
                # End code block
                code_text = '\n'.join(code_block_lines)
                if code_text.strip():
                    add_code_block(code_text)
                code_block_lines = []
                in_code_block = False
            else:
                # Start code block
                in_code_block = True
                code_block_lines = []
            i += 1
            continue

        if in_code_block:
            code_block_lines.append(line)
            i += 1
            continue

        # Table handling
        if line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_rows = []
                table_headers = []

            # Parse table row
            cells = [c.strip() for c in line.strip().split('|')[1:-1]]

            # Check if separator row
            if all(c.replace('-', '').replace(':', '').strip() == '' for c in cells):
                i += 1
                continue

            if not table_headers:
                table_headers = cells
            else:
                table_rows.append(cells)
            i += 1
            continue
        elif in_table:
            # End of table
            if table_headers and table_rows:
                add_table(table_headers, table_rows)
                doc.add_paragraph()  # Spacing after table
            in_table = False
            table_rows = []
            table_headers = []

        # Headings
        if line.startswith('# ') and not line.startswith('## '):
            heading_text = line[2:].strip()
            doc.add_heading(heading_text, level=1)
            i += 1
            continue
        elif line.startswith('## '):
            heading_text = line[3:].strip()
            doc.add_heading(heading_text, level=2)
            i += 1
            continue
        elif line.startswith('### '):
            heading_text = line[4:].strip()
            doc.add_heading(heading_text, level=3)
            i += 1
            continue

        # Horizontal line
        if line.strip() == '---':
            add_horizontal_line()
            i += 1
            continue

        # Bullet points
        if line.strip().startswith('- '):
            bullet_text = line.strip()[2:].strip()
            p = add_bullet_point('')
            parse_inline_formatting(p, bullet_text)
            i += 1
            continue

        # Numbered list items
        import re
        num_match = re.match(r'^(\d+)\.\s+(.+)', line.strip())
        if num_match:
            num_text = num_match.group(2)
            p = doc.add_paragraph(style='List Number')
            parse_inline_formatting(p, num_text)
            i += 1
            continue

        # Blockquote
        if line.strip().startswith('>'):
            quote_text = line.strip()[1:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(1)
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(quote_text)
            run.font.italic = True
            run.font.color.rgb = RGBColor(80, 80, 80)
            i += 1
            continue

        # Empty lines
        if line.strip() == '':
            i += 1
            continue

        # Normal paragraph
        p = doc.add_paragraph()
        parse_inline_formatting(p, line.strip())
        i += 1

    # Flush remaining table
    if in_table and table_headers and table_rows:
        add_table(table_headers, table_rows)


def read_markdown_file(filename):
    """Read a markdown file from the source directory."""
    filepath = os.path.join(SOURCE_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        print(f"WARNING: File not found: {filepath}")
        return ""


# ============================================================
# DOCUMENT CONTENT
# ============================================================

# ----------------------------------------------------------
# COVER PAGE
# ----------------------------------------------------------
print("Creating cover page...")

# Empty paragraphs for spacing
for _ in range(6):
    doc.add_paragraph()

# Title
title_para = doc.add_paragraph()
title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_run = title_para.add_run("FS Migration Validation Engine")
title_run.font.name = 'Calibri'
title_run.font.size = Pt(28)
title_run.font.bold = True
title_run.font.color.rgb = RGBColor(0, 51, 102)

doc.add_paragraph()

# Subtitle
subtitle_para = doc.add_paragraph()
subtitle_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle_run = subtitle_para.add_run("Microsoft Founders Hub Application Pack")
subtitle_run.font.name = 'Calibri'
subtitle_run.font.size = Pt(18)
subtitle_run.font.color.rgb = RGBColor(100, 100, 100)

doc.add_paragraph()

# Version
version_para = doc.add_paragraph()
version_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
version_run = version_para.add_run("Business Summary Document")
version_run.font.name = 'Calibri'
version_run.font.size = Pt(14)
version_run.font.color.rgb = RGBColor(100, 100, 100)

doc.add_paragraph()

# Date
date_para = doc.add_paragraph()
date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
date_run = date_para.add_run("Version 2.0 - June 2026")
date_run.font.name = 'Calibri'
date_run.font.size = Pt(12)
date_run.font.color.rgb = RGBColor(100, 100, 100)

doc.add_paragraph()

# Status
status_para = doc.add_paragraph()
status_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
status_run = status_para.add_run("Status: Ready for Review")
status_run.font.name = 'Calibri'
status_run.font.size = Pt(12)
status_run.font.color.rgb = RGBColor(100, 100, 100)

# Page break after cover
add_page_break()

# ----------------------------------------------------------
# HEADERS AND FOOTERS
# ----------------------------------------------------------
print("Setting up headers and footers...")

section = doc.sections[0]
header = section.header
header_para = header.paragraphs[0]
header_para.text = "FS Migration Validation Engine\t\tMicrosoft Founders Hub Application"
header_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
for run in header_para.runs:
    run.font.name = 'Calibri'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(100, 100, 100)

footer = section.footer
footer_para = footer.paragraphs[0]
footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
# Add page number field
run = footer_para.add_run()
fldChar1 = parse_xml('<w:fldChar {} w:fldCharType="begin"/>'.format(nsdecls('w')))
run._r.append(fldChar1)

run2 = footer_para.add_run()
instrText = parse_xml('<w:instrText {} xml:space="preserve"> PAGE </w:instrText>'.format(nsdecls('w')))
run2._r.append(instrText)

run3 = footer_para.add_run()
fldChar2 = parse_xml('<w:fldChar {} w:fldCharType="end"/>'.format(nsdecls('w')))
run3._r.append(fldChar2)

# ----------------------------------------------------------
# TABLE OF CONTENTS
# ----------------------------------------------------------
print("Creating Table of Contents...")

doc.add_heading('Table of Contents', level=1)
doc.add_paragraph()

toc_items = [
    ("Phase 1", "Azure Founders Hub Pack Overview"),
    ("Phase 1.1", "Product Overview"),
    ("Phase 1.2", "Platform Architecture (Summary)"),
    ("Phase 1.3", "Platform Core Definition (Summary)"),
    ("Phase 1.4", "Azure Cloud Architecture (Summary)"),
    ("Phase 1.5", "Reference Architecture (Summary)"),
    ("Phase 1.6", "Azure Founders Hub Technical Narrative"),
    ("Phase 2.1", "Executive Pitch Narrative"),
    ("Phase 2.2", "Investor Pitch Deck"),
    ("Phase 2.3", "Market Analysis TAM/SAM/SOM"),
    ("Phase 2.4", "Business Model & Pricing Strategy"),
    ("Phase 2.5", "Go-to-Market Strategy & Financial Projections"),
    ("Phase 2.6", "Financial Model & Funding Strategy"),
    ("Phase 2.7", "Competitive Differentiation"),
    ("Phase 2.8", "Product Roadmap"),
    ("Phase 2.9", "Investor FAQ"),
    ("Phase 2.10", "Demo Script"),
]

for phase, title in toc_items:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(f"{phase}\t\t{title}")
    run.font.name = 'Calibri'
    run.font.size = Pt(11)

add_page_break()

# ----------------------------------------------------------
# PHASE 1 - AZURE FOUNDERS HUB PACK OVERVIEW
# ----------------------------------------------------------
print("Processing Phase 1 - Overview...")

content = read_markdown_file("Phase 1 \u2013 Azure Founders Hub Pack.md")
process_markdown_content(content)

# Insert Azure Services diagram after "Why Azure" section if present
azure_services_img = os.path.join(DIAGRAMS_DIR, "azure_services.png")
if os.path.exists(azure_services_img):
    add_image_with_caption(azure_services_img,
                           "Figure 1: Azure Services Architecture Overview")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.1 - PRODUCT OVERVIEW
# ----------------------------------------------------------
print("Processing Phase 1.1 - Product Overview...")

content = read_markdown_file("Phase 1.1 Product Overview.md")
process_markdown_content(content)

# Insert how_it_works_flow.png after "How It Works"
how_it_works_img = os.path.join(DIAGRAMS_DIR, "how_it_works_flow.png")
if os.path.exists(how_it_works_img):
    add_image_with_caption(how_it_works_img,
                           "Figure 2: How It Works - Validation Workflow")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.2 - PLATFORM ARCHITECTURE (SUMMARIZED)
# ----------------------------------------------------------
print("Processing Phase 1.2 - Platform Architecture (Summary)...")

phase_1_2_summary = """# Phase 1.2 - Platform Architecture

## Overview

The FS Migration Validation Engine is built on a modular, cloud-native architecture with five core components working together through a centralised orchestration layer.

## Core Components

### 1. Discovery Engine
Automatically connects to source and target databases, extracts schema information, and builds a metadata repository for validation planning.

### 2. Validation Engine
Executes 10 structured migration controls (C01-C010) covering row counts, data types, keys, referential integrity, business rules, and regulatory compliance.

### 3. Scoring Engine
Produces objective, repeatable quality metrics. Each control receives a pass/fail score, and aggregate scoring provides overall migration quality assessment.

### 4. Governance Engine
Enforces release gates that block migrations below minimum quality thresholds. Maintains exception registers and audit trails for regulatory compliance.

### 5. Export Engine
Generates audit-ready CSV exports suitable for regulatory review and compliance reporting.

## Architecture Principles

- **Modularity** - Each engine operates independently
- **Centralised governance** - Release gates and audit enforced consistently
- **State management** - Batch tracking, checkpointing, and recovery
- **Security enforcement** - Authentication, authorisation, and audit logging
- **Failure isolation** - One control failure does not cascade to others

This architecture enables independent scaling, easier maintenance, and enterprise-grade reliability."""

process_markdown_content(phase_1_2_summary)

# Insert platform_architecture.png diagram
platform_arch_img = os.path.join(DIAGRAMS_DIR, "platform_architecture.png")
if os.path.exists(platform_arch_img):
    add_image_with_caption(platform_arch_img,
                           "Figure 3: Platform Architecture Overview")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.3 - PLATFORM CORE DEFINITION (SUMMARIZED)
# ----------------------------------------------------------
print("Processing Phase 1.3 - Platform Core (Summary)...")

phase_1_3_summary = """# Phase 1.3 - Platform Core

## Overview

The Platform Core is the central coordination layer that connects all engines. It acts as the single point of orchestration for the entire validation workflow.

## Key Responsibilities

### Workflow Orchestration
Coordinates execution between engines in the correct sequence: Discovery -> Validation -> Scoring -> Governance -> Export.

### Control Dependency Management
Manages the execution order of validation controls using a Directed Acyclic Graph (DAG). For example, C02 depends on C01, and C09 depends on C03.

### State Management
Tracks batch execution state, provides checkpointing capability, and enables recovery from failures.

### Configuration Management
Centralises all configuration through a single config.yaml file, ensuring consistency across all engines.

### Security Enforcement
Validates every request with authentication, authorisation, and comprehensive audit logging.

## Benefits

- **Loose coupling** - Engines communicate only through the Platform Core
- **Independent scaling** - Each engine can scale based on demand
- **Enterprise reliability** - Centralised governance and failure isolation"""

process_markdown_content(phase_1_3_summary)

# Insert control_dag.png diagram
control_dag_img = os.path.join(DIAGRAMS_DIR, "control_dag.png")
if os.path.exists(control_dag_img):
    add_image_with_caption(control_dag_img,
                           "Figure 4: Control Dependency DAG")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.4 - AZURE CLOUD ARCHITECTURE (SUMMARIZED)
# ----------------------------------------------------------
print("Processing Phase 1.4 - Azure Cloud Architecture (Summary)...")

phase_1_4_summary = """# Phase 1.4 - Azure Cloud Architecture

## Overview

The platform is designed as an Azure-native, cloud-first solution built on Microsoft's Well-Architected Framework. It leverages managed Azure services for scalability, security, and reliability.

## Azure Services Used

| Service | Purpose |
|---------|---------|
| **Azure Container Apps** | Scalable, serverless compute for the validation engine |
| **Azure SQL Database** | Managed relational database with high availability |
| **Azure Blob Storage** | Encrypted storage for audit reports and evidence |
| **Azure Key Vault** | Secure secrets and credentials management |
| **Microsoft Entra ID** | Enterprise identity and access management |
| **Azure Monitor** | Centralised logging and performance monitoring |
| **Azure API Management** | Secure API gateway with rate limiting |

## Well-Architected Framework Alignment

The platform aligns with all five pillars:

1. **Reliability** - Managed services with built-in redundancy and automatic failover
2. **Security** - Zero Trust architecture with private endpoints and encryption
3. **Cost Optimization** - Consumption-based pricing with autoscaling
4. **Operational Excellence** - CI/CD with GitHub Actions and Infrastructure as Code
5. **Performance Efficiency** - Stateless design with independent engine scaling

## Security Features

- Private endpoints for all data services
- TLS 1.2+ encryption for all communications
- Azure Key Vault for secrets management
- Full audit trail for every execution"""

process_markdown_content(phase_1_4_summary)

# Insert azure_architecture.png diagram
azure_arch_img = os.path.join(DIAGRAMS_DIR, "azure_architecture.png")
if os.path.exists(azure_arch_img):
    add_image_with_caption(azure_arch_img,
                           "Figure 5: Azure Architecture Overview")
    doc.add_paragraph()

# Insert five_pillars.png diagram
five_pillars_img = os.path.join(DIAGRAMS_DIR, "five_pillars.png")
if os.path.exists(five_pillars_img):
    add_image_with_caption(five_pillars_img,
                           "Figure 6: Well-Architected Framework Pillars")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.5 - REFERENCE ARCHITECTURE (SUMMARIZED)
# ----------------------------------------------------------
print("Processing Phase 1.5 - Reference Architecture (Summary)...")

phase_1_5_summary = """# Phase 1.5 - Reference Architecture

## Architecture Layers

The platform follows a layered architecture design:

### 1. Presentation Layer
- CLI Interface for command-line operations
- REST API for programmatic access
- Future Web Portal for interactive dashboard

### 2. API Security Layer
- Azure Front Door for global routing and WAF
- Azure API Management for gateway, rate limiting, versioning
- Microsoft Entra ID for authentication and authorisation

### 3. Platform Core Layer
- Workflow orchestration
- Control dependency management
- Configuration and state management
- Security enforcement

### 4. Domain Engine Layer
- Discovery Engine - Schema discovery and metadata extraction
- Validation Engine - 10 structured controls (C01-C010)
- Scoring Engine - Pass/fail and aggregate scoring
- Governance Engine - Release gates and exception register
- Export Engine - CSV audit export

### 5. Data Layer
- Azure SQL Database - Primary operational database
- Azure Blob Storage - Audit artifacts and reports
- Azure Key Vault - Secrets and credentials

### 6. Observability Layer
- Azure Monitor - Infrastructure metrics
- Application Insights - Application performance
- Custom dashboards - Migration quality visualisation

## Deployment Model

| Environment | Compute | Database |
|-------------|---------|----------|
| Development | Local Docker | Local PostgreSQL |
| Test | Azure Container Apps | Azure SQL (shared) |
| Production | Azure Container Apps / AKS | Azure SQL (HA) |"""

process_markdown_content(phase_1_5_summary)

# Insert architecture_evolution.png diagram
arch_evol_img = os.path.join(DIAGRAMS_DIR, "architecture_evolution.png")
if os.path.exists(arch_evol_img):
    add_image_with_caption(arch_evol_img,
                           "Figure 7: Architecture Evolution Path")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 1.6 - AZURE FOUNDERS HUB TECHNICAL NARRATIVE
# ----------------------------------------------------------
print("Processing Phase 1.6 - Technical Narrative...")

content = read_markdown_file("Phase 1.6 Azure Founders Hub Technical Narrative.md")
process_markdown_content(content)

# Insert cicd_pipeline.png diagram
cicd_img = os.path.join(DIAGRAMS_DIR, "cicd_pipeline.png")
if os.path.exists(cicd_img):
    add_image_with_caption(cicd_img,
                           "Figure 8: CI/CD Pipeline Architecture")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.1 - EXECUTIVE PITCH NARRATIVE
# ----------------------------------------------------------
print("Processing Phase 2.1 - Executive Pitch Narrative...")

content = read_markdown_file("Phase 2.1 Executive Pitch Narrative.md")
process_markdown_content(content)

# Insert executive_flow.png after solution section
executive_flow_img = os.path.join(DIAGRAMS_DIR, "executive_flow.png")
if os.path.exists(executive_flow_img):
    add_image_with_caption(executive_flow_img,
                           "Figure 9: Executive Solution Flow")
    doc.add_paragraph()

# Insert how_it_works_flow.png after "How It Works" section
how_it_works_img = os.path.join(DIAGRAMS_DIR, "how_it_works_flow.png")
if os.path.exists(how_it_works_img):
    add_image_with_caption(how_it_works_img,
                           "Figure 10: How It Works - Validation Workflow")
    doc.add_paragraph()

# Insert business_flow.png
business_flow_img = os.path.join(DIAGRAMS_DIR, "business_flow.png")
if os.path.exists(business_flow_img):
    add_image_with_caption(business_flow_img,
                           "Figure 11: Business Process Flow")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.2 - INVESTOR PITCH DECK
# ----------------------------------------------------------
print("Processing Phase 2.2 - Investor Pitch Deck...")

content = read_markdown_file("Phase 2.2 Investor Pitch Deck.md")
process_markdown_content(content)

add_page_break()

# ----------------------------------------------------------
# PHASE 2.3 - MARKET ANALYSIS TAM/SAM/SOM
# ----------------------------------------------------------
print("Processing Phase 2.3 - Market Analysis...")

content = read_markdown_file("Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md")
process_markdown_content(content)

# Insert tam_sam_som.png after SOM section
tam_sam_som_img = os.path.join(DIAGRAMS_DIR, "tam_sam_som.png")
if os.path.exists(tam_sam_som_img):
    add_image_with_caption(tam_sam_som_img,
                           "Figure 12: TAM / SAM / SOM Market Sizing")
    doc.add_paragraph()

# Insert competitive_positioning.png after Competitive Positioning
competitive_img = os.path.join(DIAGRAMS_DIR, "competitive_positioning.png")
if os.path.exists(competitive_img):
    add_image_with_caption(competitive_img,
                           "Figure 13: Competitive Positioning")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.4 - BUSINESS MODEL & PRICING STRATEGY
# ----------------------------------------------------------
print("Processing Phase 2.4 - Business Model & Pricing...")

content = read_markdown_file("Phase 2.4 Business Model and Pricing Strategy.md")
process_markdown_content(content)

# Insert pricing_tiers.png after pricing section
pricing_img = os.path.join(DIAGRAMS_DIR, "pricing_tiers.png")
if os.path.exists(pricing_img):
    add_image_with_caption(pricing_img,
                           "Figure 14: Pricing Tiers Overview")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.5 - GO-TO-MARKET STRATEGY & FINANCIAL PROJECTIONS
# ----------------------------------------------------------
print("Processing Phase 2.5 - Go-to-Market & Financial Projections...")

content = read_markdown_file("Phase 2.5 Go-to-Market Strategy and Financial Projections.md")
process_markdown_content(content)

# Insert channel_contribution.png after channels table
channel_img = os.path.join(DIAGRAMS_DIR, "channel_contribution.png")
if os.path.exists(channel_img):
    add_image_with_caption(channel_img,
                           "Figure 15: Channel Contribution by Year")
    doc.add_paragraph()

# Insert revenue_growth.png after revenue forecast
revenue_img = os.path.join(DIAGRAMS_DIR, "revenue_growth.png")
if os.path.exists(revenue_img):
    add_image_with_caption(revenue_img,
                           "Figure 16: Revenue Growth Projection")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.6 - FINANCIAL MODEL & FUNDING STRATEGY
# ----------------------------------------------------------
print("Processing Phase 2.6 - Financial Model & Funding...")

content = read_markdown_file("Phase 2.6 Financial Model and Funding Strategy.md")
process_markdown_content(content)

# Insert ebitda_trajectory.png after EBITDA table
ebitda_img = os.path.join(DIAGRAMS_DIR, "ebitda_trajectory.png")
if os.path.exists(ebitda_img):
    add_image_with_caption(ebitda_img,
                           "Figure 17: EBITDA Trajectory")
    doc.add_paragraph()

# Insert use_of_funds.png after use of funds section
use_of_funds_img = os.path.join(DIAGRAMS_DIR, "use_of_funds.png")
if os.path.exists(use_of_funds_img):
    add_image_with_caption(use_of_funds_img,
                           "Figure 18: Use of Funds Allocation")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.7 - COMPETITIVE DIFFERENTIATION
# ----------------------------------------------------------
print("Processing Phase 2.7 - Competitive Differentiation...")

content = read_markdown_file("Phase 2.7 Competitive Differentiation.md")
process_markdown_content(content)

# Insert feature_comparison.png after differentiation matrix
feature_img = os.path.join(DIAGRAMS_DIR, "feature_comparison.png")
if os.path.exists(feature_img):
    add_image_with_caption(feature_img,
                           "Figure 19: Feature Comparison Matrix")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.8 - PRODUCT ROADMAP
# ----------------------------------------------------------
print("Processing Phase 2.8 - Product Roadmap...")

content = read_markdown_file("Phase 2.8 Product Roadmap.md")
process_markdown_content(content)

# Insert product_roadmap.png after product evolution
roadmap_img = os.path.join(DIAGRAMS_DIR, "product_roadmap.png")
if os.path.exists(roadmap_img):
    add_image_with_caption(roadmap_img,
                           "Figure 20: Product Evolution Roadmap")
    doc.add_paragraph()

add_page_break()

# ----------------------------------------------------------
# PHASE 2.9 - INVESTOR FAQ
# ----------------------------------------------------------
print("Processing Phase 2.9 - Investor FAQ...")

content = read_markdown_file("Phase 2.9 Investor FAQ.md")
process_markdown_content(content)

add_page_break()

# ----------------------------------------------------------
# PHASE 2.10 - DEMO SCRIPT
# ----------------------------------------------------------
print("Processing Phase 2.10 - Demo Script...")

content = read_markdown_file("Phase 2.10 Demo Script.md")
process_markdown_content(content)

# ============================================================
# SAVE DOCUMENT
# ============================================================
print("\nSaving document...")

# Try saving directly first, fall back to temp file
try:
    doc.save(OUTPUT_DOCX)
except PermissionError:
    print("Direct save failed (file may be open), saving to temp file...")
    doc.save(TEMP_PATH)
    # Wait a moment and try to copy
    time.sleep(1)
    # Remove existing if any
    if os.path.exists(OUTPUT_DOCX):
        try:
            os.remove(OUTPUT_DOCX)
        except PermissionError:
            pass
    shutil.copy2(TEMP_PATH, OUTPUT_DOCX)
    try:
        os.remove(TEMP_PATH)
    except:
        pass

# Print confirmation
file_size = os.path.getsize(OUTPUT_DOCX)
if file_size > 1024 * 1024:
    size_str = f"{file_size / (1024 * 1024):.2f} MB"
else:
    size_str = f"{file_size / 1024:.2f} KB"

print(f"\n{'='*60}")
print(f"DOCX GENERATED SUCCESSFULLY")
print(f"{'='*60}")
print(f"Output: {OUTPUT_DOCX}")
print(f"Size:   {size_str}")
print(f"{'='*60}")

# ============================================================
# PDF CONVERSION
# ============================================================
print("\nAttempting PDF conversion...")

pdf_success = False

# Method 1: Try docx2pdf (requires Microsoft Word)
try:
    from docx2pdf import convert
    convert(OUTPUT_DOCX, OUTPUT_PDF)
    pdf_success = True
    pdf_size = os.path.getsize(OUTPUT_PDF)
    if pdf_size > 1024 * 1024:
        pdf_size_str = f"{pdf_size / (1024 * 1024):.2f} MB"
    else:
        pdf_size_str = f"{pdf_size / 1024:.2f} KB"
    print(f"\n{'='*60}")
    print(f"PDF GENERATED SUCCESSFULLY (via docx2pdf)")
    print(f"{'='*60}")
    print(f"Output: {OUTPUT_PDF}")
    print(f"Size:   {pdf_size_str}")
    print(f"{'='*60}")
except ImportError:
    print("docx2pdf not installed, trying alternative methods...")
except Exception as e:
    print(f"docx2pdf failed: {e}")
    print("Trying alternative methods...")

# Method 2: Try win32com (Windows only, requires Microsoft Word)
if not pdf_success:
    try:
        import win32com.client
        import pythoncom
        
        pythoncom.CoInitialize()
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        
        doc_path = os.path.abspath(OUTPUT_DOCX)
        pdf_path = os.path.abspath(OUTPUT_PDF)
        
        doc_obj = word.Documents.Open(doc_path)
        doc_obj.SaveAs(pdf_path, FileFormat=17)  # 17 = wdFormatPDF
        doc_obj.Close()
        word.Quit()
        
        pythoncom.CoUninitialize()
        
        pdf_success = True
        pdf_size = os.path.getsize(OUTPUT_PDF)
        if pdf_size > 1024 * 1024:
            pdf_size_str = f"{pdf_size / (1024 * 1024):.2f} MB"
        else:
            pdf_size_str = f"{pdf_size / 1024:.2f} KB"
        print(f"\n{'='*60}")
        print(f"PDF GENERATED SUCCESSFULLY (via win32com)")
        print(f"{'='*60}")
        print(f"Output: {OUTPUT_PDF}")
        print(f"Size:   {pdf_size_str}")
        print(f"{'='*60}")
    except ImportError:
        print("win32com not available")
    except Exception as e:
        print(f"win32com failed: {e}")

# Method 3: Try libreoffice (if available)
if not pdf_success:
    try:
        import subprocess
        result = subprocess.run(
            ["libreoffice", "--headless", "--convert-to", "pdf", OUTPUT_DOCX],
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0 and os.path.exists(OUTPUT_PDF):
            pdf_success = True
            pdf_size = os.path.getsize(OUTPUT_PDF)
            if pdf_size > 1024 * 1024:
                pdf_size_str = f"{pdf_size / (1024 * 1024):.2f} MB"
            else:
                pdf_size_str = f"{pdf_size / 1024:.2f} KB"
            print(f"\n{'='*60}")
            print(f"PDF GENERATED SUCCESSFULLY (via LibreOffice)")
            print(f"{'='*60}")
            print(f"Output: {OUTPUT_PDF}")
            print(f"Size:   {pdf_size_str}")
            print(f"{'='*60}")
    except FileNotFoundError:
        print("LibreOffice not found")
    except Exception as e:
        print(f"LibreOffice failed: {e}")

# Final status
if not pdf_success:
    print(f"\n{'='*60}")
    print(f"PDF CONVERSION UNAVAILABLE")
    print(f"{'='*60}")
    print("To generate PDF manually:")
    print("1. Open the .docx file in Microsoft Word")
    print("2. Go to File > Save As")
    print("3. Select PDF as the format")
    print("4. Click Save")
    print(f"{'='*60}")
