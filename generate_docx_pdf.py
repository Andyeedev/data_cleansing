#!/usr/bin/env python3
"""
FS Migration Validation Engine - Technical Master Document Generator
Generates professional Word document with diagrams, then converts to PDF.
"""

import os
import re
import sys

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
from docx2pdf import convert

# ─── Configuration ───────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = os.path.join(BASE_DIR, "research", "Azure_Founders_Hub_Pack", "v4-cloud-ready")
OUTPUT_DIR = os.path.join(SOURCE_DIR, "output", "v1-technical-word")
DIAGRAMS_DIR = os.path.join(SOURCE_DIR, "output", "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

DOCX_NAME = "FS_Migration_Validation_Engine_Founders_Hub_Master.docx"
PDF_NAME = "FS_Migration_Validation_Engine_Founders_Hub_Master.pdf"
DOCX_PATH = os.path.join(OUTPUT_DIR, DOCX_NAME)
PDF_PATH = os.path.join(OUTPUT_DIR, PDF_NAME)

# Colours
DARK_BLUE = RGBColor(0, 51, 102)
MEDIUM_BLUE = RGBColor(0, 102, 178)
DARK_GRAY = RGBColor(51, 51, 51)
LIGHT_GRAY_BG = "F0F0F0"
TABLE_HEADER_BG = "003366"
TABLE_ALT_BG = "DCEBF8"

# Phase files in exact document order
PHASE_FILES = [
    "Phase 1 – Azure Founders Hub Pack.md",
    "Phase 1.1 Product Overview.md",
    "Phase 1.2 Technical Architecture.md",
    "Phase 1.3 – Platform Core Definition.md",
    "Phase 1.4 Azure Cloud Architecture.md",
    "Phase 1.5 Azure Reference Architecture Diagram.md",
    "Phase 1.6 Azure Founders Hub Technical Narrative.md",
    "Phase 2.1 Executive Pitch Narrative.md",
    "Phase 2.2 Investor Pitch Deck.md",
    "Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md",
    "Phase 2.4 Business Model and Pricing Strategy.md",
    "Phase 2.5 Go-to-Market Strategy and Financial Projections.md",
    "Phase 2.6 Financial Model and Funding Strategy.md",
    "Phase 2.7 Competitive Differentiation.md",
    "Phase 2.8 Product Roadmap.md",
    "Phase 2.9 Investor FAQ.md",
    "Phase 2.10 Demo Script.md",
]


# ══════════════════════════════════════════════════════════════════════════════
# Helper: read markdown
# ══════════════════════════════════════════════════════════════════════════════
def read_markdown(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


# ══════════════════════════════════════════════════════════════════════════════
# Helper: set cell shading
# ══════════════════════════════════════════════════════════════════════════════
def set_cell_shading(cell, color_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)


def set_cell_margins(cell, top=40, bottom=40, left=80, right=80):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'  <w:top w:w="{top}" w:type="dxa"/>'
        f'  <w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'  <w:left w:w="{left}" w:type="dxa"/>'
        f'  <w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)


# ══════════════════════════════════════════════════════════════════════════════
# Diagram generation
# ══════════════════════════════════════════════════════════════════════════════

def generate_diagrams():
    """Generate all 15 diagrams as high-res PNGs in DIAGRAMS_DIR."""
    _diagram_how_it_works()
    _diagram_platform_architecture()
    _diagram_control_dag()
    _diagram_azure_architecture()
    _diagram_five_pillars()
    _diagram_cicd_pipeline()
    _diagram_business_flow()
    _diagram_tam_sam_som()
    _diagram_competitive_positioning()
    _diagram_revenue_growth()
    _diagram_channel_contribution()
    _diagram_ebitda_trajectory()
    _diagram_use_of_funds()
    _diagram_product_roadmap()
    _diagram_architecture_evolution()
    plt.close('all')
    print("All diagrams generated.")


def _save(fig, name):
    path = os.path.join(DIAGRAMS_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    return path


def _box(ax, x, y, w, h, text, color='#003366', text_color='white', fontsize=9, lw=1.5):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                         facecolor=color, edgecolor='#333333', linewidth=lw)
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text, ha='center', va='center',
            fontsize=fontsize, color=text_color, fontweight='bold', wrap=True)


def _arrow(ax, x1, y1, x2, y2, color='#333333'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.8))


# Diagram 1: How It Works Flow
def _diagram_how_it_works():
    fig, ax = plt.subplots(figsize=(12, 2.2))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 2.2)
    ax.axis('off')
    labels = ['Legacy\nSystem', 'Discovery', '10 Validation\nControls', 'Scoring', 'Release\nGate', 'Audit\nReport']
    colors = ['#003366', '#003366', '#003366', '#003366', '#00994C', '#0066B2']
    bw, bh = 1.6, 1.2
    gap = 0.35
    x = 0.3
    for i, (lbl, col) in enumerate(zip(labels, colors)):
        _box(ax, x, 0.5, bw, bh, lbl, color=col, fontsize=9)
        if i < len(labels) - 1:
            _arrow(ax, x + bw + 0.02, 1.1, x + bw + gap - 0.02, 1.1)
        x += bw + gap
    ax.set_title('How It Works — Automated Validation Workflow', fontsize=12, fontweight='bold', color='#003366', pad=10)
    _save(fig, 'how_it_works.png')


