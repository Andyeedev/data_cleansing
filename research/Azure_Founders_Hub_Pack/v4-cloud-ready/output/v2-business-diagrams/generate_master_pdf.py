#!/usr/bin/env python3
"""
FS Migration Validation Engine - Master PDF Generator
Generates a professional PDF document combining 17 markdown files
with visual diagrams using fpdf2.
"""

import os
import sys
import textwrap
import warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
from fpdf import FPDF

# ============================================================================
# CONFIGURATION
# ============================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_DIR = os.path.normpath(os.path.join(BASE_DIR, '..', '..'))
OUTPUT_PDF = os.path.join(BASE_DIR, 'FS_Migration_Validation_Engine_Founders_Hub_Master.pdf')

# Colour palette
DARK_BLUE = (0, 51, 102)
MEDIUM_BLUE = (0, 102, 178)
LIGHT_BLUE = (0, 153, 204)
GREEN = (0, 153, 76)
ORANGE = (204, 153, 0)
GRAY = (128, 128, 128)
LIGHT_GRAY = (220, 220, 220)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
LIGHT_GREEN = (200, 235, 210)
LIGHT_BLUE_BG = (220, 235, 250)
LIGHT_ORANGE = (255, 240, 210)
LIGHT_RED = (255, 220, 220)

# Page dimensions
PAGE_W = 210
PAGE_H = 297
MARGIN_L = 20
MARGIN_R = 20
MARGIN_T = 25
MARGIN_B = 25
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R


def find_file(name_pattern):
    """Find a file in the source directory matching the pattern."""
    for f in os.listdir(SOURCE_DIR):
        if name_pattern.lower() in f.lower():
            return os.path.join(SOURCE_DIR, f)
    return None


def read_md_file(name_pattern):
    """Read a markdown file and return its content as plain text."""
    path = find_file(name_pattern)
    if path is None:
        return f"[File not found: {name_pattern}]"
    with open(path, 'r', encoding='utf-8', errors='replace') as fh:
        return fh.read()


def sanitize_text(text):
    """Replace unicode characters that Helvetica (latin-1) cannot handle."""
    replacements = {
        '\u2013': '-',   # en-dash
        '\u2014': '--',  # em-dash
        '\u2018': "'",   # left single quote
        '\u2019': "'",   # right single quote
        '\u201c': '"',   # left double quote
        '\u201d': '"',   # right double quote
        '\u2022': '-',   # bullet
        '\u2026': '...',  # ellipsis
        '\u2019': "'",   # right single quote
        '\u00a0': ' ',   # non-breaking space
        '\u00e2': '-',   # fallback
        '\u2023': '-',   # triangular bullet
        '\u25cf': '*',   # filled circle
        '\u25cb': 'o',   # open circle
        '\u2610': '[ ]', # ballot box
        '\u2611': '[x]', # ballot box with check
        '\u2612': '[x]', # ballot box with x
        '\u2713': '+',   # checkmark
        '\u2717': '-',   # cross
        '\u2714': '+',   # heavy checkmark
        '\u2718': '-',   # heavy cross
        '\u00d7': 'x',   # multiplication sign
        '\u00f7': '/',   # division sign
        '\u2032': "'",   # prime
        '\u2033': '"',   # double prime
        '\u00b0': ' deg', # degree
        '\u00ae': '(R)', # registered
        '\u2122': '(TM)', # trademark
        '\u00a9': '(C)', # copyright
        '\u25a0': '[ ]', # black square
        '\u25a1': '[ ]', # white square
        '\u25b2': '^',   # black up triangle
        '\u25bc': 'v',   # black down triangle
        '\u25c6': '*',   # black diamond
        '\u2010': '-',   # hyphen
        '\u2011': '-',   # non-breaking hyphen
        '\u2012': '-',   # figure dash
    }
    result = []
    for ch in text:
        if ch in replacements:
            result.append(replacements[ch])
        elif ord(ch) < 256:
            result.append(ch)
        else:
            result.append('?')
    return ''.join(result)


def clean_md(text):
    """Basic markdown-to-plaintext conversion for PDF rendering."""
    lines = text.split('\n')
    result = []
    in_table = False
    for line in lines:
        stripped = line.strip()
        # Skip HTML-like tags
        if stripped.startswith('<') and stripped.endswith('>'):
            continue
        # Headers -> bold
        if stripped.startswith('#'):
            level = 0
            for ch in stripped:
                if ch == '#':
                    level += 1
                else:
                    break
            heading = stripped[level:].strip()
            if heading:
                result.append('')
                result.append(f'==HEADING{level}=={heading}')
                result.append('')
            continue
        # Horizontal rules
        if stripped == '---' or stripped == '***' or stripped == '___':
            result.append('')
            continue
        # Table separator rows
        if stripped.startswith('|') and set(stripped.replace('|', '').replace('-', '').replace(':', '').replace(' ', '')) == set():
            continue
        # Table rows
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if not in_table:
                in_table = True
            result.append(' | '.join(cells))
            continue
        else:
            in_table = False
        # Bold/italic markers removal
        clean = stripped
        clean = clean.replace('**', '')
        clean = clean.replace('__', '')
        clean = clean.replace('*', '')
        clean = clean.replace('_', '')
        # Inline code
        clean = clean.replace('`', '')
        # Sanitize unicode
        clean = sanitize_text(clean)
        if clean:
            result.append(clean)
        elif result and result[-1] != '':
            result.append('')
    return '\n'.join(result)


def sanitize_for_pdf(text):
    """Replace unicode characters that core fonts cannot handle."""
    replacements = {
        '\u2013': '-', '\u2014': '--', '\u2018': "'", '\u2019': "'",
        '\u201c': '"', '\u201d': '"', '\u2022': '-', '\u2026': '...',
        '\u00a0': ' ', '\u2023': '-', '\u25cf': '*', '\u25cb': 'o',
        '\u2610': '[ ]', '\u2611': '[x]', '\u2612': '[x]',
        '\u2713': '+', '\u2717': '-', '\u2714': '+', '\u2718': '-',
        '\u00d7': 'x', '\u00f7': '/', '\u2032': "'", '\u2033': '"',
        '\u00b0': ' deg', '\u00ae': '(R)', '\u2122': '(TM)', '\u00a9': '(C)',
        '\u25a0': '[ ]', '\u25a1': '[ ]', '\u25b2': '^', '\u25bc': 'v',
        '\u25c6': '*', '\u2010': '-', '\u2011': '-', '\u2012': '-',
    }
    result = []
    for ch in text:
        if ch in replacements:
            result.append(replacements[ch])
        elif ord(ch) < 256:
            result.append(ch)
        else:
            result.append('?')
    return ''.join(result)


FONT_DIR = r'C:\Windows\Fonts'


