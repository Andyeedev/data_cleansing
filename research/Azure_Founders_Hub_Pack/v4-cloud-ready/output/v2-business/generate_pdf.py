#!/usr/bin/env python3
"""
Generate a professional PDF document combining 17 markdown files into a single
master document for the Microsoft Founders Hub Application Pack.

Business Summary Version - Phase 1.2-1.5 summarized for non-technical audience.
"""

import os
import re
from fpdf import FPDF

# === Configuration ===
SOURCE_DIR = r"C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready"
OUTPUT_PATH = r"C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready\output\v2-business\FS_Migration_Validation_Engine_Founders_Hub_Master.pdf"

# Colors
DARK_BLUE = (0, 51, 102)
DARK_GRAY = (51, 51, 51)
LIGHT_GRAY_BG = (240, 240, 240)
TABLE_HEADER_BG = (0, 51, 102)
TABLE_ALT_ROW = (245, 248, 252)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Document order
DOCUMENT_ORDER = [
    ("Phase 1 – Azure Founders Hub Pack.md", "Phase 1 - Azure Founders Hub Pack", False),
    ("Phase 1.1 Product Overview.md", "Phase 1.1 - Product Overview", False),
    ("Phase 1.2 Technical Architecture.md", "Phase 1.2 - Technical Architecture", True),
    ("Phase 1.3 – Platform Core Definition.md", "Phase 1.3 - Platform Core Definition", True),
    ("Phase 1.4 Azure Cloud Architecture.md", "Phase 1.4 - Azure Cloud Architecture", True),
    ("Phase 1.5 Azure Reference Architecture Diagram.md", "Phase 1.5 - Azure Reference Architecture Diagram", True),
    ("Phase 1.6 Azure Founders Hub Technical Narrative.md", "Phase 1.6 - Azure Founders Hub Technical Narrative", False),
    ("Phase 2.1 Executive Pitch Narrative.md", "Phase 2.1 - Executive Pitch Narrative", False),
    ("Phase 2.2 Investor Pitch Deck.md", "Phase 2.2 - Investor Pitch Deck", False),
    ("Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md", "Phase 2.3 - Market Analysis", False),
    ("Phase 2.4 Business Model and Pricing Strategy.md", "Phase 2.4 - Business Model & Pricing Strategy", False),
    ("Phase 2.5 Go-to-Market Strategy and Financial Projections.md", "Phase 2.5 - Go-to-Market Strategy & Financial Projections", False),
    ("Phase 2.6 Financial Model and Funding Strategy.md", "Phase 2.6 - Financial Model & Funding Strategy", False),
    ("Phase 2.7 Competitive Differentiation.md", "Phase 2.7 - Competitive Differentiation", False),
    ("Phase 2.8 Product Roadmap.md", "Phase 2.8 - Product Roadmap", False),
    ("Phase 2.9 Investor FAQ.md", "Phase 2.9 - Investor FAQ", False),
    ("Phase 2.10 Demo Script.md", "Phase 2.10 - Demo Script", False),
]

