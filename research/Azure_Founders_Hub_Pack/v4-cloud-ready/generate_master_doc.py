#!/usr/bin/env python3
"""
FS Migration Validation Engine - Business Master Document Generator
Generates professional Word document with diagrams, then converts to PDF.
"""

import os
import re
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle
import matplotlib.patheffects as pe
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
from docx2pdf import convert

# ============================================================================
# CONFIGURATION
# ============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = BASE_DIR
OUTPUT_DIR = os.path.join(BASE_DIR, "output", "v2-business-word")
DIAGRAMS_DIR = os.path.join(BASE_DIR, "output", "diagrams")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

# Colors
DARK_BLUE = (0/255, 51/255, 102/255)
MEDIUM_BLUE = (0/255, 102/255, 178/255)
LIGHT_BLUE = (220/255, 235/255, 250/255)
DARK_GRAY = (51/255, 51/255, 51/255)
CODE_BG = (240/255, 240/255, 240/255)
WHITE = (1, 1, 1)
AZURE_BLUE = (0/255, 120/255, 212/255)
GREEN = (46/255, 139/255, 87/255)
ORANGE = (255/255, 140/255, 0/255)
RED = (220/255, 53/255, 69/255)

# ============================================================================
# MARKDOWN FILES IN ORDER
# ============================================================================
PHASE_FILES = [
    ("Phase 1 – Azure Founders Hub Pack.md", "phase1"),
    ("Phase 1.1 Product Overview.md", "phase1_1"),
    ("Phase 1.2 Technical Architecture.md", "phase1_2"),
    ("Phase 1.3 – Platform Core Definition.md", "phase1_3"),
    ("Phase 1.4 Azure Cloud Architecture.md", "phase1_4"),
    ("Phase 1.5 Azure Reference Architecture Diagram.md", "phase1_5"),
    ("Phase 1.6 Azure Founders Hub Technical Narrative.md", "phase1_6"),
    ("Phase 2.1 Executive Pitch Narrative.md", "phase2_1"),
    ("Phase 2.2 Investor Pitch Deck.md", "phase2_2"),
    ("Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md", "phase2_3"),
    ("Phase 2.4 Business Model and Pricing Strategy.md", "phase2_4"),
    ("Phase 2.5 Go-to-Market Strategy and Financial Projections.md", "phase2_5"),
    ("Phase 2.6 Financial Model and Funding Strategy.md", "phase2_6"),
    ("Phase 2.7 Competitive Differentiation.md", "phase2_7"),
    ("Phase 2.8 Product Roadmap.md", "phase2_8"),
    ("Phase 2.9 Investor FAQ.md", "phase2_9"),
    ("Phase 2.10 Demo Script.md", "phase2_10"),
]