class MasterPDF(FPDF):
    """Custom PDF class with headers and footers."""

    def __init__(self):
        super().__init__()
        self.phase_title = ''
        self.is_cover = False
        self.page_count_start = 0
        self._setup_fonts()

    def _setup_fonts(self):
        """Register Unicode TTF fonts."""
        regular = os.path.join(FONT_DIR, 'arial.ttf')
        bold = os.path.join(FONT_DIR, 'arialbd.ttf')
        italic = os.path.join(FONT_DIR, 'ariali.ttf')
        if not os.path.exists(italic):
            italic = regular
        if os.path.exists(regular) and os.path.exists(bold):
            self.add_font('Arial', '', regular, uni=True)
            self.add_font('Arial', 'B', bold, uni=True)
            self.add_font('Arial', 'I', italic, uni=True)
            self.add_font('Arial', 'BI', bold, uni=True)

    def normalize_text(self, text):
        """Override to ensure all text is sanitized."""
        text = sanitize_for_pdf(text)
        return super().normalize_text(text)

    def header(self):
        if self.is_cover:
            return
        if self.page_no() <= 1:
            return
        self.set_font('Arial', 'I', 8)
        self.set_text_color(*GRAY)
        self.cell(0, 8, 'FS Migration Validation Engine  |  Microsoft Founders Hub Application Pack  |  Version 2.0', 0, 0, 'L')
        self.cell(0, 8, f'Page {self.page_no()}', 0, 1, 'R')
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.3)
        self.line(MARGIN_L, 15, PAGE_W - MARGIN_R, 15)
        self.ln(5)

    def footer(self):
        if self.is_cover:
            return
        if self.page_no() <= 1:
            return
        self.set_y(-18)
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.3)
        self.line(MARGIN_L, PAGE_H - MARGIN_B, PAGE_W - MARGIN_R, PAGE_H - MARGIN_B)
        self.set_font('Arial', 'I', 7)
        self.set_text_color(*GRAY)
        self.cell(0, 10, 'Confidential  |  FS Migration Validation Engine  |  June 2026', 0, 0, 'C')

    def add_title_section(self, text, level=1):
        """Render a section title."""
        if level == 1:
            self.set_font('Arial', 'B', 16)
            self.set_text_color(*DARK_BLUE)
            self.ln(3)
            self.multi_cell(CONTENT_W, 9, text)
            self.set_draw_color(*DARK_BLUE)
            self.set_line_width(0.5)
            self.line(MARGIN_L, self.get_y() + 1, MARGIN_L + 60, self.get_y() + 1)
            self.ln(4)
        elif level == 2:
            self.set_font('Arial', 'B', 13)
            self.set_text_color(*MEDIUM_BLUE)
            self.ln(2)
            self.multi_cell(CONTENT_W, 8, text)
            self.ln(2)
        elif level == 3:
            self.set_font('Arial', 'B', 11)
            self.set_text_color(*DARK_BLUE)
            self.ln(1)
            self.multi_cell(CONTENT_W, 7, text)
            self.ln(1)
        elif level == 4:
            self.set_font('Arial', 'B', 10)
            self.set_text_color(*MEDIUM_BLUE)
            self.multi_cell(CONTENT_W, 7, text)
            self.ln(1)

    def add_body_text(self, text):
        """Render body text."""
        self.set_font('Arial', '', 9.5)
        self.set_text_color(40, 40, 40)
        self.multi_cell(CONTENT_W, 5.5, text)
        self.ln(1)

    def add_table_row(self, cells, bold=False, header=False, col_widths=None):
        """Render a table row."""
        if col_widths is None:
            col_widths = [CONTENT_W / len(cells)] * len(cells)
        row_h = 7
        if header:
            self.set_font('Arial', 'B', 8.5)
            self.set_fill_color(*DARK_BLUE)
            self.set_text_color(*WHITE)
        elif bold:
            self.set_font('Arial', 'B', 8.5)
            self.set_fill_color(*LIGHT_GRAY)
            self.set_text_color(40, 40, 40)
        else:
            self.set_font('Arial', '', 8.5)
            self.set_fill_color(245, 248, 252)
            self.set_text_color(40, 40, 40)
        max_lines = 1
        for i, cell in enumerate(cells):
            lines = self.multi_cell(col_widths[i], row_h, str(cell), border=0, split_only=True)
            max_lines = max(max_lines, len(lines))
        actual_h = row_h * max_lines
        x_start = self.get_x()
        y_start = self.get_y()
        for i, cell in enumerate(cells):
            self.set_xy(x_start + sum(col_widths[:i]), y_start)
            self.set_font('Arial', 'B' if (header or bold) else '', 8.5)
            if header:
                self.set_fill_color(*DARK_BLUE)
                self.set_text_color(*WHITE)
            elif bold:
                self.set_fill_color(*LIGHT_GRAY)
                self.set_text_color(40, 40, 40)
            else:
                self.set_fill_color(245, 248, 252)
                self.set_text_color(40, 40, 40)
            self.multi_cell(col_widths[i], row_h, str(cell), border=1, fill=True)
        self.set_y(y_start + actual_h)

    def add_caption(self, text):
        """Add italic caption below a diagram."""
        self.ln(2)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(*GRAY)
        self.multi_cell(CONTENT_W, 5, text)
        self.ln(3)

    def check_page_space(self, needed=40):
        """Check if enough space on current page, add new page if not."""
        if self.get_y() + needed > PAGE_H - MARGIN_B:
            self.add_page()


# ============================================================================
# DIAGRAM DRAWING FUNCTIONS
# ============================================================================

def draw_box(pdf, x, y, w, h, text, fill_color=DARK_BLUE, text_color=WHITE, font_size=7):
    """Draw a rounded rectangle box with centered text."""
    pdf.set_fill_color(*fill_color)
    pdf.set_draw_color(*fill_color)
    pdf.set_line_width(0.3)
    pdf.rect(x, y, w, h, 'FD')
    pdf.set_text_color(*text_color)
    pdf.set_font('Arial', 'B', font_size)
    lines = text.split('\n')
    line_h = font_size * 0.45
    total_h = len(lines) * line_h
    start_y = y + (h - total_h) / 2
    for i, line in enumerate(lines):
        pdf.set_xy(x, start_y + i * line_h)
        pdf.cell(w, line_h, line, 0, 0, 'C')


def draw_arrow(pdf, x1, y1, x2, y2, color=GRAY):
    """Draw an arrow from (x1,y1) to (x2,y2)."""
    pdf.set_draw_color(*color)
    pdf.set_line_width(0.8)
    pdf.line(x1, y1, x2, y2)
    # Arrowhead
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    arrow_len = 3
    pdf.line(x2, y2,
             x2 - arrow_len * math.cos(angle - 0.4),
             y2 - arrow_len * math.sin(angle - 0.4))
    pdf.line(x2, y2,
             x2 - arrow_len * math.cos(angle + 0.4),
             y2 - arrow_len * math.sin(angle + 0.4))


def draw_circle_label(pdf, cx, cy, r, fill_color, text, font_size=9):
    """Draw a filled circle with text."""
    pdf.set_fill_color(*fill_color)
    pdf.set_draw_color(*fill_color)
    pdf.set_line_width(0.3)
    pdf.circle(cx, cy, r, 'FD')
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('Arial', 'B', font_size)
    pdf.set_xy(cx - r, cy - font_size * 0.2)
    pdf.cell(r * 2, font_size, text, 0, 0, 'C')


# ============================================================================
# DIAGRAM 1: How It Works Flow (Phase 1.1)
# ============================================================================

def draw_diagram1(pdf):
    """6-box flowchart: Legacy System -> Discovery -> 10 Validation Controls -> Scoring -> Release Gate -> Audit Report"""
    pdf.ln(3)
    y = pdf.get_y()
    total_w = CONTENT_W
    box_w = 28
    box_h = 18
    gap = 5
    arrow_color = GRAY

    labels = [
        ('Legacy\nSystem', DARK_BLUE),
        ('Discovery', DARK_BLUE),
        ('10 Validation\nControls', DARK_BLUE),
        ('Scoring', DARK_BLUE),
        ('Release\nGate', GREEN),
        ('Audit\nReport', DARK_BLUE),
    ]

    start_x = MARGIN_L + (total_w - (len(labels) * box_w + (len(labels) - 1) * gap)) / 2

    for i, (label, color) in enumerate(labels):
        x = start_x + i * (box_w + gap)
        draw_box(pdf, x, y, box_w, box_h, label, fill_color=color, font_size=7)
        if i < len(labels) - 1:
            draw_arrow(pdf, x + box_w + 0.5, y + box_h / 2,
                       x + box_w + gap - 0.5, y + box_h / 2, color=arrow_color)

    pdf.set_y(y + box_h + 5)
    pdf.add_caption('Figure 1: How It Works - Simplified validation flow from legacy system to audit report.')


# ============================================================================
# DIAGRAM 2: How It Works - Executive Version (Phase 2.1)
# ============================================================================

def draw_diagram2(pdf):
    """4-box flow: Discover -> Validate -> Score -> Govern"""
    pdf.ln(3)
    y = pdf.get_y()
    box_w = 38
    box_h = 24
    gap = 10

    labels = [
        ('Discover', 'Schema Discovery', DARK_BLUE),
        ('Validate', '10 Controls', MEDIUM_BLUE),
        ('Score', 'Objective Metrics', MEDIUM_BLUE),
        ('Govern', 'Release Gates\n& Audit', GREEN),
    ]

    total = len(labels) * box_w + (len(labels) - 1) * gap
    start_x = MARGIN_L + (CONTENT_W - total) / 2

    for i, (title, sub, color) in enumerate(labels):
        x = start_x + i * (box_w + gap)
        draw_box(pdf, x, y, box_w, box_h, title, fill_color=color, font_size=10)
        pdf.set_font('Arial', 'I', 7)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(x, y + box_h + 1)
        pdf.cell(box_w, 5, sub, 0, 1, 'C')
        if i < len(labels) - 1:
            draw_arrow(pdf, x + box_w + 0.5, y + box_h / 2,
                       x + box_w + gap - 0.5, y + box_h / 2, color=GRAY)

    pdf.set_y(y + box_h + 10)
    pdf.add_caption('Figure 2: Executive view - Four-stage automated validation workflow.')


# ============================================================================
# DIAGRAM 3: TAM/SAM/SOM Concentric Circles (Phase 2.3)
# ============================================================================