# Diagram 2: Platform Architecture
def _diagram_platform_architecture():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    _box(ax, 3.5, 5.2, 3, 0.7, 'Users / CLI / API', color='#4A90D9', fontsize=10)
    _arrow(ax, 5, 5.2, 5, 4.55)
    _box(ax, 3, 3.8, 4, 0.7, 'API Layer (FastAPI)', color='#0066B2', fontsize=10)
    _arrow(ax, 5, 3.8, 5, 3.15)
    _box(ax, 2.5, 2.4, 5, 0.7, 'Platform Core (Orchestrator)', color='#003366', fontsize=10)
    engines = [('Discovery\nEngine', 0.5), ('Validation\nEngine', 2.7), ('Scoring\nEngine', 4.9), ('Governance\nEngine', 7.1)]
    for lbl, ex in engines:
        _arrow(ax, 5, 2.4, ex + 0.9, 1.85)
        _box(ax, ex, 1.1, 1.8, 0.7, lbl, color='#0066B2', fontsize=8)
    for ex in [0.5, 2.7, 4.9, 7.1]:
        _arrow(ax, ex + 0.9, 1.1, 5, 0.55)
    _box(ax, 3, -0.15, 4, 0.6, 'Database (PostgreSQL)', color='#333333', fontsize=9)
    ax.set_title('Platform Architecture', fontsize=13, fontweight='bold', color='#003366', pad=12)
    _save(fig, 'platform_architecture.png')


# Diagram 3: Control Dependency DAG
def _diagram_control_dag():
    fig, ax = plt.subplots(figsize=(11, 4))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 4)
    ax.axis('off')
    positions = {
        'C01': (1, 3), 'C02': (3, 3), 'C03': (3, 1), 'C09': (5, 1),
        'C04': (7, 1), 'C05': (9, 1), 'C06': (9, 3), 'C07': (7, 3),
        'C08': (5, 3), 'C010': (10, 3),
    }
    for ctrl, (px, py) in positions.items():
        _box(ax, px - 0.5, py - 0.3, 1.0, 0.6, ctrl, color='#003366', fontsize=9)
    deps = [('C01', 'C02'), ('C01', 'C03'), ('C02', 'C08'), ('C03', 'C09'),
            ('C09', 'C04'), ('C04', 'C05'), ('C05', 'C06'), ('C05', 'C07'),
            ('C08', 'C010'), ('C06', 'C010'), ('C07', 'C010')]
    for src, dst in deps:
        sx, sy = positions[src]
        dx, dy = positions[dst]
        _arrow(ax, sx, sy, dx, dy, color='#0066B2')
    ax.set_title('Control Dependency DAG (C01-C010)', fontsize=12, fontweight='bold', color='#003366', pad=10)
    _save(fig, 'control_dag.png')


# Diagram 4: Azure Architecture
def _diagram_azure_architecture():
    fig, ax = plt.subplots(figsize=(11, 7))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)
    ax.axis('off')
    _box(ax, 3.5, 6.2, 4, 0.6, 'Users / CLI / DevOps', color='#4A90D9', fontsize=10)
    _arrow(ax, 5.5, 6.2, 5.5, 5.6)
    _box(ax, 3, 5.0, 5, 0.6, 'Azure API Management', color='#0066B2', fontsize=10)
    _arrow(ax, 5.5, 5.0, 5.5, 4.4)
    _box(ax, 2.5, 3.7, 6, 0.6, 'Azure Container Apps — Platform Core', color='#003366', fontsize=10)
    eng_x = [0.5, 2.5, 4.5, 6.5, 8.5]
    eng_labels = ['Discovery', 'Validation', 'Scoring', 'Governance', 'Reports']
    for ex, el in zip(eng_x, eng_labels):
        _arrow(ax, 5.5, 3.7, ex + 0.6, 2.9)
        _box(ax, ex, 2.2, 1.2, 0.7, el, color='#0066B2', fontsize=7)
    for ex in eng_x:
        _arrow(ax, ex + 0.6, 2.2, 5.5, 1.5)
    _box(ax, 2, 0.8, 3, 0.6, 'Azure SQL / PostgreSQL', color='#333333', fontsize=9)
    _box(ax, 6, 0.8, 3, 0.6, 'Azure Blob Storage', color='#333333', fontsize=9)
    _box(ax, 9.5, 2.2, 1.2, 0.7, 'Azure Key\nVault', color='#6B2D8B', fontsize=7)
    ax.set_title('Azure Cloud Architecture', fontsize=13, fontweight='bold', color='#003366', pad=12)
    _save(fig, 'azure_architecture.png')


# Diagram 5: Five Platform Pillars
def _diagram_five_pillars():
    fig, ax = plt.subplots(figsize=(10, 4))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4)
    ax.axis('off')
    pillars = [
        ('Enterprise\nDiscovery', '#2E8B57'),
        ('Intelligent\nMapping', '#2E8B57'),
        ('Migration\nValidation', '#2E8B57'),
        ('Governance\n& Audit', '#2E8B57'),
        ('AI Intelligence\nLayer', '#E8A317'),
    ]
    bw, bh = 1.5, 2.8
    gap = 0.4
    x = 0.4
    for lbl, col in pillars:
        _box(ax, x, 0.5, bw, bh, lbl, color=col, fontsize=9)
        status_text = 'Built' if col == '#2E8B57' else 'In Dev'
        ax.text(x + bw / 2, 3.6, status_text,
                ha='center', va='center', fontsize=8, color=col, fontweight='bold')
        x += bw + gap
    ax.set_title('Five Platform Pillars', fontsize=13, fontweight='bold', color='#003366', pad=10)
    _save(fig, 'five_pillars.png')


# Diagram 6: CI/CD Pipeline
def _diagram_cicd_pipeline():
    fig, ax = plt.subplots(figsize=(12, 2))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 2)
    ax.axis('off')
    stages = ['Code\nCommit', 'CI\nBuild', 'Unit\nTests', 'Docker\nBuild', 'Deploy\nStaging', 'Validation\nRun', 'Release\nGate', 'Production\nDeploy']
    colors = ['#003366'] * 6 + ['#00994C', '#0066B2']
    bw, bh = 1.2, 1.2
    gap = 0.2
    x = 0.2
    for i, (s, c) in enumerate(zip(stages, colors)):
        _box(ax, x, 0.4, bw, bh, s, color=c, fontsize=7)
        if i < len(stages) - 1:
            _arrow(ax, x + bw + 0.01, 1.0, x + bw + gap - 0.01, 1.0)
        x += bw + gap
    ax.set_title('CI/CD Pipeline Flow', fontsize=12, fontweight='bold', color='#003366', pad=8)
    _save(fig, 'cicd_pipeline.png')