# Summarized content for Phase 1.2-1.5
SUMMARIES = {
    "phase1_2": """## Platform Architecture

The FS Migration Validation Engine is built on a modular, cloud-native architecture with five core components working together:

**1. Discovery Engine**
Automatically connects to source and target databases, extracts schema information, and builds a metadata repository for validation planning.

**2. Validation Engine**
Executes 10 structured migration controls (C01-C010) covering row counts, data types, keys, referential integrity, business rules, and regulatory compliance.

**3. Scoring Engine**
Produces objective, repeatable quality metrics. Each control receives a pass/fail score, and aggregate scoring provides overall migration quality assessment.

**4. Governance Engine**
Enforces release gates that block migrations below minimum quality thresholds. Maintains exception registers and audit trails for regulatory compliance.

**5. Export Engine**
Generates audit-ready CSV exports suitable for regulatory review and compliance reporting.

All engines are orchestrated through a centralised Platform Core that manages workflow, state, configuration, and security.""",

    "phase1_3": """## Platform Core - The Orchestration Layer

The Platform Core is the central coordination layer that connects all engines. It ensures:

- **Loose coupling** - Each engine operates independently
- **Centralised governance** - Release gates and audit enforced consistently
- **State management** - Batch tracking, checkpointing, and recovery
- **Security enforcement** - Authentication, authorisation, and audit logging
- **Failure isolation** - One control failure does not cascade to others

This architecture enables independent scaling, easier maintenance, and enterprise-grade reliability.""",

    "phase1_4": """## Azure Cloud Architecture

Built on Microsoft Azure using the Well-Architected Framework:

| Component | Azure Service | Benefit |
|-----------|---------------|---------|
| Compute | Azure Container Apps | Serverless, autoscaling |
| Database | Azure SQL Database | Managed, high availability |
| Storage | Azure Blob Storage | Encrypted audit reports |
| Security | Azure Key Vault | Secrets management |
| Identity | Microsoft Entra ID | Enterprise IAM |
| Monitoring | Azure Monitor | Observability |
| API Gateway | Azure API Management | Rate limiting, versioning |

The platform achieves enterprise-grade security, scalability, and reliability while maintaining cost efficiency through consumption-based pricing.""",

    "phase1_5": """## Azure Reference Architecture

The platform follows a layered architecture:

**Layer 1: Users/CLI/API**
Developers and systems interact through CLI tools, REST APIs, or CI/CD pipelines.

**Layer 2: Azure Front Door + API Management**
Handles security, routing, rate limiting, and API versioning.

**Layer 3: Platform Core (Azure Container Apps)**
Orchestrates all engines with serverless compute and autoscaling.

**Layer 4: Domain Engines**
Discovery, Validation, Scoring, Governance, and Export engines operate independently.

**Layer 5: Data Layer**
Azure SQL Database, Blob Storage, and Key Vault provide managed data services.

**Layer 6: Monitoring**
Azure Monitor and Application Insights provide full observability.

**Layer 7: CI/CD**
GitHub Actions and Azure DevOps enable automated deployment.

All data services use private endpoints. Security follows Zero Trust principles with encryption at rest and in transit.""",
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def read_markdown(file_path):
    """Read a markdown file and return its content."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()


def sanitize_text(text):
    """Replace problematic Unicode characters for Word compatibility."""
    replacements = {
        '\u2705': '[Yes]',
        '\U0001f504': '[In Progress]',
        '\u2192': '->',
        '\u2190': '<-',
        '\u2194': '<->',
        '\u2013': '-',
        '\u2014': '-',
        '\u2018': "'",
        '\u2019': "'",
        '\u201c': '"',
        '\u201d': '"',
        '\u2026': '...',
        '\u2022': '-',
        '\u2139': '[Info]',
        '\u26a0': '[Warning]',
        '\u2714': '[Yes]',
        '\u2718': '[No]',
        '\u2713': '[Yes]',
        '\u2717': '[No]',
        '\u2611': '[Yes]',
        '\u2610': '[No]',
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    return text


def setup_styles(doc):
    """Configure document styles for professional appearance."""
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(51, 51, 51)

    # Title style (Heading 0)
    if 'Title' in doc.styles:
        title_style = doc.styles['Title']
    else:
        title_style = doc.styles.add_style('Title', 1)  # WD_STYLE_TYPE.PARAGRAPH
    title_style.font.name = 'Calibri'
    title_style.font.size = Pt(28)
    title_style.font.bold = True
    title_style.font.color.rgb = RGBColor(0, 51, 102)
    title_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_style.paragraph_format.space_after = Pt(12)

    # Heading 1
    h1_style = doc.styles['Heading 1']
    h1_style.font.name = 'Calibri'
    h1_style.font.size = Pt(18)
    h1_style.font.bold = True
    h1_style.font.color.rgb = RGBColor(0, 51, 102)
    h1_style.paragraph_format.space_before = Pt(18)
    h1_style.paragraph_format.space_after = Pt(8)

    # Heading 2
    h2_style = doc.styles['Heading 2']
    h2_style.font.name = 'Calibri'
    h2_style.font.size = Pt(14)
    h2_style.font.bold = True
    h2_style.font.color.rgb = RGBColor(0, 102, 178)
    h2_style.paragraph_format.space_before = Pt(12)
    h2_style.paragraph_format.space_after = Pt(6)

    # Heading 3
    h3_style = doc.styles['Heading 3']
    h3_style.font.name = 'Calibri'
    h3_style.font.size = Pt(12)
    h3_style.font.bold = True
    h3_style.font.color.rgb = RGBColor(51, 51, 51)
    h3_style.paragraph_format.space_before = Pt(8)
    h3_style.paragraph_format.space_after = Pt(4)

    # Set page margins
    for section in doc.sections:
        section.top_margin = Cm(25)
        section.bottom_margin = Cm(25)
        section.left_margin = Cm(25)
        section.right_margin = Cm(25)


def setup_header_footer(doc):
    """Add header and footer to the document."""
    for section in doc.sections:
        # Header
        header = section.header
        header.is_linked_to_previous = False
        hp = header.paragraphs[0]
        hp.text = "FS Migration Validation Engine"
        hp.style.font.size = Pt(9)
        hp.style.font.color.rgb = RGBColor(128, 128, 128)

        # Footer with page number
        footer = section.footer
        footer.is_linked_to_previous = False
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = fp.add_run()
        fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
        run._r.append(fldChar1)
        run2 = fp.add_run()
        instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
        run2._r.append(instrText)
        run3 = fp.add_run()
        fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
        run3._r.append(fldChar2)


def create_cover_page(doc):
    """Create a professional cover page."""
    # Add spacing before title
    for _ in range(6):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)

    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("FS Migration Validation Engine")
    run.font.size = Pt(28)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 51, 102)

    # Subtitle
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Microsoft Founders Hub Application Pack")
    run.font.size = Pt(18)
    run.font.color.rgb = RGBColor(100, 100, 100)

    # Horizontal line
    doc.add_paragraph()

    # Version
    version = doc.add_paragraph()
    version.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = version.add_run("Business Summary Document")
    run.font.size = Pt(14)
    run.font.color.rgb = RGBColor(100, 100, 100)

    # Date
    date_p = doc.add_paragraph()
    date_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = date_p.add_run("Version 2.0 - June 2026")
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(100, 100, 100)

    # Status
    status = doc.add_paragraph()
    status.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = status.add_run("Status: Ready for Review")
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(100, 100, 100)

    # Add horizontal line separator
    doc.add_paragraph()
    p_line = doc.add_paragraph()
    p_line.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pPr = p_line._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        f'  <w:bottom w:val="single" w:sz="12" w:space="1" w:color="003366"/>'
        f'</w:pBdr>'
    )
    pPr.append(pBdr)


def create_toc(doc):
    """Create a basic Table of Contents page."""
    doc.add_page_break()

    toc_title = doc.add_heading("Table of Contents", level=1)

    toc_items = [
        ("1", "Phase 1 - Azure Founders Hub Pack", "Overview"),
        ("1.1", "Product Overview", "Executive summary, problem/solution"),
        ("1.2", "Technical Architecture", "Platform architecture (Business Summary)"),
        ("1.3", "Platform Core Definition", "Orchestration layer (Business Summary)"),
        ("1.4", "Azure Cloud Architecture", "Azure services (Business Summary)"),
        ("1.5", "Azure Reference Architecture", "Architecture layers (Business Summary)"),
        ("1.6", "Azure Founders Hub Technical Narrative", "Full technical narrative"),
        ("2.1", "Executive Pitch Narrative", "Investor pitch"),
        ("2.2", "Investor Pitch Deck", "Pitch deck content"),
        ("2.3", "Market Analysis TAM/SAM/SOM", "Market sizing & competition"),
        ("2.4", "Business Model & Pricing Strategy", "Revenue model"),
        ("2.5", "Go-to-Market Strategy", "GTM & financial projections"),
        ("2.6", "Financial Model & Funding Strategy", "Financial projections"),
        ("2.7", "Competitive Differentiation", "Competitive analysis"),
        ("2.8", "Product Roadmap", "Development roadmap"),
        ("2.9", "Investor FAQ", "Frequently asked questions"),
        ("2.10", "Demo Script", "Product demonstration"),
    ]

    for num, title, desc in toc_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.space_before = Pt(2)
        run = p.add_run(f"{num}\t{title}")
        run.font.size = Pt(11)
        run.font.bold = True if '.' not in num else False
        run.font.color.rgb = RGBColor(0, 51, 102)
        run2 = p.add_run(f"\t{desc}")
        run2.font.size = Pt(10)
        run2.font.color.rgb = RGBColor(100, 100, 100)


def parse_inline_formatting(paragraph, text):
    """Parse inline markdown formatting (bold, code, etc.)."""
    # Pattern to match **bold**, `code`, and regular text
    pattern = r'(\*\*.*?\*\*|`[^`]+`)'
    parts = re.split(pattern, text)

    for part in parts:
        if not part:
            continue
        if part.startswith('**') and part.endswith('**'):
            # Bold text
            run = paragraph.add_run(part[2:-2])
            run.bold = True
        elif part.startswith('`') and part.endswith('`'):
            # Inline code
            run = paragraph.add_run(part[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(180, 0, 0)
        else:
            # Regular text
            paragraph.add_run(part)


def format_table(doc, table_data):
    """Create a formatted table from parsed markdown table data."""
    if not table_data or len(table_data) < 2:
        return

    # Filter out separator rows (containing only dashes and pipes)
    clean_data = []
    for row in table_data:
        stripped = row.strip()
        if re.match(r'^[\|\s\-:]+$', stripped):
            continue
        cells = [c.strip() for c in stripped.split('|') if c.strip()]
        if cells:
            clean_data.append(cells)

    if len(clean_data) < 2:
        return

    # Create table
    num_cols = max(len(row) for row in clean_data)
    table = doc.add_table(rows=len(clean_data), cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Style table
    for i, row_data in enumerate(clean_data):
        for j, cell_text in enumerate(row_data):
            if j < num_cols:
                cell = table.cell(i, j)
                cell.text = ""
                p = cell.paragraphs[0]
                run = p.add_run(sanitize_text(cell_text.strip()))

                if i == 0:  # Header row
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(255, 255, 255)
                    run.font.size = Pt(10)
                    shading = parse_xml(
                        f'<w:shd {nsdecls("w")} w:fill="003366" w:val="clear"/>'
                    )
                    cell._tc.get_or_add_tcPr().append(shading)
                else:  # Body rows
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(51, 51, 51)
                    bg_color = "FFFFFF" if i % 2 == 1 else "DCF0FA"
                    shading = parse_xml(
                        f'<w:shd {nsdecls("w")} w:fill="{bg_color}" w:val="clear"/>'
                    )
                    cell._tc.get_or_add_tcPr().append(shading)

    doc.add_paragraph()  # Spacing after table


def add_code_block(doc, code):
    """Add a code block with gray background."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)

    # Add border/shading to paragraph
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:space="1" w:color="CCCCCC"/>'
        f'  <w:left w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:space="1" w:color="CCCCCC"/>'
        f'  <w:right w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/>'
        f'</w:pBdr>'
    )
    pPr.append(pBdr)

    shading = parse_xml(
        f'<w:shd {nsdecls("w")} w:fill="F0F0F0" w:val="clear"/>'
    )
    pPr.append(shading)

    run = p.add_run(sanitize_text(code))
    run.font.name = 'Courier New'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(51, 51, 51)