def draw_diagram3(pdf):
    """Three concentric circles for TAM/SAM/SOM."""
    pdf.ln(3)
    cx = MARGIN_L + CONTENT_W / 2
    cy = pdf.get_y() + 55
    r_tam = 50
    r_sam = 35
    r_som = 18

    # TAM - outer
    pdf.set_fill_color(*LIGHT_BLUE_BG)
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1.0)
    pdf.circle(cx, cy, r_tam, 'FD')
    pdf.set_font('Arial', 'B', 11)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_xy(cx - r_tam, cy - r_tam + 4)
    pdf.cell(r_tam * 2, 7, '$8-12B TAM', 0, 1, 'C')
    pdf.set_font('Arial', '', 7)
    pdf.set_xy(cx - r_tam, cy - r_tam + 11)
    pdf.cell(r_tam * 2, 5, 'Global FS Data Migration + RegTech', 0, 1, 'C')

    # SAM - middle
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.set_draw_color(*MEDIUM_BLUE)
    pdf.set_line_width(0.8)
    pdf.circle(cx, cy, r_sam, 'FD')
    pdf.set_text_color(WHITE)
    pdf.set_font('Arial', 'B', 10)
    pdf.set_xy(cx - r_sam, cy - 4)
    pdf.cell(r_sam * 2, 7, '$1.5-2.5B SAM', 0, 1, 'C')
    pdf.set_font('Arial', '', 6.5)
    pdf.set_xy(cx - r_sam, cy + 3)
    pdf.cell(r_sam * 2, 5, 'Azure-Centric FSI Organisations', 0, 1, 'C')

    # SOM - inner
    pdf.set_fill_color(*GREEN)
    pdf.set_draw_color(*GREEN)
    pdf.set_line_width(0.6)
    pdf.circle(cx, cy, r_som, 'FD')
    pdf.set_text_color(WHITE)
    pdf.set_font('Arial', 'B', 8)
    pdf.set_xy(cx - r_som, cy - 4)
    pdf.cell(r_som * 2, 6, '$10-30M', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 6)
    pdf.set_xy(cx - r_som, cy + 2)
    pdf.cell(r_som * 2, 5, 'SOM', 0, 1, 'C')

    pdf.set_y(cy + r_tam + 5)
    pdf.add_caption('Figure 3: TAM/SAM/SOM market sizing - Total Addressable, Serviceable Available, and Serviceable Obtainable Market.')


# ============================================================================
# DIAGRAM 4: Competitive Positioning Quadrant (Phase 2.3)
# ============================================================================

def draw_diagram4(pdf):
    """2x2 competitive positioning quadrant."""
    pdf.ln(3)
    chart_x = MARGIN_L + 30
    chart_y = pdf.get_y() + 5
    chart_w = 100
    chart_h = 70

    # Axes
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(0.8)
    pdf.line(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h)  # X axis
    pdf.line(chart_x, chart_y, chart_x, chart_y + chart_h)  # Y axis

    # Axis labels
    pdf.set_font('Arial', 'B', 8)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_xy(chart_x, chart_y + chart_h + 3)
    pdf.cell(chart_w, 5, 'Migration Focus (Low -> High)', 0, 0, 'C')

    pdf.set_xy(chart_x - 28, chart_y + chart_h / 2 - 15)
    pdf.cell(25, 30, 'Governance\nCapability\n(Low -> High)', 0, 1, 'C')

    # Quadrant dividers (dashed effect via lighter lines)
    pdf.set_draw_color(*LIGHT_GRAY)
    pdf.set_line_width(0.3)
    pdf.line(chart_x + chart_w / 2, chart_y, chart_x + chart_w / 2, chart_y + chart_h)
    pdf.line(chart_x, chart_y + chart_h / 2, chart_x + chart_w, chart_y + chart_h / 2)

    # Plot points
    points = [
        (chart_x + chart_w * 0.85, chart_y + chart_h * 0.15, GREEN, 'Our Platform', 'Purpose-Built\nMigration Assurance'),
        (chart_x + chart_w * 0.75, chart_y + chart_h * 0.80, ORANGE, 'ETL Testing Tools', 'Generic Testing'),
        (chart_x + chart_w * 0.20, chart_y + chart_h * 0.25, GRAY, 'Data Quality', 'Broad Data Quality\nPlatforms'),
        (chart_x + chart_w * 0.25, chart_y + chart_h * 0.85, (180, 60, 60), 'Manual', 'Spreadsheets\n& Scripts'),
    ]

    for px, py, color, label, desc in points:
        pdf.set_fill_color(*color)
        pdf.set_draw_color(255, 255, 255)
        pdf.set_line_width(0.5)
        pdf.circle(px, py, 5, 'FD')
        pdf.set_text_color(*color)
        pdf.set_font('Arial', 'B', 7)
        pdf.set_xy(px + 6, py - 4)
        pdf.cell(30, 4, label)
        pdf.set_font('Arial', '', 6)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(px + 6, py)
        pdf.cell(30, 8, desc)

    pdf.set_y(chart_y + chart_h + 20)
    pdf.add_caption('Figure 4: Competitive positioning - Our platform uniquely combines migration focus with governance capability.')


# ============================================================================
# DIAGRAM 5: Revenue Growth Bar Chart (Phase 2.5)
# ============================================================================

def draw_diagram5(pdf):
    """3-year revenue bar chart."""
    pdf.ln(3)
    chart_x = MARGIN_L + 25
    chart_y = pdf.get_y() + 8
    chart_w = 120
    chart_h = 65

    data = [
        ('Year 1', 450, 100, '£550k'),
        ('Year 2', 2400, 300, '£2.7M'),
        ('Year 3', 8400, 500, '£8.9M'),
    ]
    max_val = 8900

    # Y-axis with gridlines
    pdf.set_draw_color(*LIGHT_GRAY)
    pdf.set_line_width(0.2)
    pdf.set_font('Arial', '', 6)
    pdf.set_text_color(*GRAY)
    for val in [0, 2000, 4000, 6000, 8000]:
        y_pos = chart_y + chart_h - (val / max_val) * chart_h
        pdf.line(chart_x, y_pos, chart_x + chart_w, y_pos)
        pdf.set_xy(chart_x - 20, y_pos - 2)
        pdf.cell(18, 5, f'{val//1000}k', 0, 0, 'R')

    # Y axis label
    pdf.set_font('Arial', 'B', 7)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_xy(chart_x - 30, chart_y + chart_h / 2 - 15)
    pdf.cell(12, 30, 'Revenue\nGBP', 0, 1, 'C')

    # Bars
    bar_group_w = chart_w / len(data)
    bar_w = 14
    for i, (label, saas, prof, total_label) in enumerate(data):
        group_x = chart_x + i * bar_group_w + (bar_group_w - bar_w) / 2

        # SaaS portion
        saas_h = (saas / max_val) * chart_h
        prof_h = (prof / max_val) * chart_h

        # Draw professional services bar first (bottom)
        y_prof = chart_y + chart_h - prof_h - saas_h
        pdf.set_fill_color(*LIGHT_BLUE)
        pdf.set_draw_color(*MEDIUM_BLUE)
        pdf.set_line_width(0.3)
        pdf.rect(group_x, y_prof + saas_h, bar_w, prof_h, 'FD')

        # Draw SaaS bar on top
        y_saas = chart_y + chart_h - saas_h - prof_h
        pdf.set_fill_color(*DARK_BLUE)
        pdf.set_draw_color(*DARK_BLUE)
        pdf.rect(group_x, y_saas, bar_w, saas_h, 'FD')

        # Total label
        pdf.set_font('Arial', 'B', 7)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(group_x - 5, y_saas - 6)
        pdf.cell(bar_w + 10, 5, total_label, 0, 1, 'C')

        # X-axis label
        pdf.set_font('Arial', '', 8)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(group_x - 5, chart_y + chart_h + 2)
        pdf.cell(bar_w + 10, 5, label, 0, 1, 'C')

    # Legend
    legend_y = chart_y + chart_h + 10
    legend_x = chart_x + 20
    pdf.set_font('Arial', '', 7)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_fill_color(*DARK_BLUE)
    pdf.rect(legend_x, legend_y, 8, 5, 'FD')
    pdf.set_xy(legend_x + 10, legend_y)
    pdf.cell(30, 5, 'SaaS Revenue')
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.rect(legend_x + 50, legend_y, 8, 5, 'FD')
    pdf.set_xy(legend_x + 60, legend_y)
    pdf.cell(40, 5, 'Professional Services')

    pdf.set_y(legend_y + 10)
    pdf.add_caption('Figure 5: 3-Year Revenue Growth - SaaS subscription revenue drives rapid growth to £8.9M by Year 3.')


# ============================================================================
# DIAGRAM 6: Channel Contribution Stacked Bar (Phase 2.5)
# ============================================================================