# Diagram 7: Business Flow
def _diagram_business_flow():
    fig, ax = plt.subplots(figsize=(10, 2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 2)
    ax.axis('off')
    steps = ['Discovery', 'Validation\nControls', 'Scoring &\nGovernance', 'Audit\nReport']
    colors = ['#003366', '#0066B2', '#00994C', '#0066B2']
    bw, bh = 2.0, 1.2
    gap = 0.4
    x = 0.4
    for s, c in zip(steps, colors):
        _box(ax, x, 0.4, bw, bh, s, color=c, fontsize=9)
        if x + bw + gap < 10:
            _arrow(ax, x + bw + 0.02, 1.0, x + bw + gap - 0.02, 1.0)
        x += bw + gap
    ax.set_title('Business Flow', fontsize=12, fontweight='bold', color='#003366', pad=8)
    _save(fig, 'business_flow.png')


# Diagram 8: TAM/SAM/SOM
def _diagram_tam_sam_som():
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.set_xlim(0, 7)
    ax.set_ylim(0, 7)
    ax.axis('off')
    circles = [
        (3.5, 3.5, 3.2, '#B0C4DE', 'TAM\n$8-12B\nGlobal Data Migration\n+ RegTech + Validation'),
        (3.5, 3.5, 2.2, '#5B9BD5', 'SAM\n$1.5-2.5B\nAzure-Centric FSI\nOrganisations'),
        (3.5, 3.5, 1.2, '#003366', 'SOM\n$10-30M\nYear 1-2\nUK FSI'),
    ]
    for cx, cy, r, col, lbl in circles:
        circle = plt.Circle((cx, cy), r, facecolor=col, edgecolor='#333333', linewidth=1.5, alpha=0.85)
        ax.add_patch(circle)
        fc = 'white' if col != '#B0C4DE' else '#003366'
        fs = 11 if r > 2.5 else (10 if r > 1.8 else 9)
        ax.text(cx, cy, lbl, ha='center', va='center', fontsize=fs, color=fc, fontweight='bold')
    ax.set_title('TAM / SAM / SOM', fontsize=13, fontweight='bold', color='#003366', pad=12)
    _save(fig, 'tam_sam_som.png')


# Diagram 9: Competitive Positioning
def _diagram_competitive_positioning():
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axhline(5, color='gray', lw=0.8, ls='--')
    ax.axvline(5, color='gray', lw=0.8, ls='--')
    ax.text(2.5, 9.5, 'Niche\nSpecialists', ha='center', fontsize=9, color='gray', style='italic')
    ax.text(7.5, 9.5, 'Comprehensive\nLeaders', ha='center', fontsize=9, color='gray', style='italic')
    ax.text(2.5, 0.5, 'Low\nCapability', ha='center', fontsize=9, color='gray', style='italic')
    ax.text(7.5, 0.5, 'Broad\nCapability', ha='center', fontsize=9, color='gray', style='italic')
    ax.text(5, -0.6, '← Migration-Focused ——————————— General Purpose →', ha='center', fontsize=10, color='#333')
    ax.text(-0.6, 5, '← Governance /\n   Audit Depth', ha='center', fontsize=9, color='#333', rotation=90, va='center')
    competitors = {
        'Our\nPlatform': (8, 8, '#00994C', 14),
        'QuerySurge': (3.5, 5.5, '#E8A317', 10),
        'Informatica': (7, 4, '#E8A317', 10),
        'Manual/\nScripts': (2, 2, '#CC3333', 10),
        'Azure\nMigrate': (5, 3, '#4A90D9', 9),
        'Deloitte\nMigration': (4, 6.5, '#4A90D9', 9),
    }
    for name, (cx, cy, col, fs) in competitors.items():
        ax.plot(cx, cy, 'o', color=col, markersize=22, alpha=0.8)
        ax.text(cx, cy, name, ha='center', va='center', fontsize=fs, color='white', fontweight='bold')
    ax.set_title('Competitive Positioning', fontsize=13, fontweight='bold', color='#003366', pad=12)
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)
    _save(fig, 'competitive_positioning.png')


# Diagram 10: Revenue Growth
def _diagram_revenue_growth():
    fig, ax = plt.subplots(figsize=(8, 5))
    years = ['Year 1', 'Year 2', 'Year 3']
    saas = [450, 2400, 8400]
    services = [100, 300, 500]
    x = np.arange(len(years))
    w = 0.5
    bars1 = ax.bar(x, saas, w, label='SaaS Revenue', color='#003366')
    bars2 = ax.bar(x, services, w, bottom=saas, label='Professional Services', color='#0066B2')
    for bar, val in zip(bars1, saas):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'£{val//1000}k' if val < 10000 else f'£{val/1000:.1f}M',
                ha='center', va='center', fontsize=10, color='white', fontweight='bold')
    for bar, s, sv in zip(bars2, saas, services):
        ax.text(bar.get_x() + bar.get_width() / 2, s + sv / 2, f'£{sv}k',
                ha='center', va='center', fontsize=9, color='white', fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=11)
    ax.set_ylabel('Revenue (£)', fontsize=11)
    ax.set_title('Revenue Growth Trajectory', fontsize=13, fontweight='bold', color='#003366')
    ax.legend(loc='upper left')
    ax.set_ylim(0, 10000)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    _save(fig, 'revenue_growth.png')