def parse_markdown_to_docx(doc, content, insert_diagram_func=None, phase_key=None):
    """Parse markdown content and add to Word document."""
    lines = content.split('\n')
    in_code_block = False
    code_buffer = []
    in_table = False
    table_buffer = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Code block handling
        if stripped.startswith('```'):
            if in_code_block:
                # End code block
                add_code_block(doc, '\n'.join(code_buffer))
                code_buffer = []
                in_code_block = False
            else:
                # Start code block
                in_code_block = True
                code_buffer = []
            i += 1
            continue

        if in_code_block:
            code_buffer.append(line)
            i += 1
            continue

        # Table handling
        if '|' in stripped and stripped.startswith('|'):
            table_buffer.append(stripped)
            i += 1
            continue
        elif table_buffer:
            # End of table
            format_table(doc, table_buffer)
            table_buffer = []

        # Horizontal rule
        if stripped in ('---', '***', '___'):
            p = doc.add_paragraph()
            pPr = p._p.get_or_add_pPr()
            pBdr = parse_xml(
                f'<w:pBdr {nsdecls("w")}>'
                f'  <w:bottom w:val="single" w:sz="6" w:space="1" w:color="003366"/>'
                f'</w:pBdr>'
            )
            pPr.append(pBdr)
            i += 1
            continue

        # Headings
        if stripped.startswith('# '):
            # Skip top-level headings if already handled by section title
            text = stripped[2:].strip()
            text = sanitize_text(text)
            # Don't add duplicate heading if it matches the section title
            p = doc.add_heading(text, level=1)
            i += 1
            continue

        if stripped.startswith('## '):
            text = stripped[3:].strip()
            text = sanitize_text(text)
            doc.add_heading(text, level=2)
            i += 1
            continue

        if stripped.startswith('### '):
            text = stripped[4:].strip()
            text = sanitize_text(text)
            doc.add_heading(text, level=3)
            i += 1
            continue

        # Blockquote
        if stripped.startswith('>'):
            text = stripped[1:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(1)
            run = p.add_run(sanitize_text(text))
            run.italic = True
            run.font.color.rgb = RGBColor(100, 100, 100)
            i += 1
            continue

        # Bullet points
        if stripped.startswith('- ') or stripped.startswith('* '):
            text = stripped[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            parse_inline_formatting(p, sanitize_text(text))
            i += 1
            continue

        # Numbered lists
        if re.match(r'^\d+\.\s', stripped):
            text = re.sub(r'^\d+\.\s', '', stripped).strip()
            p = doc.add_paragraph(style='List Number')
            parse_inline_formatting(p, sanitize_text(text))
            i += 1
            continue

        # Empty lines
        if not stripped:
            i += 1
            continue

        # Regular paragraph
        p = doc.add_paragraph()
        parse_inline_formatting(p, sanitize_text(stripped))
        i += 1

    # Flush remaining table
    if table_buffer:
        format_table(doc, table_buffer)


def insert_image_to_doc(doc, image_path, width_inches=6.0, caption=None):
    """Insert an image into the document."""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(image_path, width=Inches(width_inches))

    if caption:
        cap_p = doc.add_paragraph()
        cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = cap_p.add_run(caption)
        run.font.size = Pt(9)
        run.font.italic = True
        run.font.color.rgb = RGBColor(128, 128, 128)


# ============================================================================
# DIAGRAM GENERATION FUNCTIONS
# ============================================================================

def generate_diagram_how_it_works():
    """Generate the 'How It Works' flow diagram."""
    fig, ax = plt.subplots(1, 1, figsize=(10, 2.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 3)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    boxes = [
        (0.5, 1, "Legacy\nSystem", "#E8E8E8"),
        (2.3, 1, "Discovery\nEngine", "#B8D4E8"),
        (4.1, 1, "10 Validation\nControls", "#A8C8E0"),
        (5.9, 1, "Scoring\nEngine", "#98BCD8"),
        (7.7, 1, "Release\nGate", "#F0D080"),
        (9.3, 1, "Audit\nReport", "#90C890"),
    ]

    for x, y, text, color in boxes:
        fancy = FancyBboxPatch((x - 0.5, y - 0.5), 1.3, 1.0,
                                boxstyle="round,pad=0.1",
                                facecolor=color, edgecolor='#003366', linewidth=1.5)
        ax.add_patch(fancy)
        ax.text(x + 0.15, y, text, ha='center', va='center', fontsize=8,
                fontweight='bold', color='#003366')

    # Arrows
    for i in range(len(boxes) - 1):
        x1 = boxes[i][0] + 0.65
        x2 = boxes[i+1][0] - 0.5
        ax.annotate('', xy=(x2, 1), xytext=(x1, 1),
                    arrowprops=dict(arrowstyle='->', color='#003366', lw=2))

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "how_it_works_flow.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_executive_flow():
    """Generate the executive flow diagram."""
    fig, ax = plt.subplots(1, 1, figsize=(8, 2))
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 2.5)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    boxes = [
        (1, 1, "Discover", "#B8D4E8"),
        (3, 1, "Validate", "#A8C8E0"),
        (5, 1, "Score", "#98BCD8"),
        (7, 1, "Govern", "#F0D080"),
    ]

    for x, y, text, color in boxes:
        fancy = FancyBboxPatch((x - 0.7, y - 0.5), 1.4, 1.0,
                                boxstyle="round,pad=0.1",
                                facecolor=color, edgecolor='#003366', linewidth=1.5)
        ax.add_patch(fancy)
        ax.text(x, y, text, ha='center', va='center', fontsize=11,
                fontweight='bold', color='#003366')

    for i in range(len(boxes) - 1):
        x1 = boxes[i][0] + 0.7
        x2 = boxes[i+1][0] - 0.7
        ax.annotate('', xy=(x2, 1), xytext=(x1, 1),
                    arrowprops=dict(arrowstyle='->', color='#003366', lw=2))

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "executive_flow.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_tam_sam_som():
    """Generate TAM/SAM/SOM concentric circles diagram."""
    fig, ax = plt.subplots(1, 1, figsize=(6, 6))
    ax.set_xlim(-3, 3)
    ax.set_ylim(-3, 3)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # TAM (outermost)
    circle_tam = Circle((0, 0), 2.5, facecolor='#B8D4E8', edgecolor='#003366', linewidth=2, alpha=0.7)
    ax.add_patch(circle_tam)
    ax.text(0, 2.1, 'TAM\n£4.2B', ha='center', va='center', fontsize=12,
            fontweight='bold', color='#003366')

    # SAM (middle)
    circle_sam = Circle((0, 0), 1.7, facecolor='#A8C8E0', edgecolor='#003366', linewidth=2, alpha=0.8)
    ax.add_patch(circle_sam)
    ax.text(0, 1.3, 'SAM\n£850M', ha='center', va='center', fontsize=11,
            fontweight='bold', color='#003366')

    # SOM (innermost)
    circle_som = Circle((0, 0), 0.9, facecolor='#003366', edgecolor='#003366', linewidth=2)
    ax.add_patch(circle_som)
    ax.text(0, 0, 'SOM\n£42M', ha='center', va='center', fontsize=11,
            fontweight='bold', color='white')

    ax.set_title('Market Sizing - TAM / SAM / SOM', fontsize=14, fontweight='bold',
                 color='#003366', pad=20)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "tam_sam_som.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_competitive_positioning():
    """Generate competitive positioning quadrant chart."""
    fig, ax = plt.subplots(1, 1, figsize=(7, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    fig.patch.set_facecolor('white')

    # Quadrant background
    ax.axhspan(5, 10, xmin=0.5, xmax=1.0, alpha=0.15, color='green')
    ax.axhspan(0, 5, xmin=0, xmax=0.5, alpha=0.15, color='red')
    ax.axhspan(5, 10, xmin=0, xmax=0.5, alpha=0.15, color='yellow')
    ax.axhspan(0, 5, xmin=0.5, xmax=1.0, alpha=0.15, color='orange')

    # Labels
    ax.text(7.5, 9.5, 'LEADERS', ha='center', fontsize=10, color='green', fontweight='bold')
    ax.text(2.5, 9.5, 'CHALLENGERS', ha='center', fontsize=10, color='orange', fontweight='bold')
    ax.text(2.5, 0.5, 'NICHE', ha='center', fontsize=10, color='red', fontweight='bold')
    ax.text(7.5, 0.5, 'VISIONARIES', ha='center', fontsize=10, color='blue', fontweight='bold')

    # Plot competitors
    competitors = [
        (8.5, 8.5, 'FS Migration\nValidation Engine', '#003366', 200),
        (6, 7, 'Legacy\nValidators', '#808080', 100),
        (4, 6, 'Generic\nETL Tools', '#808080', 100),
        (7, 5, 'Manual\nProcesses', '#808080', 80),
        (3, 4, 'Custom\nScripts', '#808080', 80),
    ]

    for x, y, name, color, size in competitors:
        ax.scatter(x, y, s=size, c=color, alpha=0.7, edgecolors='black', linewidths=1)
        ax.text(x, y - 0.6, name, ha='center', va='top', fontsize=7, color=color)

    ax.set_xlabel('Innovation / Capability', fontsize=11, fontweight='bold')
    ax.set_ylabel('Market Execution / Completeness', fontsize=11, fontweight='bold')
    ax.set_title('Competitive Positioning Matrix', fontsize=13, fontweight='bold', color='#003366')
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "competitive_positioning.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_pricing_tiers():
    """Generate pricing tiers visual comparison."""
    fig, ax = plt.subplots(1, 1, figsize=(8, 4))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    tiers = [
        (1.5, "Starter", "£5,000/mo", ["5 validations/mo", "Basic reporting", "Email support", "1 environment"], "#B8D4E8"),
        (5, "Professional", "£15,000/mo", ["25 validations/mo", "Full audit suite", "Priority support", "3 environments"], "#003366"),
        (8.5, "Enterprise", "Custom", ["Unlimited validations", "Custom controls", "Dedicated support", "Unlimited envs"], "#006633"),
    ]

    for x, name, price, features, color in tiers:
        # Box
        fancy = FancyBboxPatch((x - 1.2, 0.2), 2.4, 4.2,
                                boxstyle="round,pad=0.1",
                                facecolor=color, edgecolor='#003366', linewidth=1.5, alpha=0.85)
        ax.add_patch(fancy)

        # Tier name
        text_color = 'white' if color != "#B8D4E8" else '#003366'
        ax.text(x, 4.0, name, ha='center', va='center', fontsize=12,
                fontweight='bold', color=text_color)

        # Price
        ax.text(x, 3.3, price, ha='center', va='center', fontsize=11,
                fontweight='bold', color=text_color)

        # Features
        for j, feat in enumerate(features):
            ax.text(x, 2.5 - j * 0.5, f"  {feat}", ha='center', va='center', fontsize=8,
                    color=text_color)

    ax.set_title('Pricing Tiers', fontsize=14, fontweight='bold', color='#003366', pad=10)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "pricing_tiers.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_channel_contribution():
    """Generate channel contribution stacked bar chart."""
    fig, ax = plt.subplots(1, 1, figsize=(7, 4))
    fig.patch.set_facecolor('white')

    years = ['Year 1', 'Year 2', 'Year 3']
    direct = [200, 800, 2500]
    partners = [150, 600, 2000]
    marketplace = [100, 400, 1500]
    referral = [100, 500, 2400]

    x = range(len(years))
    width = 0.6

    ax.bar(x, direct, width, label='Direct Sales', color='#003366')
    ax.bar(x, partners, width, bottom=direct, label='Partners', color='#0066CC')
    ax.bar(x, marketplace, width, bottom=[d+p for d, p in zip(direct, partners)],
           label='Marketplace', color='#4DA6FF')
    ax.bar(x, referral, width,
           bottom=[d+p+m for d, p, m in zip(direct, partners, marketplace)],
           label='Referral', color='#99CCFF')

    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=11)
    ax.set_ylabel('Revenue (£k)', fontsize=11, fontweight='bold')
    ax.set_title('Channel Revenue Contribution', fontsize=13, fontweight='bold', color='#003366')
    ax.legend(loc='upper left')
    ax.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "channel_contribution.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_revenue_growth():
    """Generate revenue growth bar chart."""
    fig, ax = plt.subplots(1, 1, figsize=(6, 4))
    fig.patch.set_facecolor('white')

    years = ['Year 1', 'Year 2', 'Year 3']
    revenue = [550, 2700, 8900]
    colors = ['#4DA6FF', '#0066CC', '#003366']

    bars = ax.bar(years, revenue, color=colors, edgecolor='#003366', linewidth=1.5)

    for bar, val in zip(bars, revenue):
        ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 100,
                f'£{val}k', ha='center', va='bottom', fontsize=11,
                fontweight='bold', color='#003366')

    ax.set_ylabel('Revenue (£k)', fontsize=11, fontweight='bold')
    ax.set_title('Revenue Growth Trajectory', fontsize=13, fontweight='bold', color='#003366')
    ax.set_ylim(0, 11000)
    ax.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "revenue_growth.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_ebitda():
    """Generate EBITDA trajectory line chart."""
    fig, ax = plt.subplots(1, 1, figsize=(6, 4))
    fig.patch.set_facecolor('white')

    quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8']
    ebitda = [-120, -80, -20, 40, 120, 280, 520, 850]

    ax.fill_between(range(len(quarters)), ebitda, alpha=0.2,
                    color='#003366', where=[e >= 0 for e in ebitda])
    ax.fill_between(range(len(quarters)), ebitda, alpha=0.2,
                    color='red', where=[e < 0 for e in ebitda])
    ax.plot(range(len(quarters)), ebitda, color='#003366', linewidth=2, marker='o')
    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8)

    ax.set_xticks(range(len(quarters)))
    ax.set_xticklabels(quarters, fontsize=10)
    ax.set_ylabel('EBITDA (£k)', fontsize=11, fontweight='bold')
    ax.set_title('EBITDA Trajectory', fontsize=13, fontweight='bold', color='#003366')
    ax.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "ebitda_trajectory.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_use_of_funds():
    """Generate use of funds pie chart."""
    fig, ax = plt.subplots(1, 1, figsize=(6, 5))
    fig.patch.set_facecolor('white')

    labels = ['Engineering\n40%', 'Sales & Marketing\n25%', 'Operations\n15%',
              'G&A\n10%', 'Reserve\n10%']
    sizes = [40, 25, 15, 10, 10]
    colors = ['#003366', '#0066CC', '#4DA6FF', '#99CCFF', '#CCE5FF']
    explode = (0.05, 0, 0, 0, 0)

    wedges, texts = ax.pie(sizes, explode=explode, labels=labels, colors=colors,
                           startangle=90, textprops={'fontsize': 9})
    for text in texts:
        text.set_fontweight('bold')
        text.set_color('#003366')

    ax.set_title('Use of Funds', fontsize=14, fontweight='bold', color='#003366', pad=20)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "use_of_funds.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_feature_comparison():
    """Generate feature comparison grid."""
    fig, ax = plt.subplots(1, 1, figsize=(8, 4))
    ax.axis('off')
    fig.patch.set_facecolor('white')

    features = ['Schema\nDiscovery', '10 Controls', 'Scoring', 'Governance',
                'Audit Trail', 'Cloud Native']
    products = ['FS Migration\nEngine', 'Legacy\nValidators', 'Generic\nETL', 'Manual\nProcess']

    data = [
        [True, False, False, False],
        [True, False, False, False],
        [True, False, False, False],
        [True, False, True, False],
        [True, False, False, False],
        [True, False, True, True],
    ]

    cell_colors = []
    for row in data:
        colors_row = []
        for val in row:
            if val:
                colors_row.append('#90C890')
            else:
                colors_row.append('#F0B0B0')
        cell_colors.append(colors_row)

    table = ax.table(cellText=data, rowLabels=features, colLabels=products,
                     cellColours=cell_colors, rowColours=['#E8E8E8']*len(features),
                     colColours=['#003366']*len(products), loc='center',
                     cellLoc='center')

    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1.2, 1.8)

    for j in range(len(products)):
        table[0, j].set_text_props(color='white', fontweight='bold')

    for i in range(len(features)):
        table[i+1, -1].set_text_props(fontweight='bold')

    ax.set_title('Feature Comparison', fontsize=13, fontweight='bold',
                 color='#003366', pad=20)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "feature_comparison.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_roadmap():
    """Generate product roadmap timeline."""
    fig, ax = plt.subplots(1, 1, figsize=(10, 3.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Timeline line
    ax.plot([0.5, 9.5], [2, 2], color='#003366', linewidth=3, zorder=1)

    milestones = [
        (1.5, "Q3 2026", "MVP Launch", "#B8D4E8"),
        (3.5, "Q4 2026", "AI Mapping", "#A8C8E0"),
        (5.5, "Q1 2027", "Enterprise\nFeatures", "#003366"),
        (7.5, "Q2 2027", "Market\nExpansion", "#0066CC"),
        (9.0, "Q3 2027", "Series A\nReadiness", "#003366"),
    ]

    for i, (x, quarter, label, color) in enumerate(milestones):
        # Circle on timeline
        circle = plt.Circle((x, 2), 0.2, color=color, zorder=2)
        ax.add_patch(circle)

        # Text above/below
        y_text = 3.0 if i % 2 == 0 else 1.0
        va = 'bottom' if i % 2 == 0 else 'top'
        ax.text(x, y_text, f"{quarter}\n{label}", ha='center', va=va,
                fontsize=8, fontweight='bold', color='#003366',
                bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor=color, alpha=0.9))

    ax.set_title('Product Roadmap', fontsize=14, fontweight='bold', color='#003366', pad=10)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "product_roadmap.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_diagram_azure_services():
    """Generate Azure services visual."""
    fig, ax = plt.subplots(1, 1, figsize=(8, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    services = [
        (2, 6, "Azure Container\nApps", "#0078D4"),
        (5, 6, "Azure SQL\nDatabase", "#0078D4"),
        (8, 6, "Azure Blob\nStorage", "#0078D4"),
        (2, 4, "Azure Key\nVault", "#0078D4"),
        (5, 4, "Microsoft\nEntra ID", "#0078D4"),
        (8, 4, "Azure\nMonitor", "#0078D4"),
        (5, 2, "Azure API\nManagement", "#0078D4"),
    ]

    for x, y, name, color in services:
        fancy = FancyBboxPatch((x - 1, y - 0.5), 2, 1.0,
                                boxstyle="round,pad=0.1",
                                facecolor=color, edgecolor='#003366', linewidth=1.5, alpha=0.85)
        ax.add_patch(fancy)
        ax.text(x, y, name, ha='center', va='center', fontsize=9,
                fontweight='bold', color='white')

    ax.set_title('Azure Cloud Services', fontsize=14, fontweight='bold', color='#003366', pad=10)

    plt.tight_layout()
    path = os.path.join(DIAGRAMS_DIR, "azure_services.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    return path


def generate_all_diagrams():
    """Generate all diagrams and return paths."""
    print("Generating diagrams...")
    diagrams = {}
    diagrams['how_it_works'] = generate_diagram_how_it_works()
    diagrams['executive_flow'] = generate_diagram_executive_flow()
    diagrams['tam_sam_som'] = generate_diagram_tam_sam_som()
    diagrams['competitive'] = generate_diagram_competitive_positioning()
    diagrams['pricing'] = generate_diagram_pricing_tiers()
    diagrams['channel'] = generate_diagram_channel_contribution()
    diagrams['revenue'] = generate_diagram_revenue_growth()
    diagrams['ebitda'] = generate_diagram_ebitda()
    diagrams['funds'] = generate_diagram_use_of_funds()
    diagrams['features'] = generate_diagram_feature_comparison()
    diagrams['roadmap'] = generate_diagram_roadmap()
    diagrams['azure'] = generate_diagram_azure_services()
    print(f"Generated {len(diagrams)} diagrams in {DIAGRAMS_DIR}")
    return diagrams


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("=" * 70)
    print("FS Migration Validation Engine - Master Document Generator")
    print("=" * 70)

    # 1. Generate diagrams
    diagrams = generate_all_diagrams()

    # 2. Create Word document
    print("\nCreating Word document...")
    doc = Document()
    setup_styles(doc)
    setup_header_footer(doc)

    # 3. Cover page
    print("  Adding cover page...")
    create_cover_page(doc)

    # 4. Table of Contents
    print("  Adding table of contents...")
    create_toc(doc)

    # 5. Process each phase file
    print("  Processing phase files...")
    for filename, phase_key in PHASE_FILES:
        file_path = os.path.join(SOURCE_DIR, filename)
        print(f"    Processing: {filename}")

        doc.add_page_break()

        # Check if this phase should be summarized
        if phase_key in SUMMARIES:
            content = SUMMARIES[phase_key]
            parse_markdown_to_docx(doc, content)
        else:
            if os.path.exists(file_path):
                content = read_markdown(file_path)
                parse_markdown_to_docx(doc, content)
            else:
                doc.add_paragraph(f"[Content not available: {filename}]")

        # Insert diagrams at appropriate locations
        if phase_key == "phase1_1":
            # Insert How It Works diagram after Phase 1.1
            insert_image_to_doc(doc, diagrams['how_it_works'], 6.0,
                              "Figure 1: How It Works - End-to-End Flow")

        elif phase_key == "phase1_4":
            # Insert Azure Services diagram
            insert_image_to_doc(doc, diagrams['azure'], 5.5,
                              "Figure 2: Azure Cloud Services Architecture")

        elif phase_key == "phase2_1":
            # Insert Executive Flow diagram
            insert_image_to_doc(doc, diagrams['executive_flow'], 5.0,
                              "Figure 3: Executive Flow - Four-Step Process")

        elif phase_key == "phase2_3":
            # Insert TAM/SAM/SOM and Competitive Positioning
            insert_image_to_doc(doc, diagrams['tam_sam_som'], 4.5,
                              "Figure 4: Market Sizing - TAM / SAM / SOM")
            insert_image_to_doc(doc, diagrams['competitive'], 5.0,
                              "Figure 5: Competitive Positioning Matrix")

        elif phase_key == "phase2_4":
            # Insert Pricing Tiers
            insert_image_to_doc(doc, diagrams['pricing'], 5.5,
                              "Figure 6: Pricing Tier Comparison")

        elif phase_key == "phase2_5":
            # Insert Channel Contribution and Revenue Growth
            insert_image_to_doc(doc, diagrams['channel'], 5.0,
                              "Figure 7: Channel Revenue Contribution")
            insert_image_to_doc(doc, diagrams['revenue'], 4.5,
                              "Figure 8: Revenue Growth Trajectory")

        elif phase_key == "phase2_6":
            # Insert EBITDA and Use of Funds
            insert_image_to_doc(doc, diagrams['ebitda'], 4.5,
                              "Figure 9: EBITDA Trajectory")
            insert_image_to_doc(doc, diagrams['funds'], 4.5,
                              "Figure 10: Use of Funds Allocation")

        elif phase_key == "phase2_7":
            # Insert Feature Comparison
            insert_image_to_doc(doc, diagrams['features'], 5.5,
                              "Figure 11: Feature Comparison Grid")

        elif phase_key == "phase2_8":
            # Insert Product Roadmap
            insert_image_to_doc(doc, diagrams['roadmap'], 6.0,
                              "Figure 12: Product Roadmap Timeline")

    # 6. Save Word document
    docx_path = os.path.join(OUTPUT_DIR, "FS_Migration_Validation_Engine_Founders_Hub_Master.docx")
    print(f"\nSaving Word document to:\n  {docx_path}")
    doc.save(docx_path)
    print("  Word document saved successfully!")

    # 7. Convert to PDF
    pdf_path = os.path.join(OUTPUT_DIR, "FS_Migration_Validation_Engine_Founders_Hub_Master.pdf")
    print(f"\nConverting to PDF...")
    print(f"  Output: {pdf_path}")
    try:
        convert(docx_path, pdf_path)
        print("  PDF converted successfully!")
    except Exception as e:
        print(f"  PDF conversion failed: {e}")
        print("  Note: docx2pdf requires Microsoft Word to be installed.")
        print("  The Word document has been saved successfully.")

    print("\n" + "=" * 70)
    print("OUTPUT FILES:")
    print(f"  Word: {docx_path}")
    print(f"  PDF:  {pdf_path}")
    print("=" * 70)


if __name__ == '__main__':
    main()