# === Business Summaries for Phase 1.2-1.5 ===
BUSINESS_SUMMARIES = {
    "Phase 1.2 Technical Architecture.md": """# Phase 1.2 - Technical Architecture
**Business Summary**

## What the Platform Does

The FS Migration Validation Engine is an automated platform that ensures data moves accurately and completely from legacy financial systems to modern platforms. It connects to source and target databases, compares data across 10 structured validation checks, scores the migration quality, and produces audit-ready reports for regulatory review.

## Why Azure Is the Right Foundation

The platform is built on Microsoft Azure to leverage enterprise-grade managed services that financial institutions require. Azure Container Apps provides scalable, serverless compute that automatically adjusts to workload demands. Azure SQL Database delivers a managed, highly available database with built-in backups and threat detection. Azure Key Vault ensures all credentials and secrets are encrypted and isolated from source code. This managed-service approach reduces operational overhead while meeting the security and compliance standards of regulated Financial Services.

## Key Architectural Principles

The platform follows a modular, engine-based architecture where independent components (Discovery, Validation, Scoring, Governance) are coordinated through a central Platform Core. This design ensures that adding new validation controls or capabilities does not require re-architecting the system. Every validation execution is logged with timestamps and batch identifiers, creating a complete audit trail suitable for regulatory review. The platform is designed for horizontal scaling, allowing multiple validation workloads to run in parallel as customer demand grows.

## Microsoft Ecosystem Alignment

The architecture aligns with the Azure Well-Architected Framework across all five pillars: Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency. The platform uses Infrastructure as Code (Bicep/ARM templates), CI/CD pipelines with GitHub Actions, and is designed for future integration with Microsoft Entra ID for enterprise identity management. This creates a clear path to Azure Marketplace distribution and long-term engagement with the Microsoft cloud ecosystem.""",

    "Phase 1.3 – Platform Core Definition.md": """# Phase 1.3 - Platform Core Definition
**Business Summary**

## What the Platform Core Does

The Platform Core is the central coordination brain of the FS Migration Validation Engine. Rather than having each validation component communicate directly with every other component, the Platform Core acts as a single orchestration point that manages workflow sequencing, tracks execution state, enforces security, and ensures consistent configuration across all engines.

## Why This Architecture Matters

This hub-and-spoke design dramatically reduces complexity. Each engine (Discovery, Validation, Scoring, Governance) operates independently and communicates only through the Platform Core. This means new validation capabilities can be added without modifying existing components, failures in one engine do not cascade to others, and the entire system can be tested, deployed, and scaled more easily.

## Core Business Benefits

- **Centralised Governance** - Release gates, audit trails, and compliance controls are enforced consistently across all validation executions
- **Failure Isolation** - If one validation control encounters an error, it does not block or corrupt other controls
- **Deterministic Results** - The same input data always produces the same validation output, ensuring repeatability for regulatory review
- **Enterprise-Grade Security** - Authentication, authorisation, and audit logging are built into the core, not bolted on as afterthoughts

## Azure Service Mapping

The Platform Core maps naturally to Azure managed services: Azure Container Apps for compute, Azure API Management for API gateway, Microsoft Entra ID for identity, Azure Key Vault for secrets, Azure Monitor for observability, and Azure SQL Database for persistent storage. This alignment means the platform can leverage Azure's enterprise features while maintaining a clear migration path as customer scale increases.""",

    "Phase 1.4 Azure Cloud Architecture.md": """# Phase 1.4 - Azure Cloud Architecture
**Business Summary**

## Cloud-Native Design

The FS Migration Validation Engine is designed as an Azure-native, cloud-first solution. It leverages Microsoft's managed cloud services to maximise scalability, security, reliability, and operational efficiency for regulated Financial Services data migration validation. The architecture follows a Platform Core plus microservices model where independent domain engines are orchestrated through a central coordination layer.

## Core Azure Services

The platform uses Azure Container Apps for scalable, serverless compute with automatic scaling based on validation workload. Azure API Management provides a secure gateway with rate limiting, versioning, and authentication. Azure SQL Database delivers a managed relational database with high availability and automated backups. Azure Blob Storage provides cost-effective, encrypted storage for audit artifacts and reports. Azure Key Vault manages all secrets and credentials with no credentials stored in source code. Azure Monitor and Application Insights provide comprehensive observability across infrastructure and application performance.

## Security and Compliance

The platform follows a Zero Trust security model with Microsoft Entra ID for identity, private endpoints for all data services, encryption at rest and in transit, and continuous security assessment through Microsoft Defender for Cloud. Every validation execution is logged with batch identifiers and timestamps, creating audit evidence suitable for regulatory review.

## Scalability and Cost

Each platform component scales independently based on workload demand using Azure Container Apps autoscaling. The consumption-based pricing model ensures costs align with actual usage, with projected MVP costs of approximately 560 to 1,220 pounds per month. Enterprise deployments with high availability configurations range from 2,000 to 5,000 pounds per month. As customer adoption grows, Azure consumption scales linearly across compute, storage, identity, and monitoring services.

## Well-Architected Framework Alignment

The architecture aligns with all five pillars of the Azure Well-Architected Framework: Reliability through managed services with built-in redundancy; Security through Zero Trust architecture; Cost Optimization through consumption-based pricing and autoscaling; Operational Excellence through CI/CD and Infrastructure as Code; and Performance Efficiency through stateless design and independent engine scaling.""",

    "Phase 1.5 Azure Reference Architecture Diagram.md": """# Phase 1.5 - Azure Reference Architecture
**Business Summary**

## Architecture Overview

The FS Migration Validation Engine is built on an Azure-native reference architecture designed for enterprise-grade Financial Services deployments. The architecture consists of five distinct layers: Presentation, API, Platform Core, Domain Engines, and Data Storage, all supported by comprehensive monitoring and DevOps automation.

## Platform Layers

The Presentation layer provides CLI and REST API interfaces for developers, DevOps teams, and auditors. The API layer uses Azure API Management for secure gateway functions with rate limiting and versioning, with future integration of Microsoft Entra ID for enterprise authentication. The Platform Core, running on Azure Container Apps, handles workflow orchestration, configuration management, security enforcement, and state tracking. Domain engines for Discovery, Validation, Scoring, Governance, and Export operate independently and are each deployable and scalable on their own.

## Data and Storage

All operational data is stored in Azure SQL Database or PostgreSQL Flexible Server, providing managed, highly available storage with automated backups. Audit artifacts, reports, and logs are stored in Azure Blob Storage with tiered pricing for cost efficiency. All secrets, credentials, and encryption keys are managed through Azure Key Vault with no secrets stored in source code.

## Security Boundaries

The architecture implements multiple security boundaries: private endpoints for all data services, Microsoft Entra ID for identity and access management, TLS 1.2 encryption for all communications, and comprehensive audit logging for every execution. This multi-layered approach meets the security requirements of regulated Financial Services environments.

## Future Growth

The architecture is designed to support phased growth: Phase 2 adds AI-assisted mapping through Azure OpenAI and async processing via Azure Service Bus; Phase 3 introduces a web dashboard and multi-tenant SaaS capabilities; Phase 4 expands to partner integrations and Microsoft Fabric connectivity. Each phase leverages additional Azure services while maintaining the modular core architecture."""
}