# Diagram 11: Channel Contribution
def _diagram_channel_contribution():
    fig, ax = plt.subplots(figsize=(8, 5))
    years = ['Year 1', 'Year 2', 'Year 3']
    channels = {
        'Direct Sales': ([60, 40, 25], '#003366'),
        'Azure Marketplace': ([20, 25, 30], '#0066B2'),
        'System Integrators': ([10, 20, 25], '#00994C'),
        'Microsoft Co-Sell': ([5, 10, 15], '#E8A317'),
        'Inbound/Content': ([5, 5, 5], '#999999'),
    }
    x = np.arange(len(years))
    w = 0.55
    bottom = np.zeros(len(years))
    for ch, (vals, col) in channels.items():
        bars = ax.bar(x, vals, w, bottom=bottom, label=ch, color=col)
        for bar, v in zip(bars, vals):
            if v >= 8:
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_y() + bar.get_height() / 2,
                        f'{v}%', ha='center', va='center', fontsize=8, color='white', fontweight='bold')
        bottom += np.array(vals)
    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=11)
    ax.set_ylabel('Contribution (%)', fontsize=11)
    ax.set_title('Channel Contribution by Year', fontsize=13, fontweight='bold', color='#003366')
    ax.legend(loc='upper right', fontsize=8, ncol=2)
    ax.set_ylim(0, 110)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    _save(fig, 'channel_contribution.png')


# Diagram 12: EBITDA Trajectory
def _diagram_ebitda_trajectory():
    fig, ax = plt.subplots(figsize=(8, 5))
    years = ['Year 1', 'Year 2', 'Year 3']
    ebitda = [50, 1734, 6980]
    margin = [9, 64, 78]
    x = np.arange(len(years))
    color_main = '#003366'
    ax.fill_between(x, ebitda, alpha=0.2, color=color_main)
    ax.plot(x, ebitda, 'o-', color=color_main, lw=2.5, markersize=10, label='EBITDA (£)')
    ax2 = ax.twinx()
    ax2.plot(x, margin, 's--', color='#00994C', lw=2, markersize=8, label='EBITDA Margin (%)')
    for i, (e, m) in enumerate(zip(ebitda, margin)):
        label = f'£{e/1000:.1f}M' if e >= 1000 else f'£{e}k'
        ax.annotate(label, (i, e), textcoords="offset points", xytext=(0, 12), ha='center', fontsize=10, fontweight='bold', color=color_main)
        ax2.annotate(f'{m}%', (i, m), textcoords="offset points", xytext=(0, -15), ha='center', fontsize=9, fontweight='bold', color='#00994C')
    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=11)
    ax.set_ylabel('EBITDA (£)', fontsize=11, color=color_main)
    ax2.set_ylabel('EBITDA Margin (%)', fontsize=11, color='#00994C')
    ax.set_title('EBITDA Trajectory', fontsize=13, fontweight='bold', color=color_main)
    ax.set_ylim(-500, 8000)
    ax2.set_ylim(-5, 100)
    ax.spines['top'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left', fontsize=9)
    _save(fig, 'ebitda_trajectory.png')


# Diagram 13: Use of Funds
def _diagram_use_of_funds():
    fig, ax = plt.subplots(figsize=(7, 7))
    labels = ['Product\nDevelopment\n40%', 'AI Mapping\nModule\n20%', 'Customer\nPilots\n20%', 'Security\nCertifications\n10%', 'Marketplace\nReadiness\n10%']
    sizes = [40, 20, 20, 10, 10]
    colors = ['#003366', '#0066B2', '#00994C', '#E8A317', '#6B2D8B']
    explode = (0.05, 0, 0, 0, 0)
    wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, explode=explode,
                                       autopct='', startangle=140, textprops={'fontsize': 10, 'fontweight': 'bold'})
    for t in texts:
        t.set_color('#333')
    ax.set_title('Use of Funds (£500k-£750k Seed)', fontsize=13, fontweight='bold', color='#003366', pad=15)
    _save(fig, 'use_of_funds.png')


# Diagram 14: Product Roadmap
def _diagram_product_roadmap():
    fig, ax = plt.subplots(figsize=(12, 3))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 3)
    ax.axis('off')
    phases = [
        ('MVP\nCLI Engine', '#2E8B57', 'Done'),
        ('Enterprise API\nREST + Dashboard', '#0066B2', 'In Progress'),
        ('AI-Assisted\nMigration', '#E8A317', 'Planned'),
        ('Multi-Tenant\nSaaS + Marketplace', '#6B2D8B', 'Planned'),
        ('Intelligent\nPlatform', '#CC3333', 'Vision'),
    ]
    bw, bh = 2.0, 1.6
    gap = 0.4
    x = 0.3
    for i, (lbl, col, status) in enumerate(phases):
        _box(ax, x, 0.7, bw, bh, lbl, color=col, fontsize=9)
        ax.text(x + bw / 2, 0.45, status, ha='center', va='center', fontsize=8, color=col, fontweight='bold')
        if i < len(phases) - 1:
            _arrow(ax, x + bw + 0.02, 1.5, x + bw + gap - 0.02, 1.5, color='#666')
        x += bw + gap
    ax.set_title('Product Roadmap', fontsize=13, fontweight='bold', color='#003366', pad=10)
    _save(fig, 'product_roadmap.png')