def draw_diagram6(pdf):
    """Stacked bar chart for channel contribution."""
    pdf.ln(3)
    chart_x = MARGIN_L + 25
    chart_y = pdf.get_y() + 8
    chart_w = 120
    chart_h = 60

    channels = [
        ('Direct Sales', DARK_BLUE, [60, 40, 25]),
        ('Azure Marketplace', MEDIUM_BLUE, [20, 25, 30]),
        ('System Integrators', LIGHT_BLUE, [10, 20, 25]),
        ('Co-Sell', GREEN, [5, 10, 15]),
        ('Inbound', GRAY, [5, 5, 5]),
    ]

    # Y-axis
    pdf.set_draw_color(*LIGHT_GRAY)
    pdf.set_line_width(0.2)
    pdf.set_font('Arial', '', 6)
    pdf.set_text_color(*GRAY)
    for val in [0, 25, 50, 75, 100]:
        y_pos = chart_y + chart_h - (val / 100) * chart_h
        pdf.line(chart_x, y_pos, chart_x + chart_w, y_pos)
        pdf.set_xy(chart_x - 15, y_pos - 2)
        pdf.cell(13, 5, f'{val}%', 0, 0, 'R')

    bar_group_w = chart_w / 3
    bar_w = 20

    for yr_idx in range(3):
        group_x = chart_x + yr_idx * bar_group_w + (bar_group_w - bar_w) / 2
        cum_h = 0
        for ch_name, ch_color, ch_data in channels:
            pct = ch_data[yr_idx]
            h = (pct / 100) * chart_h
            pdf.set_fill_color(*ch_color)
            pdf.set_draw_color(255, 255, 255)
            pdf.set_line_width(0.3)
            pdf.rect(group_x, chart_y + chart_h - cum_h - h, bar_w, h, 'FD')
            cum_h += h

        # X-axis label
        pdf.set_font('Arial', '', 8)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(group_x - 5, chart_y + chart_h + 2)
        pdf.cell(bar_w + 10, 5, f'Year {yr_idx + 1}', 0, 1, 'C')

    # Legend
    legend_y = chart_y + chart_h + 10
    legend_x = chart_x
    pdf.set_font('Arial', '', 6.5)
    x_off = 0
    for ch_name, ch_color, _ in channels:
        pdf.set_fill_color(*ch_color)
        pdf.rect(legend_x + x_off, legend_y, 6, 4, 'FD')
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(legend_x + x_off + 7, legend_y)
        pdf.cell(25, 4, ch_name)
        x_off += 33

    pdf.set_y(legend_y + 10)
    pdf.add_caption('Figure 6: Channel mix evolution - Shift from direct sales to Azure Marketplace and SI partnerships over 3 years.')


# ============================================================================
# DIAGRAM 7: EBITDA Trajectory (Phase 2.6)
# ============================================================================

def draw_diagram7(pdf):
    """Line chart showing EBITDA trajectory."""
    pdf.ln(3)
    chart_x = MARGIN_L + 25
    chart_y = pdf.get_y() + 8
    chart_w = 120
    chart_h = 65

    data = [('Year 1', 50), ('Year 2', 1734), ('Year 3', 6980)]
    max_val = 7500

    # Y-axis with gridlines
    pdf.set_draw_color(*LIGHT_GRAY)
    pdf.set_line_width(0.2)
    pdf.set_font('Arial', '', 6)
    pdf.set_text_color(*GRAY)
    for val in [0, 2000, 4000, 6000]:
        y_pos = chart_y + chart_h - (val / max_val) * chart_h
        pdf.line(chart_x, y_pos, chart_x + chart_w, y_pos)
        pdf.set_xy(chart_x - 20, y_pos - 2)
        if val >= 1000:
            pdf.cell(18, 5, f'{val//1000}k', 0, 0, 'R')
        else:
            pdf.cell(18, 5, str(val), 0, 0, 'R')

    # Breakeven line at 0
    zero_y = chart_y + chart_h
    pdf.set_draw_color(*GRAY)
    pdf.set_line_width(0.3)
    pdf.line(chart_x, zero_y, chart_x + chart_w, zero_y)

    # Area fill under line
    points = []
    for i, (label, val) in enumerate(data):
        px = chart_x + (i / (len(data) - 1)) * chart_w
        py = chart_y + chart_h - (val / max_val) * chart_h
        points.append((px, py))

    # Light blue area
    pdf.set_fill_color(*LIGHT_BLUE_BG)
    pdf.set_draw_color(255, 255, 255)
    # Build polygon: bottom-left -> points -> bottom-right
    poly = [(chart_x, chart_y + chart_h)]
    poly.extend(points)
    poly.append((chart_x + chart_w, chart_y + chart_h))
    # Draw as filled rectangles (simpler approach)
    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i + 1]
        mid_x = (x1 + x2) / 2
        pdf.set_fill_color(220, 235, 250)
        pdf.rect(x1, min(y1, chart_y + chart_h), x2 - x1, abs(y1 - chart_y + chart_h) if y1 < chart_y + chart_h else 0, 'F')

    # Line
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1.2)
    for i in range(len(points) - 1):
        pdf.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1])

    # Data points and labels
    for i, (label, val) in enumerate(data):
        px, py = points[i]
        pdf.set_fill_color(*DARK_BLUE)
        pdf.set_draw_color(WHITE)
        pdf.set_line_width(0.5)
        pdf.circle(px, py, 2.5, 'FD')

        # Value label
        pdf.set_font('Arial', 'B', 7)
        pdf.set_text_color(*DARK_BLUE)
        val_str = f'{val/1000:.1f}M' if val >= 1000 else f'{val}k'
        pdf.set_xy(px - 10, py - 8)
        pdf.cell(20, 5, val_str, 0, 0, 'C')

        # X-axis label
        pdf.set_font('Arial', '', 8)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(px - 10, chart_y + chart_h + 2)
        pdf.cell(20, 5, label, 0, 1, 'C')

    # Y-axis label
    pdf.set_font('Arial', 'B', 7)
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_xy(chart_x - 30, chart_y + chart_h / 2 - 15)
    pdf.cell(12, 30, 'EBITDA\nGBP', 0, 1, 'C')

    pdf.set_y(chart_y + chart_h + 12)
    pdf.add_caption('Figure 7: EBITDA Trajectory - Profitable from Year 1, growing to £6.98M by Year 3.')


# ============================================================================
# DIAGRAM 8: Use of Funds Pie Chart (Phase 2.6)
# ============================================================================

def draw_diagram8(pdf):
    """Pie chart for use of funds."""
    pdf.ln(3)
    cx = MARGIN_L + CONTENT_W / 2 - 25
    cy = pdf.get_y() + 45
    r = 35

    segments = [
        ('Product\nDev', 40, DARK_BLUE),
        ('AI Mapping', 20, MEDIUM_BLUE),
        ('Customer\nPilots', 20, LIGHT_BLUE),
        ('Security\nCerts', 10, GREEN),
        ('Marketplace', 10, ORANGE),
    ]

    import math
    start_angle = -90  # Start from top

    for label, pct, color in segments:
        sweep = (pct / 100) * 360
        end_angle = start_angle + sweep

        # Draw pie slice
        pdf.set_fill_color(*color)
        pdf.set_draw_color(255, 255, 255)
        pdf.set_line_width(0.5)

        # Draw as polygon
        points_list = [(cx, cy)]
        for angle_deg in range(int(start_angle), int(end_angle) + 1):
            angle_rad = math.radians(angle_deg)
            px = cx + r * math.cos(angle_rad)
            py = cy + r * math.sin(angle_rad)
            points_list.append((px, py))
        points_list.append((cx, cy))

        # Simple filled polygon using triangles from center
        for i in range(1, len(points_list) - 1):
            x1, y1 = points_list[i]
            x2, y2 = points_list[i + 1]
            pdf.set_fill_color(*color)
            # Draw as line segments filling
            if i == 1:
                # First triangle
                pdf.set_line_width(0)
                pdf.set_draw_color(*color)
                # Approximate with rectangle and triangle
                pdf.rect(min(cx, x1, x2), min(cy, y1, y2),
                         max(cx, x1, x2) - min(cx, x1, x2) + 0.5,
                         max(cy, y1, y2) - min(cy, y1, y2) + 0.5, 'F')

        # Label
        mid_angle = math.radians(start_angle + sweep / 2)
        label_r = r * 0.65
        lx = cx + label_r * math.cos(mid_angle)
        ly = cy + label_r * math.sin(mid_angle)

        pdf.set_font('Arial', 'B', 6.5)
        pdf.set_text_color(WHITE)
        pdf.set_xy(lx - 12, ly - 3)
        pdf.cell(24, 4, f'{pct}%', 0, 1, 'C')

        start_angle = end_angle

    # Legend below
    legend_y = cy + r + 8
    legend_x = MARGIN_L + 5
    pdf.set_font('Arial', '', 7)
    for i, (label, pct, color) in enumerate(segments):
        x = legend_x + (i % 3) * 60
        y = legend_y + (i // 3) * 6
        pdf.set_fill_color(*color)
        pdf.rect(x, y, 5, 4, 'FD')
        pdf.set_text_color(*DARK_BLUE)
        clean_label = label.replace('\n', ' ')
        pdf.set_xy(x + 7, y)
        pdf.cell(50, 4, f'{clean_label} ({pct}%)')

    pdf.set_y(legend_y + 12)
    pdf.add_caption('Figure 8: Use of Funds - Allocation of £500k-£750k seed investment across key growth areas.')


# ============================================================================
# DIAGRAM 9: Product Roadmap Timeline (Phase 2.8)
# ============================================================================

def draw_diagram9(pdf):
    """Horizontal timeline with 4 phases."""
    pdf.ln(3)
    y = pdf.get_y() + 5

    phases = [
        ('Phase 1', 'Foundation', 'Complete', GREEN, 'CLI Engine\n10 Controls\nScoring'),
        ('Phase 2', 'Enterprise\nPlatform', 'In Development', ORANGE, 'REST API\nDashboard\nAI Mapping'),
        ('Phase 3', 'AI-Powered', 'Planned', GRAY, 'SaaS Portal\nAI Engine\nTemplates'),
        ('Phase 4', 'Intelligent\nPlatform', 'Future', GRAY, 'AI Agents\nFabric\nMulti-Cloud'),
    ]

    box_w = 35
    box_h = 22
    gap = 8
    total = len(phases) * box_w + (len(phases) - 1) * gap
    start_x = MARGIN_L + (CONTENT_W - total) / 2

    # Timeline line
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1.5)
    line_y = y + box_h / 2
    pdf.line(start_x - 5, line_y, start_x + total + 5, line_y)

    for i, (phase, name, status, color, caps) in enumerate(phases):
        x = start_x + i * (box_w + gap)

        # Phase box
        pdf.set_fill_color(*color)
        pdf.set_draw_color(255, 255, 255)
        pdf.set_line_width(0.3)
        pdf.rect(x, y, box_w, box_h, 'FD')

        # Phase number
        pdf.set_font('Arial', 'B', 8)
        pdf.set_text_color(WHITE)
        pdf.set_xy(x, y + 2)
        pdf.cell(box_w, 5, phase, 0, 0, 'C')

        # Name
        pdf.set_font('Arial', 'B', 7)
        pdf.set_xy(x, y + 7)
        pdf.cell(box_w, 10, name, 0, 0, 'C')

        # Status badge below
        pdf.set_font('Arial', 'B', 6)
        if 'Complete' in status:
            pdf.set_fill_color(GREEN)
        elif 'Development' in status:
            pdf.set_fill_color(ORANGE)
        else:
            pdf.set_fill_color(GRAY)
        badge_w = pdf.get_string_width(status) + 6
        pdf.set_xy(x + (box_w - badge_w) / 2, y + box_h + 2)
        pdf.cell(badge_w, 5, status, 0, 1, 'C', fill=True)

        # Capabilities below badge
        pdf.set_font('Arial', '', 6)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(x, y + box_h + 9)
        pdf.cell(box_w, 4, caps.replace('\n', ' | '), 0, 0, 'C')

    # Arrow connectors between boxes
    for i in range(len(phases) - 1):
        x1 = start_x + i * (box_w + gap) + box_w + 1
        x2 = start_x + (i + 1) * (box_w + gap) - 1
        draw_arrow(pdf, x1, line_y, x2, line_y, color=DARK_BLUE)

    pdf.set_y(y + box_h + 25)
    pdf.add_caption('Figure 9: Product Roadmap Timeline - Progressive evolution from CLI engine to intelligent migration platform.')