class PDFDocument(FPDF):
    """Custom PDF class with headers and footers."""

    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)

    def header(self):
        if self.page_no() == 1:
            return  # No header on cover page
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(*DARK_BLUE)
        self.cell(0, 8, "FS Migration Validation Engine", align="L")
        self.cell(0, 8, "Microsoft Founders Hub Application", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*DARK_GRAY)
        self.cell(0, 10, str(self.page_no() - 1), align="C")


def read_markdown_file(filepath):
    """Read a markdown file and return its content."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def escape_text(text):
    """Escape special characters for fpdf."""
    # Replace common Unicode with ASCII equivalents
    replacements = {
        "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"',
        "\u2013": "-", "\u2014": "-", "\u2026": "...",
        "\u2192": "->", "\u2190": "<-",
        "\u2714": "[OK]", "\u2718": "[X]", "\u26a0": "[!]",
        "\u2705": "[OK]", "\u274c": "[X]",
        "\u2714\ufe0f": "[OK]", "\u26a0\ufe0f": "[!]",
        "\u2022": "-", "\u2023": "-", "\u25cf": "*",
        "\u25a0": "[ ]", "\u25b2": "^", "\u25bc": "v",
        "\u2191": "^", "\u2193": "v",
        "\u00a0": " ", "\u200b": "", "\u200c": "", "\u200d": "",
        "\ufeff": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove any remaining non-latin-1 characters
    result = []
    for ch in text:
        try:
            ch.encode("latin-1")
            result.append(ch)
        except UnicodeEncodeError:
            result.append("?")
    text = "".join(result)

    text = text.replace("\\", "\\\\")
    text = text.replace('"', '\\"')
    return text


def clean_markdown_formatting(text):
    """Remove markdown formatting for plain text output."""
    # Remove bold markers
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    # Remove italic markers
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    # Remove inline code
    text = re.sub(r'`(.+?)`', r'\1', text)
    # Remove links [text](url)
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
    # Remove emoji-style indicators
    text = re.sub(r'[\U0001F600-\U0001F9FF]', '', text)
    text = re.sub(r'[\U0001FA00-\U0001FA6F]', '', text)
    text = re.sub(r'[\U0001FA70-\U0001FAFF]', '', text)
    text = re.sub(r'[\U00002702-\U000027B0]', '', text)
    text = re.sub(r'[\U0001F300-\U0001F5FF]', '', text)
    text = re.sub(r'[\U0001F680-\U0001F6FF]', '', text)
    return text


def parse_table(lines):
    """Parse markdown table lines into headers and rows."""
    headers = []
    rows = []
    for i, line in enumerate(lines):
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if i == 0:
            headers = cells
        elif all(set(c.strip()) <= set("-: ") for c in cells):
            continue  # separator row
        else:
            rows.append(cells)
    return headers, rows


def draw_table(pdf, headers, rows, col_widths=None):
    """Draw a formatted table in the PDF."""
    if not headers:
        return

    num_cols = len(headers)
    available_width = pdf.w - 20  # margins
    if col_widths is None:
        col_widths = [available_width / num_cols] * num_cols

    # Adjust col_widths to fit
    total = sum(col_widths)
    if total > available_width:
        ratio = available_width / total
        col_widths = [w * ratio for w in col_widths]

    # Header row
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_fill_color(*TABLE_HEADER_BG)
    pdf.set_text_color(*WHITE)
    for i, h in enumerate(headers):
        w = col_widths[i] if i < len(col_widths) else col_widths[-1]
        pdf.cell(w, 7, escape_text(clean_markdown_formatting(h))[:50], border=1, fill=True, align="C")
    pdf.ln()

    # Data rows
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(*DARK_GRAY)
    for row_idx, row in enumerate(rows):
        if row_idx % 2 == 1:
            pdf.set_fill_color(*TABLE_ALT_ROW)
            fill = True
        else:
            pdf.set_fill_color(*WHITE)
            fill = True

        max_h = 7
        # Calculate row height
        cell_texts = []
        for i in range(num_cols):
            text = row[i] if i < len(row) else ""
            text = escape_text(clean_markdown_formatting(text))
            cell_texts.append(text)
            # Estimate lines needed
            w = col_widths[i] if i < len(col_widths) else col_widths[-1]
            lines = pdf.get_string_width(text) / (w - 2) + 1
            h = max(7, int(lines) * 5 + 2)
            max_h = max(max_h, h)

        # Check if we need a new page
        if pdf.get_y() + max_h > pdf.h - 25:
            pdf.add_page()
            # Re-draw header
            pdf.set_font("Helvetica", "B", 8)
            pdf.set_fill_color(*TABLE_HEADER_BG)
            pdf.set_text_color(*WHITE)
            for i, h in enumerate(headers):
                w = col_widths[i] if i < len(col_widths) else col_widths[-1]
                pdf.cell(w, 7, escape_text(clean_markdown_formatting(h))[:50], border=1, fill=True, align="C")
            pdf.ln()
            pdf.set_font("Helvetica", "", 8)
            pdf.set_text_color(*DARK_GRAY)
            if row_idx % 2 == 1:
                pdf.set_fill_color(*TABLE_ALT_ROW)
            else:
                pdf.set_fill_color(*WHITE)

        x_start = pdf.get_x()
        y_start = pdf.get_y()

        for i, text in enumerate(cell_texts):
            w = col_widths[i] if i < len(col_widths) else col_widths[-1]
            x = x_start + sum(col_widths[:i])
            pdf.set_xy(x, y_start)
            pdf.multi_cell(w, 5, text[:100], border=0, fill=fill, align="L")

        # Draw borders
        for i in range(num_cols):
            w = col_widths[i] if i < len(col_widths) else col_widths[-1]
            x = x_start + sum(col_widths[:i])
            pdf.rect(x, y_start, w, max_h)

        pdf.set_xy(x_start, y_start + max_h)

    pdf.ln(3)


def render_markdown_to_pdf(pdf, content, is_summarized=False):
    """Parse markdown and render to PDF."""
    lines = content.split("\n")
    i = 0
    in_code_block = False
    code_block_lines = []
    in_table = False
    table_lines = []
    title_rendered = False

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip empty lines (but handle table end)
        if not stripped:
            if in_table and table_lines:
                headers, rows = parse_table(table_lines)
                if headers:
                    num_cols = len(headers)
                    avail = pdf.w - 20
                    if num_cols <= 3:
                        cw = [avail / 3] * 3
                    elif num_cols <= 4:
                        cw = [avail / 4] * 4
                    elif num_cols <= 5:
                        cw = [avail / 5] * 5
                    else:
                        cw = [avail / num_cols] * num_cols
                    draw_table(pdf, headers, rows, cw)
                table_lines = []
                in_table = False
            i += 1
            continue

        # Code blocks
        if stripped.startswith("```"):
            if in_code_block:
                # End code block
                pdf.set_font("Courier", "", 8)
                pdf.set_fill_color(*LIGHT_GRAY_BG)
                pdf.set_text_color(*DARK_GRAY)
                code_text = "\n".join(code_block_lines)
                if code_text.strip():
                    # Draw background
                    y_start = pdf.get_y()
                    pdf.set_x(15)
                    # Calculate height
                    num_lines = len(code_block_lines)
                    block_h = max(10, num_lines * 4 + 6)

                    if pdf.get_y() + block_h > pdf.h - 25:
                        pdf.add_page()

                    pdf.set_fill_color(*LIGHT_GRAY_BG)
                    pdf.rect(12, pdf.get_y(), pdf.w - 24, block_h)
                    pdf.set_xy(15, pdf.get_y() + 3)
                    for cl in code_block_lines:
                        pdf.set_font("Courier", "", 8)
                        pdf.set_text_color(*DARK_GRAY)
                        pdf.cell(0, 4, escape_text(cl)[:120], new_x="LMARGIN", new_y="NEXT")
                        pdf.set_x(15)
                    pdf.ln(3)
                code_block_lines = []
                in_code_block = False
            else:
                in_code_block = True
                code_block_lines = []
            i += 1
            continue

        if in_code_block:
            code_block_lines.append(line.rstrip())
            i += 1
            continue

        # Tables
        if stripped.startswith("|") and "|" in stripped[1:]:
            in_table = True
            table_lines.append(stripped)
            i += 1
            continue
        elif in_table and table_lines:
            headers, rows = parse_table(table_lines)
            if headers:
                num_cols = len(headers)
                avail = pdf.w - 20
                if num_cols <= 3:
                    cw = [avail / 3] * 3
                elif num_cols <= 4:
                    cw = [avail / 4] * 4
                elif num_cols <= 5:
                    cw = [avail / 5] * 5
                else:
                    cw = [avail / num_cols] * num_cols
                draw_table(pdf, headers, rows, cw)
            table_lines = []
            in_table = False

        # Horizontal rules
        if stripped == "---" or stripped == "***" or stripped == "___":
            pdf.set_draw_color(*DARK_BLUE)
            pdf.set_line_width(0.5)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(3)
            i += 1
            continue

        # Headers
        if stripped.startswith("#"):
            match = re.match(r'^(#{1,6})\s+(.*)', stripped)
            if match:
                level = len(match.group(1))
                text = clean_markdown_formatting(match.group(2))
                text = escape_text(text)

                # Check if page break needed
                if pdf.get_y() > pdf.h - 40:
                    pdf.add_page()

                if level == 1 and not title_rendered:
                    # Section title
                    pdf.set_font("Helvetica", "B", 18)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.ln(5)
                    pdf.multi_cell(0, 10, text)
                    pdf.ln(3)
                    title_rendered = True
                elif level == 1:
                    pdf.set_font("Helvetica", "B", 16)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.ln(5)
                    pdf.multi_cell(0, 9, text)
                    pdf.ln(3)
                elif level == 2:
                    pdf.set_font("Helvetica", "B", 13)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.ln(3)
                    pdf.multi_cell(0, 8, text)
                    pdf.ln(2)
                elif level == 3:
                    pdf.set_font("Helvetica", "B", 11)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.ln(2)
                    pdf.multi_cell(0, 7, text)
                    pdf.ln(1)
                elif level == 4:
                    pdf.set_font("Helvetica", "B", 10)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.ln(1)
                    pdf.multi_cell(0, 6, text)
                    pdf.ln(1)
                else:
                    pdf.set_font("Helvetica", "B", 9)
                    pdf.set_text_color(*DARK_BLUE)
                    pdf.multi_cell(0, 6, text)
                    pdf.ln(1)
                i += 1
                continue

        # Blockquotes
        if stripped.startswith(">"):
            text = stripped.lstrip("> ").strip()
            text = clean_markdown_formatting(text)
            text = escape_text(text)
            pdf.set_font("Helvetica", "I", 10)
            pdf.set_text_color(80, 80, 80)
            pdf.set_x(20)
            pdf.multi_cell(pdf.w - 30, 6, text)
            pdf.ln(2)
            i += 1
            continue

        # Bullet points
        if stripped.startswith("- ") or stripped.startswith("* "):
            text = stripped[2:].strip()
            text = clean_markdown_formatting(text)
            text = escape_text(text)
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(*DARK_GRAY)
            pdf.set_x(15)
            pdf.cell(5, 6, chr(149), align="L")
            pdf.multi_cell(pdf.w - 25, 6, text)
            pdf.ln(1)
            i += 1
            continue

        # Numbered lists
        match = re.match(r'^(\d+)\.\s+(.*)', stripped)
        if match:
            num = match.group(1)
            text = clean_markdown_formatting(match.group(2))
            text = escape_text(text)
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(*DARK_GRAY)
            pdf.set_x(15)
            pdf.cell(8, 6, f"{num}.", align="R")
            pdf.multi_cell(pdf.w - 28, 6, text)
            pdf.ln(1)
            i += 1
            continue

        # Regular text
        text = clean_markdown_formatting(stripped)
        text = escape_text(text)
        if text:
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(*DARK_GRAY)
            pdf.multi_cell(0, 6, text)
            pdf.ln(2)

        i += 1

    # Handle any remaining table
    if in_table and table_lines:
        headers, rows = parse_table(table_lines)
        if headers:
            num_cols = len(headers)
            avail = pdf.w - 20
            cw = [avail / num_cols] * num_cols
            draw_table(pdf, headers, rows, cw)


def create_cover_page(pdf):
    """Create the cover page."""
    pdf.add_page()

    # Top decorative line
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1.5)
    pdf.line(30, 40, 180, 40)

    # Title
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_y(55)
    pdf.multi_cell(0, 14, "FS Migration Validation\nEngine", align="C")

    # Subtitle
    pdf.set_font("Helvetica", "", 16)
    pdf.set_text_color(*DARK_GRAY)
    pdf.ln(5)
    pdf.multi_cell(0, 10, "Microsoft Founders Hub\nApplication Pack", align="C")

    # Decorative line
    pdf.ln(10)
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(0.5)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())

    # Document info
    pdf.ln(15)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 10, "Business Summary Document", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(5)
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(*DARK_GRAY)
    pdf.cell(0, 8, "Version 2.0 - June 2026", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 128, 0)
    pdf.cell(0, 8, "Status: Ready for Review", align="C", new_x="LMARGIN", new_y="NEXT")

    # Bottom decorative line
    pdf.ln(30)
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1.5)
    pdf.line(30, pdf.get_y(), 180, pdf.get_y())

    # Confidentiality notice
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(100, 100, 100)
    pdf.multi_cell(0, 5, "This document contains confidential and proprietary information.\nPrepared for Microsoft Founders Hub application review.", align="C")


def create_toc(pdf):
    """Create table of contents."""
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 12, "Table of Contents", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(0.5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    toc_entries = [
        ("Phase 1 - Azure Founders Hub Pack", "Overview and executive summary"),
        ("Phase 1.1 - Product Overview", "Problem, solution, and business benefits"),
        ("Phase 1.2 - Technical Architecture", "Platform architecture and components (Business Summary)"),
        ("Phase 1.3 - Platform Core Definition", "Central orchestration layer (Business Summary)"),
        ("Phase 1.4 - Azure Cloud Architecture", "Azure services and deployment (Business Summary)"),
        ("Phase 1.5 - Azure Reference Architecture", "Architecture layers and scalability (Business Summary)"),
        ("Phase 1.6 - Azure Founders Hub Technical Narrative", "Complete technical and business narrative"),
        ("Phase 2.1 - Executive Pitch Narrative", "Investor and stakeholder pitch"),
        ("Phase 2.2 - Investor Pitch Deck", "Visual pitch materials"),
        ("Phase 2.3 - Market Analysis", "TAM/SAM/SOM and competitor landscape"),
        ("Phase 2.4 - Business Model & Pricing", "Revenue model and pricing tiers"),
        ("Phase 2.5 - Go-to-Market Strategy", "Market entry and financial projections"),
        ("Phase 2.6 - Financial Model & Funding", "Financial strategy and funding approach"),
        ("Phase 2.7 - Competitive Differentiation", "Market positioning and advantages"),
        ("Phase 2.8 - Product Roadmap", "Development phases and timeline"),
        ("Phase 2.9 - Investor FAQ", "Common investor questions and answers"),
        ("Phase 2.10 - Demo Script", "Product demonstration walkthrough"),
    ]

    for idx, (title, desc) in enumerate(toc_entries, 1):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*DARK_BLUE)
        pdf.cell(8, 7, f"{idx}.", align="R")
        pdf.cell(5, 7, "")
        pdf.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_x(23)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*DARK_GRAY)
        pdf.cell(0, 5, desc, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)


def main():
    """Main function to generate the PDF."""
    print("Starting PDF generation...")

    pdf = PDFDocument()
    pdf.set_title("FS Migration Validation Engine - Microsoft Founders Hub Application Pack")
    pdf.set_author("FS Migration Validation Engine")

    # 1. Cover Page
    print("Creating cover page...")
    create_cover_page(pdf)

    # 2. Table of Contents
    print("Creating table of contents...")
    create_toc(pdf)

    # 3. Process each document
    for filename, section_title, is_summarized in DOCUMENT_ORDER:
        filepath = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(filepath):
            print(f"WARNING: File not found: {filepath}")
            continue

        print(f"Processing: {filename} (summarized={is_summarized})")

        # Add page break for new section
        pdf.add_page()

        if is_summarized and filename in BUSINESS_SUMMARIES:
            content = BUSINESS_SUMMARIES[filename]
        else:
            content = read_markdown_file(filepath)

        render_markdown_to_pdf(pdf, content, is_summarized)

    # 4. Save the PDF
    print(f"\nSaving PDF to: {OUTPUT_PATH}")
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    pdf.output(OUTPUT_PATH)
    print(f"PDF generated successfully: {OUTPUT_PATH}")
    print(f"Total pages: {pdf.page_no()}")


if __name__ == "__main__":
    main()