# Diagram 15: Architecture Evolution
def _diagram_architecture_evolution():
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    for ax in axes:
        ax.set_xlim(0, 5)
        ax.set_ylim(0, 5)
        ax.axis('off')
    # Current
    ax = axes[0]
    ax.set_title('Current (MVP)', fontsize=11, fontweight='bold', color='#003366', pad=8)
    _box(ax, 1.5, 4.0, 2, 0.6, 'CLI / FastAPI', color='#0066B2', fontsize=8)
    _arrow(ax, 2.5, 4.0, 2.5, 3.4)
    _box(ax, 1.2, 2.7, 2.6, 0.6, 'Platform Core', color='#003366', fontsize=8)
    _box(ax, 0.2, 1.5, 1.2, 0.6, 'Discovery', color='#0066B2', fontsize=7)
    _box(ax, 1.9, 1.5, 1.2, 0.6, 'Validation', color='#0066B2', fontsize=7)
    _box(ax, 3.5, 1.5, 1.2, 0.6, 'Scoring', color='#0066B2', fontsize=7)
    _arrow(ax, 2.5, 2.7, 2.5, 2.1)
    _box(ax, 1.5, 0.5, 2, 0.6, 'PostgreSQL', color='#333', fontsize=8)
    _arrow(ax, 2.5, 1.5, 2.5, 1.1)
    # Future
    ax = axes[1]
    ax.set_title('Future (Azure-Native SaaS)', fontsize=11, fontweight='bold', color='#00994C', pad=8)
    _box(ax, 1.5, 4.2, 2, 0.5, 'Web Portal + API', color='#4A90D9', fontsize=7)
    _arrow(ax, 2.5, 4.2, 2.5, 3.7)
    _box(ax, 1.2, 3.2, 2.6, 0.5, 'Azure Container Apps', color='#0066B2', fontsize=7)
    _box(ax, 0.5, 2.2, 1.2, 0.5, 'Discovery', color='#00994C', fontsize=6)
    _box(ax, 1.9, 2.2, 1.2, 0.5, 'Validation', color='#00994C', fontsize=6)
    _box(ax, 3.3, 2.2, 1.2, 0.5, 'Scoring', color='#00994C', fontsize=6)
    _box(ax, 0.5, 1.4, 1.2, 0.5, 'Governance', color='#00994C', fontsize=6)
    _box(ax, 1.9, 1.4, 1.2, 0.5, 'AI Module', color='#E8A317', fontsize=6)
    _box(ax, 3.3, 1.4, 1.2, 0.5, 'Reports', color='#00994C', fontsize=6)
    _box(ax, 1.2, 0.4, 2.6, 0.5, 'Azure SQL + Blob + Key Vault', color='#333', fontsize=7)
    _arrow(ax, 2.5, 3.2, 2.5, 2.7)
    _arrow(ax, 2.5, 1.4, 2.5, 0.9)
    fig.suptitle('Architecture Evolution', fontsize=13, fontweight='bold', color='#003366', y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.93])
    _save(fig, 'architecture_evolution.png')


# ══════════════════════════════════════════════════════════════════════════════
# Word document: styles
# ══════════════════════════════════════════════════════════════════════════════

def setup_styles(doc):
    """Configure all paragraph and character styles."""
    styles = doc.styles

    # Normal
    style = styles['Normal']
    style.font.name = 'Calibri'
    style.font.size = Pt(11)
    style.font.color.rgb = DARK_GRAY
    style.paragraph_format.space_after = Pt(6)
    style.paragraph_format.line_spacing = 1.15

    # Title (Heading 0)
    style = styles['Title']
    style.font.name = 'Calibri'
    style.font.size = Pt(28)
    style.font.color.rgb = DARK_BLUE
    style.font.bold = True
    style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    style.paragraph_format.space_after = Pt(12)

    # Heading 1
    style = styles['Heading 1']
    style.font.name = 'Calibri'
    style.font.size = Pt(18)
    style.font.color.rgb = DARK_BLUE
    style.font.bold = True
    style.paragraph_format.space_before = Pt(18)
    style.paragraph_format.space_after = Pt(8)

    # Heading 2
    style = styles['Heading 2']
    style.font.name = 'Calibri'
    style.font.size = Pt(14)
    style.font.color.rgb = MEDIUM_BLUE
    style.font.bold = True
    style.paragraph_format.space_before = Pt(14)
    style.paragraph_format.space_after = Pt(6)

    # Heading 3
    style = styles['Heading 3']
    style.font.name = 'Calibri'
    style.font.size = Pt(12)
    style.font.color.rgb = DARK_GRAY
    style.font.bold = True
    style.paragraph_format.space_before = Pt(10)
    style.paragraph_format.space_after = Pt(4)

    # Code Block style (Character + Paragraph)
    if 'CodeBlock' not in [s.name for s in styles]:
        cb_style = styles.add_style('CodeBlock', WD_STYLE_TYPE.PARAGRAPH)
        cb_style.font.name = 'Courier New'
        cb_style.font.size = Pt(9)
        cb_style.font.color.rgb = RGBColor(30, 30, 30)
        cb_style.paragraph_format.space_before = Pt(2)
        cb_style.paragraph_format.space_after = Pt(2)
        cb_style.paragraph_format.line_spacing = 1.0
        # background shading via XML
        pPr = cb_style.element.get_or_add_pPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:val="clear" w:color="auto" w:fill="{LIGHT_GRAY_BG}"/>')
        pPr.append(shd)

    # Table Header style
    if 'TableHeader' not in [s.name for s in styles]:
        th_style = styles.add_style('TableHeader', WD_STYLE_TYPE.PARAGRAPH)
        th_style.font.name = 'Calibri'
        th_style.font.size = Pt(10)
        th_style.font.color.rgb = RGBColor(255, 255, 255)
        th_style.font.bold = True
        th_style.paragraph_format.space_before = Pt(2)
        th_style.paragraph_format.space_after = Pt(2)

    # Caption
    if 'Caption2' not in [s.name for s in styles]:
        cap_style = styles.add_style('Caption2', WD_STYLE_TYPE.PARAGRAPH)
        cap_style.font.name = 'Calibri'
        cap_style.font.size = Pt(9)
        cap_style.font.color.rgb = RGBColor(128, 128, 128)
        cap_style.font.italic = True
        cap_style.paragraph_format.space_before = Pt(4)
        cap_style.paragraph_format.space_after = Pt(8)
        cap_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER


# ══════════════════════════════════════════════════════════════════════════════
# Word document: page setup, headers, footers
# ══════════════════════════════════════════════════════════════════════════════

def setup_page(doc):
    """Configure A4, margins, header, footer."""
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

    # Header
    header = section.header
    header.is_linked_to_previous = False
    htable = header.add_table(1, 2, Cm(16))
    htable.alignment = WD_TABLE_ALIGNMENT.CENTER
    left_cell = htable.cell(0, 0)
    right_cell = htable.cell(0, 1)
    left_para = left_cell.paragraphs[0]
    left_run = left_para.add_run("FS Migration Validation Engine")
    left_run.font.size = Pt(8)
    left_run.font.color.rgb = DARK_BLUE
    left_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
    right_para = right_cell.paragraphs[0]
    right_run = right_para.add_run("Microsoft Founders Hub Application")
    right_run.font.size = Pt(8)
    right_run.font.color.rgb = DARK_BLUE
    right_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    # Remove table borders in header
    for row in htable.rows:
        for cell in row.cells:
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            borders = parse_xml(
                f'<w:tcBorders {nsdecls("w")}>'
                '  <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
                '  <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
                '  <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
                '  <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
                '</w:tcBorders>'
            )
            tcPr.append(borders)

    # Footer with page number
    footer = section.footer
    footer.is_linked_to_previous = False
    fpara = footer.paragraphs[0]
    fpara.alignment = WD_ALIGN_PARAGRAPH.CENTER
    frun = fpara.add_run("Page ")
    frun.font.size = Pt(8)
    frun.font.color.rgb = DARK_GRAY
    # Insert PAGE field
    fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
    fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    run_el = fpara.add_run()._r
    run_el.append(fldChar1)
    run_el.append(instrText)
    run_el.append(fldChar2)


# ══════════════════════════════════════════════════════════════════════════════
# Cover page
# ══════════════════════════════════════════════════════════════════════════════

def create_cover_page(doc):
    # Spacer
    for _ in range(4):
        doc.add_paragraph("")

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("FS Migration Validation Engine")
    run.font.size = Pt(32)
    run.font.color.rgb = DARK_BLUE
    run.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Microsoft Founders Hub Application Pack")
    run.font.size = Pt(18)
    run.font.color.rgb = DARK_GRAY

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Technical Master Document")
    run.font.size = Pt(14)
    run.font.color.rgb = DARK_GRAY

    # Horizontal line
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        '  <w:bottom w:val="single" w:sz="12" w:space="1" w:color="003366"/>'
        '</w:pBdr>'
    )
    pPr.append(pBdr)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Version 2.0 — June 2026")
    run.font.size = Pt(12)
    run.font.color.rgb = DARK_GRAY

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("Status: Ready for Review")
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0, 128, 0)

    doc.add_page_break()


# ══════════════════════════════════════════════════════════════════════════════
# Table of Contents
# ══════════════════════════════════════════════════════════════════════════════

def create_toc(doc):
    doc.add_heading("Table of Contents", level=1)
    toc_items = [
        ("Phase 1", "Azure Founders Hub Pack (Overview)"),
        ("Phase 1.1", "Product Overview"),
        ("Phase 1.2", "Technical Architecture"),
        ("Phase 1.3", "Platform Core Definition"),
        ("Phase 1.4", "Azure Cloud Architecture"),
        ("Phase 1.5", "Azure Reference Architecture Diagram"),
        ("Phase 1.6", "Azure Founders Hub Technical Narrative"),
        ("Phase 2.1", "Executive Pitch Narrative"),
        ("Phase 2.2", "Investor Pitch Deck"),
        ("Phase 2.3", "Market Analysis — TAM / SAM / SOM"),
        ("Phase 2.4", "Business Model & Pricing Strategy"),
        ("Phase 2.5", "Go-to-Market Strategy & Financial Projections"),
        ("Phase 2.6", "Financial Model & Funding Strategy"),
        ("Phase 2.7", "Competitive Differentiation"),
        ("Phase 2.8", "Product Roadmap"),
        ("Phase 2.9", "Investor FAQ"),
        ("Phase 2.10", "Demo Script"),
    ]
    for num, title in toc_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.tab_stops.add_tab_stop(Cm(16.0))
        run_num = p.add_run(f"{num}")
        run_num.font.size = Pt(11)
        run_num.font.color.rgb = DARK_BLUE
        run_num.bold = True
        run_dot = p.add_run(f"    {'.' * 60}    ")
        run_dot.font.size = Pt(9)
        run_dot.font.color.rgb = RGBColor(180, 180, 180)
        run_title = p.add_run(title)
        run_title.font.size = Pt(11)
        run_title.font.color.rgb = DARK_GRAY

    doc.add_page_break()


# ══════════════════════════════════════════════════════════════════════════════
# Markdown → Word conversion
# ══════════════════════════════════════════════════════════════════════════════

def add_horizontal_rule(doc):
    """Add a horizontal line."""
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        '  <w:bottom w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/>'
        '</w:pBdr>'
    )
    pPr.append(pBdr)