# ============================================================================
# DIAGRAM 10: Feature Comparison Visual (Phase 2.7)
# ============================================================================

def draw_diagram10(pdf):
    """Visual feature comparison grid."""
    pdf.ln(3)
    y = pdf.get_y() + 3

    features = [
        'Purpose-Built for Migration',
        '10 Structured Controls',
        'Release Gate Governance',
        'Automated Audit Trail',
        'Financial Services Focus',
        'Docker Deployment',
        'API-First Architecture',
        'Objective Scoring',
    ]

    platforms = ['Our Platform', 'ETL Testing', 'Data Quality', 'Manual']
    # 1=check, 0=cross, 0.5=partial
    matrix = [
        [1, 0, 0, 0],
        [1, 0.5, 0.5, 0],
        [1, 0, 0, 0],
        [1, 0.5, 0.5, 0],
        [1, 0, 0, 0],
        [1, 0, 0.5, None],
        [1, 0.5, 0.5, 0],
        [1, 0.5, 0.5, 0],
    ]

    col_w = [40, 28, 28, 28, 28]
    row_h = 7
    table_x = MARGIN_L + (CONTENT_W - sum(col_w)) / 2

    # Header
    pdf.set_font('Arial', 'B', 7)
    for j, name in enumerate(platforms):
        x = table_x + sum(col_w[:j])
        pdf.set_fill_color(*DARK_BLUE)
        pdf.set_text_color(*WHITE)
        pdf.rect(x, y, col_w[j], row_h, 'FD')
        pdf.set_xy(x, y + 1)
        pdf.cell(col_w[j], row_h - 2, name, 0, 0, 'C')
    pdf.set_xy(table_x, y + row_h)

    # Feature name column header
    pdf.set_fill_color(*DARK_BLUE)
    pdf.set_text_color(*WHITE)
    pdf.set_font('Arial', 'B', 7)
    pdf.rect(table_x, y, col_w[0], row_h, 'FD')
    pdf.set_xy(table_x, y + 1)
    pdf.cell(col_w[0], row_h - 2, 'Feature', 0, 0, 'C')

    # Rows
    for i, feat in enumerate(features):
        row_y = y + row_h * (i + 1)
        # Feature name
        pdf.set_fill_color(245, 248, 252) if i % 2 == 0 else pdf.set_fill_color(255, 255, 255)
        pdf.set_text_color(40, 40, 40)
        pdf.set_font('Arial', '', 7)
        pdf.rect(table_x, row_y, col_w[0], row_h, 'FD')
        pdf.set_xy(table_x + 2, row_y + 1)
        pdf.cell(col_w[0] - 4, row_h - 2, feat, 0, 0, 'L')

        # Values
        for j, val in enumerate(matrix[i]):
            x = table_x + sum(col_w[:j + 1])
            if i % 2 == 0:
                pdf.set_fill_color(245, 248, 252)
            else:
                pdf.set_fill_color(255, 255, 255)
            pdf.rect(x, row_y, col_w[j + 1], row_h, 'FD')

            if val == 1:
                # Green checkmark
                pdf.set_fill_color(*GREEN)
                pdf.set_draw_color(*GREEN)
                cx = x + col_w[j + 1] / 2
                cy = row_y + row_h / 2
                # Draw checkmark as text
                pdf.set_font('Arial', 'B', 10)
                pdf.set_text_color(*GREEN)
                pdf.set_xy(x, row_y + 1)
                pdf.cell(col_w[j + 1], row_h - 2, '+', 0, 0, 'C')
            elif val == 0:
                # Red X
                pdf.set_font('Arial', 'B', 10)
                pdf.set_text_color(180, 50, 50)
                pdf.set_xy(x, row_y + 1)
                pdf.cell(col_w[j + 1], row_h - 2, '-', 0, 0, 'C')
            elif val == 0.5:
                pdf.set_font('Arial', 'B', 9)
                pdf.set_text_color(*ORANGE)
                pdf.set_xy(x, row_y + 1)
                pdf.cell(col_w[j + 1], row_h - 2, '~', 0, 0, 'C')
            else:
                pdf.set_font('Arial', '', 7)
                pdf.set_text_color(*GRAY)
                pdf.set_xy(x, row_y + 1)
                pdf.cell(col_w[j + 1], row_h - 2, 'N/A', 0, 0, 'C')

    pdf.set_y(y + row_h * (len(features) + 1) + 5)
    pdf.add_caption('Figure 10: Feature Comparison - Our platform provides comprehensive capabilities that no competitor matches.')


# ============================================================================
# DIAGRAM 11: Pricing Tier Visual (Phase 2.4)
# ============================================================================

def draw_diagram11(pdf):
    """Visual tier comparison boxes."""
    pdf.ln(3)
    y = pdf.get_y() + 3

    tiers = [
        ('Starter', '£1,500-3,500/mo', 'Pilot Projects\nSmall Migrations', LIGHT_BLUE,
         '1 Migration Project\n2 Databases\nCLI Access'),
        ('Professional', '£3,500-10,000/mo', 'Mid-Size Bank\nMigrations', MEDIUM_BLUE,
         '3 Concurrent Projects\n5 Databases\nAPI Access'),
        ('Enterprise', '£10,000-35,000/mo', 'Large-Scale\nMigrations', DARK_BLUE,
         'Unlimited Projects\nMulti-Database\nAudit Export\nPriority Support'),
        ('Strategic', 'Custom', 'Enterprise-Wide\nDeployment', GREEN,
         'Custom Controls\nMulti-Region\nDedicated Support\nSLA'),
    ]

    box_w = 40
    box_h = 60
    gap = 6
    total = len(tiers) * box_w + (len(tiers) - 1) * gap
    start_x = MARGIN_L + (CONTENT_W - total) / 2

    for i, (name, price, desc, color, features) in enumerate(tiers):
        x = start_x + i * (box_w + gap)

        # Box background
        pdf.set_fill_color(245, 248, 252)
        pdf.set_draw_color(*color)
        pdf.set_line_width(0.5)
        pdf.rect(x, y, box_w, box_h, 'FD')

        # Header
        pdf.set_fill_color(*color)
        pdf.rect(x, y, box_w, 12, 'FD')
        pdf.set_font('Arial', 'B', 8)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x, y + 2)
        pdf.cell(box_w, 8, name, 0, 0, 'C')

        # Price
        pdf.set_font('Arial', 'B', 7)
        pdf.set_text_color(*color)
        pdf.set_xy(x, y + 14)
        pdf.cell(box_w, 5, price, 0, 0, 'C')

        # Description
        pdf.set_font('Arial', 'I', 6)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(x, y + 20)
        pdf.cell(box_w, 8, desc, 0, 0, 'C')

        # Features
        pdf.set_font('Arial', '', 6)
        pdf.set_text_color(40, 40, 40)
        pdf.set_xy(x + 3, y + 30)
        pdf.multi_cell(box_w - 6, 4, features)

    pdf.set_y(y + box_h + 5)
    pdf.add_caption('Figure 11: Pricing Tiers - Four-tier SaaS model from pilot to enterprise-wide deployment.')