def add_table_to_doc(doc, header_row, body_rows):
    """Add a professionally formatted table."""
    cols = len(header_row)
    rows = 1 + len(body_rows)
    table = doc.add_table(rows=rows, cols=cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'

    def _sanitize(text):
        return text.replace('\u2705', '[OK]').replace('\u274C', '[X]').replace('\u26A0', '[!]').replace('\u2699', '[*]')

    # Header row
    for j, hdr in enumerate(header_row):
        cell = table.cell(0, j)
        set_cell_shading(cell, TABLE_HEADER_BG)
        set_cell_margins(cell)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(_sanitize(hdr.strip().replace('**', '')))
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(255, 255, 255)
        run.font.bold = True

    # Body rows
    for i, row_data in enumerate(body_rows):
        bg = TABLE_ALT_BG if i % 2 == 1 else "FFFFFF"
        for j, cell_text in enumerate(row_data):
            if j >= cols:
                break
            cell = table.cell(i + 1, j)
            set_cell_shading(cell, bg)
            set_cell_margins(cell)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            # Strip markdown bold markers
            clean = _sanitize(cell_text.strip().replace('**', ''))
            run = p.add_run(clean)
            run.font.size = Pt(10)
            run.font.color.rgb = DARK_GRAY

    doc.add_paragraph("")  # spacer


def add_code_block(doc, code_text):
    """Add a code block with grey background."""
    for line in code_text.split('\n'):
        p = doc.add_paragraph(style='CodeBlock')
        run = p.add_run(line)
        run.font.name = 'Courier New'
        run.font.size = Pt(9)
    doc.add_paragraph("")  # spacer


def add_rich_text(doc, text, base_style='Normal'):
    """Add a paragraph with inline formatting (bold, code, italic)."""
    p = doc.add_paragraph(style=base_style)
    # Replace unsupported Unicode chars
    text = text.replace('\u2705', '[OK]').replace('\u274C', '[X]').replace('\u26A0', '[!]')
    text = text.replace('\U0001F504', '[~]')
    # Process inline formatting: **bold**, `code`, *italic*, ~~strike~~
    # We'll split by patterns and add runs accordingly
    parts = re.split(r'(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)', text)
    for part in parts:
        if not part:
            continue
        if part.startswith('**') and part.endswith('**'):
            run = p.add_run(part[2:-2])
            run.bold = True
        elif part.startswith('`') and part.endswith('`'):
            run = p.add_run(part[1:-1])
            run.font.name = 'Courier New'
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(150, 0, 0)
        elif part.startswith('*') and part.endswith('*') and not part.startswith('**'):
            run = p.add_run(part[1:-1])
            run.italic = True
        else:
            run = p.add_run(part)
    return p


def parse_markdown_to_docx(doc, content, phase_key=None):
    """Parse markdown content and add to the Word document."""
    lines = content.split('\n')
    i = 0
    in_code_block = False
    code_buffer = []
    in_blockquote = False
    blockquote_buffer = []
    in_table = False
    table_header = []
    table_rows = []

    while i < len(lines):
        line = lines[i]

        # ── Code block (fenced) ──
        if line.strip().startswith('```') or line.strip().startswith('~~~'):
            if in_code_block:
                # End code block
                add_code_block(doc, '\n'.join(code_buffer))
                code_buffer = []
                in_code_block = False
            else:
                # Flush any pending table
                if in_table:
                    add_table_to_doc(doc, table_header, table_rows)
                    table_header = []
                    table_rows = []
                    in_table = False
                # Flush any pending blockquote
                if in_blockquote:
                    for bq in blockquote_buffer:
                        p = doc.add_paragraph(style='Normal')
                        p.paragraph_format.left_indent = Cm(1.0)
                        run = p.add_run(bq)
                        run.italic = True
                        run.font.color.rgb = RGBColor(80, 80, 80)
                    blockquote_buffer = []
                    in_blockquote = False
                in_code_block = True
            i += 1
            continue

        if in_code_block:
            code_buffer.append(line)
            i += 1
            continue

        stripped = line.strip()

        # ── Empty line ──
        if not stripped:
            if in_blockquote:
                for bq in blockquote_buffer:
                    p = doc.add_paragraph(style='Normal')
                    p.paragraph_format.left_indent = Cm(1.0)
                    run = p.add_run(bq)
                    run.italic = True
                    run.font.color.rgb = RGBColor(80, 80, 80)
                blockquote_buffer = []
                in_blockquote = False
            if in_table:
                # Check if this is truly end of table or just a gap within a table
                # Look ahead to see if next line is also a table row
                look_ahead = i + 1
                while look_ahead < len(lines) and not lines[look_ahead].strip():
                    look_ahead += 1
                if look_ahead < len(lines) and lines[look_ahead].strip().startswith('|'):
                    i += 1
                    continue
                add_table_to_doc(doc, table_header, table_rows)
                table_header = []
                table_rows = []
                in_table = False
            i += 1
            continue

        # ── Horizontal rule ──
        if re.match(r'^-{3,}$', stripped) or re.match(r'^\*{3,}$', stripped):
            if in_table:
                add_table_to_doc(doc, table_header, table_rows)
                table_header = []
                table_rows = []
                in_table = False
            add_horizontal_rule(doc)
            i += 1
            continue

        # ── Heading ──
        heading_match = re.match(r'^(#{1,6})\s+(.*)', stripped)
        if heading_match:
            if in_table:
                add_table_to_doc(doc, table_header, table_rows)
                table_header = []
                table_rows = []
                in_table = False
            level = len(heading_match.group(1))
            text = heading_match.group(2).strip()
            # Remove markdown formatting from heading text
            clean_text = text.replace('**', '').replace('*', '').replace('`', '')
            if level == 1:
                doc.add_heading(clean_text, level=1)
            elif level == 2:
                doc.add_heading(clean_text, level=2)
            else:
                doc.add_heading(clean_text, level=min(level, 3))
            i += 1
            continue

        # ── Blockquote ──
        if stripped.startswith('>'):
            bq_text = stripped.lstrip('> ').strip()
            bq_text = bq_text.replace('\u2705', '[OK]').replace('\u274C', '[X]').replace('\u26A0', '[!]')
            in_blockquote = True
            blockquote_buffer.append(bq_text)
            i += 1
            continue

        # ── Table row ──
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            # Skip separator rows (e.g. |---|---|)
            if all(re.match(r'^[-:]+$', c) for c in cells):
                i += 1
                continue
            if not in_table:
                in_table = True
                table_header = cells
            else:
                table_rows.append(cells)
            i += 1
            continue

        # ── Flush pending table if we're here ──
        if in_table:
            add_table_to_doc(doc, table_header, table_rows)
            table_header = []
            table_rows = []
            in_table = False

        # ── Bullet list ──
        bullet_match = re.match(r'^[\-\*\+]\s+(.*)', stripped)
        if bullet_match:
            text = bullet_match.group(1)
            text = text.replace('\u2705', '[OK]').replace('\u274C', '[X]').replace('\u26A0', '[!]')
            p = doc.add_paragraph(style='List Bullet')
            # Parse inline formatting
            parts = re.split(r'(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)', text)
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    run = p.add_run(part[1:-1])
                    run.font.name = 'Courier New'
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(150, 0, 0)
                elif part.startswith('*') and part.endswith('*') and not part.startswith('**'):
                    run = p.add_run(part[1:-1])
                    run.italic = True
                else:
                    run = p.add_run(part)
            i += 1
            continue

        # ── Numbered list ──
        num_match = re.match(r'^\d+[\.\)]\s+(.*)', stripped)
        if num_match:
            text = num_match.group(1)
            p = doc.add_paragraph(style='List Number')
            parts = re.split(r'(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)', text)
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    run = p.add_run(part[1:-1])
                    run.font.name = 'Courier New'
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(150, 0, 0)
                else:
                    run = p.add_run(part)
            i += 1
            continue

        # ── Regular text ──
        add_rich_text(doc, stripped)
        i += 1

    # Flush any remaining state
    if in_code_block and code_buffer:
        add_code_block(doc, '\n'.join(code_buffer))
    if in_table:
        add_table_to_doc(doc, table_header, table_rows)
    if in_blockquote:
        for bq in blockquote_buffer:
            p = doc.add_paragraph(style='Normal')
            p.paragraph_format.left_indent = Cm(1.0)
            run = p.add_run(bq)
            run.italic = True
            run.font.color.rgb = RGBColor(80, 80, 80)


# ══════════════════════════════════════════════════════════════════════════════
# Insert diagrams at correct positions
# ══════════════════════════════════════════════════════════════════════════════

DIAGRAM_MAP = {
    "Phase 1 – Azure Founders Hub Pack.md": ["five_pillars.png"],
    "Phase 1.1 Product Overview.md": ["how_it_works.png"],
    "Phase 1.2 Technical Architecture.md": ["platform_architecture.png", "architecture_evolution.png"],
    "Phase 1.3 – Platform Core Definition.md": ["control_dag.png"],
    "Phase 1.4 Azure Cloud Architecture.md": ["azure_architecture.png", "cicd_pipeline.png"],
    "Phase 1.6 Azure Founders Hub Technical Narrative.md": [],
    "Phase 2.1 Executive Pitch Narrative.md": ["business_flow.png"],
    "Phase 2.2 Investor Pitch Deck.md": [],
    "Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md": ["tam_sam_som.png", "competitive_positioning.png"],
    "Phase 2.4 Business Model and Pricing Strategy.md": [],
    "Phase 2.5 Go-to-Market Strategy and Financial Projections.md": ["revenue_growth.png", "channel_contribution.png"],
    "Phase 2.6 Financial Model and Funding Strategy.md": ["ebitda_trajectory.png", "use_of_funds.png"],
    "Phase 2.7 Competitive Differentiation.md": [],
    "Phase 2.8 Product Roadmap.md": ["product_roadmap.png"],
    "Phase 2.9 Investor FAQ.md": [],
    "Phase 2.10 Demo Script.md": [],
}


def insert_diagrams(doc, phase_file):
    """Insert diagrams after the first heading of the phase, or at end."""
    diagrams = DIAGRAM_MAP.get(phase_file, [])
    for diag_name in diagrams:
        diag_path = os.path.join(DIAGRAMS_DIR, diag_name)
        if os.path.exists(diag_path):
            doc.add_picture(diag_path, width=Inches(5.8))
            last_para = doc.paragraphs[-1]
            last_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            # Add caption
            cap = doc.add_paragraph(style='Caption2')
            cap_text = diag_name.replace('.png', '').replace('_', ' ').title()
            cap.add_run(cap_text)


# ══════════════════════════════════════════════════════════════════════════════
# Main
# ══════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 70)
    print("FS Migration Validation Engine — Master Document Generator")
    print("=" * 70)

    # 1. Generate diagrams
    print("\n[1/4] Generating diagrams...")
    generate_diagrams()

    # 2. Create Word document
    print("[2/4] Creating Word document...")
    doc = Document()
    setup_styles(doc)
    setup_page(doc)

    # 3. Cover page + TOC
    create_cover_page(doc)
    create_toc(doc)

    # 4. Process each phase file
    print("[3/4] Processing phase files...")
    for phase_file in PHASE_FILES:
        file_path = os.path.join(SOURCE_DIR, phase_file)
        if not os.path.exists(file_path):
            print(f"  WARNING: File not found: {phase_file}")
            continue
        print(f"  Processing: {phase_file}")
        doc.add_page_break()
        content = read_markdown(file_path)
        parse_markdown_to_docx(doc, content, phase_key=phase_file)
        insert_diagrams(doc, phase_file)

    # 5. Save Word document
    print(f"\n[4/4] Saving Word document...")
    doc.save(DOCX_PATH)
    print(f"  Word: {DOCX_PATH}")

    # 6. Convert to PDF
    print("  Converting to PDF...")
    try:
        convert(DOCX_PATH, PDF_PATH)
        print(f"  PDF:  {PDF_PATH}")
    except Exception as e:
        print(f"  PDF conversion failed: {e}")
        print("  (You can convert manually using Word or LibreOffice)")

    print("\n" + "=" * 70)
    print("DONE!")
    print(f"  Word: {DOCX_PATH}")
    print(f"  PDF:  {PDF_PATH}")
    print("=" * 70)


if __name__ == "__main__":
    main()