# ============================================================================
# DIAGRAM 12: Azure Services Visual (Phase 1.1 "Why Azure")
# ============================================================================

def draw_diagram12(pdf):
    """Grid of Azure service boxes."""
    pdf.ln(3)
    y = pdf.get_y() + 3

    services = [
        ('Azure Container\nApps', 'Scalable\nServerless Compute'),
        ('Azure SQL\nDatabase', 'Managed\nRelational DB'),
        ('Azure Blob\nStorage', 'Secure\nAudit Storage'),
        ('Azure Key\nVault', 'Secrets\nManagement'),
        ('Microsoft\nEntra ID', 'Enterprise\nIdentity & RBAC'),
        ('Azure\nMonitor', 'Centralised\nLogging'),
        ('Azure API\nManagement', 'API Gateway\n& Integration'),
    ]

    cols = 4
    box_w = 40
    box_h = 28
    gap_x = 6
    gap_y = 6
    total_w = cols * box_w + (cols - 1) * gap_x
    start_x = MARGIN_L + (CONTENT_W - total_w) / 2

    for i, (name, desc) in enumerate(services):
        row = i // cols
        col = i % cols
        x = start_x + col * (box_w + gap_x)
        cy = y + row * (box_h + gap_y)

        # Box
        pdf.set_fill_color(*LIGHT_BLUE_BG)
        pdf.set_draw_color(*MEDIUM_BLUE)
        pdf.set_line_width(0.4)
        pdf.rect(x, cy, box_w, box_h, 'FD')

        # Icon-like top bar
        pdf.set_fill_color(*MEDIUM_BLUE)
        pdf.rect(x, cy, box_w, 4, 'F')

        # Service name
        pdf.set_font('Arial', 'B', 7)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_xy(x, cy + 5)
        pdf.cell(box_w, 8, name, 0, 0, 'C')

        # Description
        pdf.set_font('Arial', '', 6)
        pdf.set_text_color(*GRAY)
        pdf.set_xy(x, cy + 14)
        pdf.cell(box_w, 10, desc, 0, 0, 'C')

    pdf.set_y(y + 2 * (box_h + gap_y) + 5)
    pdf.add_caption('Figure 12: Azure Services - Enterprise-grade managed services powering the platform.')


# ============================================================================
# SECTION RENDERER
# ============================================================================

def render_section_content(pdf, text, section_id, diagram_func=None, diagram_trigger=None):
    """Render a markdown section with optional diagram insertion."""
    lines = text.split('\n')
    in_code_block = False
    line_count = 0

    for line in lines:
        stripped = line.strip()

        # Code blocks - skip
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue

        # Insert diagram at trigger
        if diagram_func and diagram_trigger and line_count >= diagram_trigger:
            diagram_func(pdf)
            diagram_func = None  # Only draw once

        line_count += 1

        # Empty line
        if not stripped:
            if pdf.get_y() > MARGIN_T + 5:
                pdf.ln(1)
            continue

        # Horizontal rules
        if stripped == '---':
            pdf.set_draw_color(*LIGHT_GRAY)
            pdf.set_line_width(0.2)
            pdf.line(MARGIN_L, pdf.get_y() + 1, PAGE_W - MARGIN_R, pdf.get_y() + 1)
            pdf.ln(3)
            continue

        # Headers
        if stripped.startswith('#'):
            level = 0
            for ch in stripped:
                if ch == '#':
                    level += 1
                else:
                    break
            heading = stripped[level:].strip()
            if heading:
                # Remove bold markers
                heading = heading.replace('**', '')
                pdf.check_page_space(20)
                pdf.add_title_section(heading, level=min(level, 4))
            continue

        # Table separator rows
        if stripped.startswith('|') and set(stripped.replace('|', '').replace('-', '').replace(':', '').replace(' ', '').replace('+', '')) == set():
            continue

        # Table rows
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip().replace('**', '').replace('+', '\u2713').replace('-', '\u2717') for c in stripped.split('|')[1:-1]]
            if cells and any(c for c in cells):
                col_widths = [CONTENT_W / len(cells)] * len(cells)
                is_header = any(c for c in cells) and not hasattr(pdf, '_table_started')
                pdf.check_page_space(10)
                pdf.add_table_row(cells, header=(line_count <= 3 or is_header), col_widths=col_widths)
            continue

        # List items
        if stripped.startswith('- ') or stripped.startswith('* '):
            content = stripped[2:].replace('**', '').replace('`', '')
            pdf.set_font('Arial', '', 9.5)
            pdf.set_text_color(40, 40, 40)
            pdf.set_x(MARGIN_L + 5)
            pdf.cell(5, 5.5, '\u2022', 0, 0)
            pdf.multi_cell(CONTENT_W - 10, 5.5, content)
            pdf.ln(0.5)
            continue

        # Numbered list
        if len(stripped) > 2 and stripped[0].isdigit() and stripped[1] in '.):':
            content = stripped[2:].replace('**', '').replace('`', '')
            pdf.set_font('Arial', '', 9.5)
            pdf.set_text_color(40, 40, 40)
            pdf.set_x(MARGIN_L + 5)
            pdf.cell(8, 5.5, stripped[:2], 0, 0)
            pdf.multi_cell(CONTENT_W - 13, 5.5, content)
            pdf.ln(0.5)
            continue

        # Block quotes
        if stripped.startswith('>'):
            content = stripped[1:].strip().replace('**', '').replace('"', '"').replace('"', '"')
            pdf.set_fill_color(240, 245, 250)
            pdf.set_draw_color(*MEDIUM_BLUE)
            pdf.set_line_width(0.3)
            x = MARGIN_L + 5
            pdf.rect(x, pdf.get_y(), CONTENT_W - 10, 1, 'F')
            pdf.set_xy(x + 3, pdf.get_y() + 1)
            pdf.set_font('Arial', 'I', 9)
            pdf.set_text_color(*MEDIUM_BLUE)
            pdf.multi_cell(CONTENT_W - 16, 5, content)
            pdf.ln(2)
            continue

        # Regular text
        content = stripped.replace('**', '').replace('`', '')
        if content:
            pdf.check_page_space(10)
            pdf.set_font('Arial', '', 9.5)
            pdf.set_text_color(40, 40, 40)
            pdf.multi_cell(CONTENT_W, 5.5, content)
            pdf.ln(1)

    # Draw remaining diagram if not yet drawn
    if diagram_func:
        diagram_func(pdf)


# ============================================================================
# SUMMARIZED SECTIONS (Phase 1.2 - 1.5)
# ============================================================================

def render_summarized_phase(pdf, title, summary_text):
    """Render a summarized 1-page phase."""
    pdf.add_page()
    pdf.add_title_section(title, level=1)
    pdf.ln(2)

    for block in summary_text:
        if block['type'] == 'heading':
            pdf.add_title_section(block['text'], level=block.get('level', 2))
        elif block['type'] == 'body':
            pdf.add_body_text(block['text'])
        elif block['type'] == 'list':
            for item in block['items']:
                pdf.set_font('Arial', '', 9.5)
                pdf.set_text_color(40, 40, 40)
                pdf.set_x(MARGIN_L + 5)
                pdf.cell(5, 5.5, '\u2022', 0, 0)
                pdf.multi_cell(CONTENT_W - 10, 5.5, item)
                pdf.ln(0.5)
            pdf.ln(1)
        elif block['type'] == 'table':
            col_widths = block.get('col_widths', [CONTENT_W / len(block['headers'])] * len(block['headers']))
            pdf.add_table_row(block['headers'], header=True, col_widths=col_widths)
            for row in block['rows']:
                pdf.add_table_row(row, col_widths=col_widths)
            pdf.ln(2)


# ============================================================================
# MAIN GENERATION
# ============================================================================

def main():
    print("Generating FS Migration Validation Engine Master PDF...")
    print(f"Output: {OUTPUT_PDF}")

    os.makedirs(os.path.dirname(OUTPUT_PDF), exist_ok=True)

    pdf = MasterPDF()
    pdf.set_auto_page_break(auto=True, margin=MARGIN_B)

    # ============================================================
    # COVER PAGE
    # ============================================================
    pdf.is_cover = True
    pdf.add_page()

    # Background bar
    pdf.set_fill_color(*DARK_BLUE)
    pdf.rect(0, 0, PAGE_W, 120, 'F')

    # Title
    pdf.set_font('Arial', 'B', 28)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(MARGIN_L, 30)
    pdf.multi_cell(CONTENT_W, 14, 'FS Migration\nValidation Engine')

    pdf.set_font('Arial', '', 14)
    pdf.set_xy(MARGIN_L, 70)
    pdf.multi_cell(CONTENT_W, 8, 'Microsoft Founders Hub\nApplication Pack')

    # Subtitle bar
    pdf.set_fill_color(*MEDIUM_BLUE)
    pdf.rect(0, 120, PAGE_W, 30, 'F')
    pdf.set_font('Arial', '', 12)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(MARGIN_L, 125)
    pdf.multi_cell(CONTENT_W, 8, 'Business Summary Document with Diagrams')

    # Version info
    pdf.set_text_color(*DARK_BLUE)
    pdf.set_font('Arial', 'B', 14)
    pdf.set_xy(MARGIN_L, 170)
    pdf.cell(CONTENT_W, 8, 'Version 2.0  |  June 2026', 0, 1, 'C')

    pdf.set_font('Arial', '', 11)
    pdf.set_text_color(*MEDIUM_BLUE)
    pdf.set_xy(MARGIN_L, 185)
    pdf.cell(CONTENT_W, 8, 'Status: Ready for Review', 0, 1, 'C')

    # Decorative line
    pdf.set_draw_color(*GREEN)
    pdf.set_line_width(2)
    pdf.line(MARGIN_L + 30, 200, PAGE_W - MARGIN_R - 30, 200)

    # Footer area
    pdf.set_font('Arial', '', 9)
    pdf.set_text_color(*GRAY)
    pdf.set_xy(MARGIN_L, 220)
    pdf.multi_cell(CONTENT_W, 6, 'FS Migration Validation Engine\nAutomated, Metadata-Driven Data Migration Validation\nfor Regulated Financial Services', 0, 'C')

    pdf.is_cover = False

    # ============================================================
    # TABLE OF CONTENTS
    # ============================================================
    pdf.add_page()
    pdf.add_title_section('Table of Contents', level=1)
    pdf.ln(3)

    toc_items = [
        ('1', 'Phase 1 - Azure Founders Hub Pack', 'Overview'),
        ('2', 'Phase 1.1 - Product Overview', 'Full Document'),
        ('3', 'Phase 1.2 - Technical Architecture', 'Business Summary'),
        ('4', 'Phase 1.3 - Platform Core Definition', 'Business Summary'),
        ('5', 'Phase 1.4 - Azure Cloud Architecture', 'Business Summary'),
        ('6', 'Phase 1.5 - Azure Reference Architecture', 'Business Summary'),
        ('7', 'Phase 1.6 - Azure Founders Hub Technical Narrative', 'Full Document'),
        ('8', 'Phase 2.1 - Executive Pitch Narrative', 'Full Document'),
        ('9', 'Phase 2.2 - Investor Pitch Deck', 'Full Document'),
        ('10', 'Phase 2.3 - Market Analysis TAM/SAM/SOM', 'Full Document'),
        ('11', 'Phase 2.4 - Business Model & Pricing', 'Full Document'),
        ('12', 'Phase 2.5 - Go-to-Market & Financial Projections', 'Full Document'),
        ('13', 'Phase 2.6 - Financial Model & Funding', 'Full Document'),
        ('14', 'Phase 2.7 - Competitive Differentiation', 'Full Document'),
        ('15', 'Phase 2.8 - Product Roadmap', 'Full Document'),
        ('16', 'Phase 2.9 - Investor FAQ', 'Full Document'),
        ('17', 'Phase 2.10 - Demo Script', 'Full Document'),
    ]

    for num, title, note in toc_items:
        pdf.set_font('Arial', 'B', 10)
        pdf.set_text_color(*DARK_BLUE)
        pdf.set_x(MARGIN_L)
        pdf.cell(8, 7, num + '.', 0, 0, 'R')
        pdf.cell(5, 7, '', 0, 0)
        pdf.set_font('Arial', '', 10)
        pdf.cell(CONTENT_W - 50, 7, title)
        pdf.set_font('Arial', 'I', 8)
        pdf.set_text_color(*GRAY)
        pdf.cell(40, 7, note, 0, 1, 'R')
        pdf.set_draw_color(*LIGHT_GRAY)
        pdf.set_line_width(0.1)
        pdf.line(MARGIN_L, pdf.get_y(), PAGE_W - MARGIN_R, pdf.get_y())

    # ============================================================
    # PHASE 1 - Azure Founders Hub Pack (Overview - keep as-is)
    # ============================================================
    pdf.add_page()
    phase1_content = read_md_file('Phase 1')
    render_section_content(pdf, clean_md(phase1_content), 'phase1')

    # ============================================================
    # PHASE 1.1 - Product Overview (keep as-is + Diagram 1)
    # ============================================================
    pdf.add_page()
    phase11_content = read_md_file('Phase 1.1')
    render_section_content(pdf, clean_md(phase11_content), 'phase11',
                           diagram_func=draw_diagram1, diagram_trigger=55)

    # ============================================================
    # PHASE 1.2 - Technical Architecture (SUMMARIZED)
    # ============================================================
    phase12_summary = [
        {'type': 'heading', 'text': 'Platform Architecture', 'level': 2},
        {'type': 'body', 'text': 'The FS Migration Validation Engine is built on a modular, cloud-ready architecture with a centralised orchestration layer (Platform Core) that coordinates independent domain engines for discovery, validation, scoring, and governance.'},
        {'type': 'heading', 'text': 'What the Platform Does', 'level': 3},
        {'type': 'body', 'text': 'The platform automatically validates data migrations between legacy and modern systems. It connects to source and target databases, runs 10 structured validation controls, scores migration quality, and produces audit-ready reports - all without manual intervention.'},
        {'type': 'heading', 'text': 'Key Architectural Principles', 'level': 3},
        {'type': 'list', 'items': [
            'Modularity - Independent engines communicate through the Platform Core, enabling loose coupling and independent scalability',
            'Metadata-Driven - All validation is driven by database schema metadata, ensuring consistent and repeatable results',
            'Security-by-Design - Zero Trust model with encryption at rest and in transit, secrets isolation via Azure Key Vault',
            'Governance-First - Release gates, audit trails, and compliance built into every execution',
            'Extensibility - Plugin-based architecture allows new validation controls to be added without modifying core platform',
            'Cloud-Native - Designed for Azure, deployable anywhere with Docker containers',
        ]},
        {'type': 'heading', 'text': 'Business Benefits', 'level': 3},
        {'type': 'table', 'headers': ['Principle', 'Business Outcome'],
         'rows': [
             ['Modular Design', 'Scale individual components independently as customer needs grow'],
             ['Metadata-Driven', 'Consistent validation across all migration projects, regardless of database type'],
             ['Security-by-Design', 'Meet regulatory requirements (FCA, PRA, Basel, SOX) from day one'],
             ['Governance-First', 'Automated release gates prevent data quality issues reaching production'],
             ['Extensible Platform', 'Add new validation controls as regulations evolve'],
             ['Cloud-Native', 'Deploy in Azure for enterprise-grade reliability and compliance'],
         ]},
    ]
    render_summarized_phase(pdf, 'Phase 1.2 - Technical Architecture', phase12_summary)

    # ============================================================
    # PHASE 1.3 - Platform Core Definition (SUMMARIZED)
    # ============================================================
    phase13_summary = [
        {'type': 'heading', 'text': 'Platform Core', 'level': 2},
        {'type': 'body', 'text': 'The Platform Core is the central orchestration layer that coordinates all validation activities. Rather than allowing engines to communicate directly with each other, the Platform Core acts as the single coordination point for workflow orchestration, state management, event routing, security enforcement, and configuration management.'},
        {'type': 'heading', 'text': 'What It Does', 'level': 3},
        {'type': 'body', 'text': 'Think of the Platform Core as the conductor of an orchestra. Each validation engine (discovery, validation, scoring, governance) is a specialist musician. The Platform Core ensures they play in the right order, at the right time, and produce a coherent result.'},
        {'type': 'heading', 'text': 'Key Capabilities', 'level': 3},
        {'type': 'list', 'items': [
            'Workflow Orchestration - Coordinates the execution sequence across all validation engines',
            'State Management - Tracks migration progress and validation results across sessions',
            'Event Routing - Routes events and data between engines without direct coupling',
            'Security Enforcement - Ensures all engine access is authenticated and authorised',
            'Configuration Management - Centralises all platform settings and validation parameters',
            'Engine Lifecycle Management - Handles engine startup, shutdown, and health monitoring',
        ]},
        {'type': 'heading', 'text': 'Why This Matters for Business', 'level': 3},
        {'type': 'body', 'text': 'This architecture ensures that the platform is reliable, secure, and scalable. If one validation control fails, it does not affect others. New engines can be added without disrupting existing functionality. All activity is logged and auditable.'},
    ]
    render_summarized_phase(pdf, 'Phase 1.3 - Platform Core Definition', phase13_summary)

    # ============================================================
    # PHASE 1.4 - Azure Cloud Architecture (SUMMARIZED)
    # ============================================================
    phase14_summary = [
        {'type': 'heading', 'text': 'Azure Cloud Architecture', 'level': 2},
        {'type': 'body', 'text': 'The FS Migration Validation Engine is designed as an Azure-native, cloud-first SaaS solution built on Microsoft\'s Well-Architected Framework. It leverages managed Azure services to maximise scalability, security, reliability, and operational efficiency.'},
        {'type': 'heading', 'text': 'Why Azure Is the Right Foundation', 'level': 3},
        {'type': 'body', 'text': 'Microsoft Azure provides the enterprise-grade foundation required for regulated Financial Services deployments. The platform uses Azure managed services to eliminate infrastructure management overhead while meeting the strict security and compliance requirements of financial institutions.'},
        {'type': 'heading', 'text': 'Azure Services Used', 'level': 3},
        {'type': 'table', 'headers': ['Azure Service', 'Business Benefit'],
         'rows': [
             ['Azure Container Apps', 'Serverless, auto-scaling compute that grows with customer demand'],
             ['Azure SQL Database', 'Managed database with high availability and automated backups'],
             ['Azure Blob Storage', 'Secure, encrypted storage for audit reports and evidence'],
             ['Azure Key Vault', 'Centralised secrets management - no credentials in code'],
             ['Microsoft Entra ID', 'Enterprise identity and role-based access control'],
             ['Azure Monitor', 'Centralised logging and performance monitoring'],
             ['Azure API Management', 'Secure API gateway with rate limiting and versioning'],
         ]},
        {'type': 'heading', 'text': 'Architectural Alignment', 'level': 3},
        {'type': 'list', 'items': [
            'Azure Well-Architected Framework - All 5 pillars (Reliability, Security, Cost, Performance, Operations)',
            'Cloud Adoption Framework - Enterprise cloud adoption best practices',
            'Zero Trust Security Model - Never trust, always verify approach to security',
            'Infrastructure as Code - Repeatable, version-controlled deployment',
            'CI/CD with GitHub Actions - Automated build, test, and deployment pipelines',
        ]},
    ]
    render_summarized_phase(pdf, 'Phase 1.4 - Azure Cloud Architecture', phase14_summary)

    # ============================================================
    # PHASE 1.5 - Azure Reference Architecture (SUMMARIZED)
    # ============================================================
    phase15_summary = [
        {'type': 'heading', 'text': 'Azure Reference Architecture', 'level': 2},
        {'type': 'body', 'text': 'The reference architecture demonstrates how the platform integrates with Azure\'s enterprise services to deliver a secure, scalable, and compliant migration validation solution for Financial Services.'},
        {'type': 'heading', 'text': 'Architecture Overview', 'level': 3},
        {'type': 'body', 'text': 'The architecture follows a layered approach: users access the platform through Azure API Management, which integrates with Microsoft Entra ID for authentication. Requests flow through the Platform Core, which orchestrates validation engines deployed as Azure Container Apps. Data is stored in Azure SQL Database, with audit reports persisted in Azure Blob Storage.'},
        {'type': 'heading', 'text': 'Key Design Decisions', 'level': 3},
        {'type': 'list', 'items': [
            'Container Apps over VMs - Serverless containers reduce operational overhead and scale automatically',
            'Managed Database - Azure SQL eliminates database administration while providing enterprise-grade HA',
            'API Management - Centralised gateway for security, throttling, and API versioning',
            'Entra ID Integration - Enterprise SSO and RBAC for financial services security requirements',
            'Blob Storage for Audits - Immutable, encrypted storage for regulatory evidence',
            'Azure Monitor - Full observability across all platform components',
        ]},
        {'type': 'heading', 'text': 'Compliance & Security', 'level': 3},
        {'type': 'body', 'text': 'The architecture is designed to meet FCA, PRA, Basel IV, and SOX requirements for data integrity and auditability. All data is encrypted at rest and in transit. Access is controlled through Microsoft Entra ID with multi-factor authentication. Every validation execution is logged with timestamps and batch IDs for complete traceability.'},
    ]
    render_summarized_phase(pdf, 'Phase 1.5 - Azure Reference Architecture', phase15_summary)

    # ============================================================
    # PHASE 1.6 - Azure Founders Hub Technical Narrative (keep as-is)
    # ============================================================
    pdf.add_page()
    phase16_content = read_md_file('Phase 1.6')
    render_section_content(pdf, clean_md(phase16_content), 'phase16')

    # ============================================================
    # PHASE 2.1 - Executive Pitch Narrative (keep as-is + Diagram 2)
    # ============================================================
    pdf.add_page()
    phase21_content = read_md_file('Phase 2.1')
    render_section_content(pdf, clean_md(phase21_content), 'phase21',
                           diagram_func=draw_diagram2, diagram_trigger=44)

    # ============================================================
    # PHASE 2.2 - Investor Pitch Deck (keep as-is)
    # ============================================================
    pdf.add_page()
    phase22_content = read_md_file('Phase 2.2')
    render_section_content(pdf, clean_md(phase22_content), 'phase22')

    # ============================================================
    # PHASE 2.3 - Market Analysis (keep as-is + Diagrams 3 & 4)
    # ============================================================
    pdf.add_page()
    phase23_content = read_md_file('Phase 2.3')
    render_section_content(pdf, clean_md(phase23_content), 'phase23',
                           diagram_func=draw_diagram3, diagram_trigger=107)

    # Diagram 4 - Competitive Positioning (after line ~164)
    pdf.check_page_space(100)
    draw_diagram4(pdf)

    # ============================================================
    # PHASE 2.4 - Business Model & Pricing (keep as-is + Diagram 11)
    # ============================================================
    pdf.add_page()
    phase24_content = read_md_file('Phase 2.4')
    render_section_content(pdf, clean_md(phase24_content), 'phase24',
                           diagram_func=draw_diagram11, diagram_trigger=31)

    # ============================================================
    # PHASE 2.5 - Go-to-Market & Financial Projections (keep as-is + Diagrams 6 & 5)
    # ============================================================
    pdf.add_page()
    phase25_content = read_md_file('Phase 2.5')
    render_section_content(pdf, clean_md(phase25_content), 'phase25',
                           diagram_func=draw_diagram6, diagram_trigger=35)

    # Diagram 5 - Revenue Growth (after line ~76)
    pdf.check_page_space(90)
    draw_diagram5(pdf)

    # ============================================================
    # PHASE 2.6 - Financial Model & Funding (keep as-is + Diagrams 7 & 8)
    # ============================================================
    pdf.add_page()
    phase26_content = read_md_file('Phase 2.6')
    render_section_content(pdf, clean_md(phase26_content), 'phase26',
                           diagram_func=draw_diagram7, diagram_trigger=23)

    # Diagram 8 - Use of Funds (after line ~169)
    pdf.check_page_space(90)
    draw_diagram8(pdf)

    # ============================================================
    # PHASE 2.7 - Competitive Differentiation (keep as-is + Diagram 10)
    # ============================================================
    pdf.add_page()
    phase27_content = read_md_file('Phase 2.7')
    render_section_content(pdf, clean_md(phase27_content), 'phase27',
                           diagram_func=draw_diagram10, diagram_trigger=31)

    # ============================================================
    # PHASE 2.8 - Product Roadmap (keep as-is + Diagram 9)
    # ============================================================
    pdf.add_page()
    phase28_content = read_md_file('Phase 2.8')
    render_section_content(pdf, clean_md(phase28_content), 'phase28',
                           diagram_func=draw_diagram9, diagram_trigger=30)

    # ============================================================
    # PHASE 2.9 - Investor FAQ (keep as-is)
    # ============================================================
    pdf.add_page()
    phase29_content = read_md_file('Phase 2.9')
    render_section_content(pdf, clean_md(phase29_content), 'phase29')

    # ============================================================
    # PHASE 2.10 - Demo Script (keep as-is)
    # ============================================================
    pdf.add_page()
    phase210_content = read_md_file('Phase 2.10')
    render_section_content(pdf, clean_md(phase210_content), 'phase210')

    # ============================================================
    # SAVE
    # ============================================================
    pdf.output(OUTPUT_PDF)
    print(f"\nPDF generated successfully!")
    print(f"Output path: {OUTPUT_PDF}")
    print(f"Total pages: {pdf.page_no()}")


if __name__ == '__main__':
    main()
