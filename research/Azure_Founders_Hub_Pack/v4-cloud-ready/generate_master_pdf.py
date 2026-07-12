#!/usr/bin/env python3
"""
Master PDF Generator - FS Migration Validation Engine
Combines all 17 markdown files into a professional PDF with visual diagrams.
"""
import os
import re
import math
from fpdf import FPDF

SOURCE_DIR = os.path.join(
    r"C:\Users\devwork\Desktop\projects\Financial_services_Migration_product",
    r"ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready"
)
OUTPUT_DIR = os.path.join(SOURCE_DIR, "output", "v1-technical-diagrams")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "FS_Migration_Validation_Engine_Founders_Hub_Master.pdf")

DARK_BLUE = (0, 51, 102)
MEDIUM_BLUE = (0, 102, 178)
GREEN = (0, 153, 76)
ORANGE = (204, 153, 0)
GRAY = (128, 128, 128)
LIGHT_GRAY = (200, 200, 200)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
LIGHT_BLUE = (200, 220, 240)

DOCUMENT_FILES = [
    ("Phase 1 \u2013 Azure Founders Hub Pack.md", "Phase 1 - Azure Founders Hub Pack"),
    ("Phase 1.1 Product Overview.md", "Phase 1.1 - Product Overview"),
    ("Phase 1.2 Technical Architecture.md", "Phase 1.2 - Technical Architecture"),
    ("Phase 1.3 \u2013 Platform Core Definition.md", "Phase 1.3 - Platform Core Definition"),
    ("Phase 1.4 Azure Cloud Architecture.md", "Phase 1.4 - Azure Cloud Architecture"),
    ("Phase 1.5 Azure Reference Architecture Diagram.md", "Phase 1.5 - Azure Reference Architecture Diagram"),
    ("Phase 1.6 Azure Founders Hub Technical Narrative.md", "Phase 1.6 - Azure Founders Hub Technical Narrative"),
    ("Phase 2.1 Executive Pitch Narrative.md", "Phase 2.1 - Executive Pitch Narrative"),
    ("Phase 2.2 Investor Pitch Deck.md", "Phase 2.2 - Investor Pitch Deck"),
    ("Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md", "Phase 2.3 - Market Analysis TAM/SAM/SOM"),
    ("Phase 2.4 Business Model and Pricing Strategy.md", "Phase 2.4 - Business Model and Pricing Strategy"),
    ("Phase 2.5 Go-to-Market Strategy and Financial Projections.md", "Phase 2.5 - Go-to-Market Strategy and Financial Projections"),
    ("Phase 2.6 Financial Model and Funding Strategy.md", "Phase 2.6 - Financial Model and Funding Strategy"),
    ("Phase 2.7 Competitive Differentiation.md", "Phase 2.7 - Competitive Differentiation"),
    ("Phase 2.8 Product Roadmap.md", "Phase 2.8 - Product Roadmap"),
    ("Phase 2.9 Investor FAQ.md", "Phase 2.9 - Investor FAQ"),
    ("Phase 2.10 Demo Script.md", "Phase 2.10 - Demo Script"),
]


FONT_DIR = r"C:\Windows\Fonts"


def sanitize(text):
    """Replace Unicode chars with ASCII equivalents for core fonts."""
    replacements = {
        '\u2013': '-', '\u2014': '--', '\u2018': "'", '\u2019': "'",
        '\u201c': '"', '\u201d': '"', '\u2026': '...', '\u2022': '-',
        '\u2192': '->', '\u2713': '[x]', '\u2717': '[ ]', '\u2714': '[x]',
        '\u2796': '-', '\u2795': '+', '\u2794': '->',
        '\u2611': '[x]', '\u2612': '[ ]', '\u2610': '[ ]',
        '\u25cf': '*', '\u25cb': 'o', '\u25a0': '#', '\u25b2': '^',
        '\u2039': '<', '\u203a': '>', '\u00a7': 'S', '\u00b0': ' deg',
        '\u00d7': 'x', '\u00f7': '/',
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = text.encode('latin-1', errors='replace').decode('latin-1')
    return text


class MasterPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("Arial", "", os.path.join(FONT_DIR, "arial.ttf"), uni=True)
        self.add_font("Arial", "B", os.path.join(FONT_DIR, "arialbd.ttf"), uni=True)
        self.add_font("Arial", "I", os.path.join(FONT_DIR, "ariali.ttf"), uni=True)
        self.add_font("Arial", "BI", os.path.join(FONT_DIR, "arialbi.ttf"), uni=True)
        self.add_font("Courier", "", os.path.join(FONT_DIR, "cour.ttf"), uni=True)
        self.add_font("Courier", "B", os.path.join(FONT_DIR, "courbd.ttf"), uni=True)
        self.set_auto_page_break(auto=True, margin=25)
        self.set_margins(20, 20, 20)

    def header(self):
        if self.page_no() <= 1:
            return
        self.set_font("Arial", "I", 8)
        self.set_text_color(*GRAY)
        self.cell(0, 8, "FS Migration Validation Engine - Technical Master Document", align="L")
        self.cell(0, 8, "Page %d" % self.page_no(), align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(4)

    def footer(self):
        if self.page_no() <= 1:
            return
        self.set_y(-20)
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.3)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(2)
        self.set_font("Arial", "I", 7)
        self.set_text_color(*GRAY)
        self.cell(0, 5, "Version 2.0 - June 2026 | Ready for Review | Confidential", align="C")

    def draw_box(self, x, y, w, h, text, fill=DARK_BLUE, txt_color=WHITE, fs=7, bold=False):
        self.set_draw_color(*fill)
        self.set_line_width(0.5)
        self.set_fill_color(*fill)
        self.rect(x, y, w, h, style="DF")
        self.set_font("Arial", "B" if bold else "", fs)
        self.set_text_color(*txt_color)
        lines = text.split("\n")
        lh = fs * 0.45 + 1
        total_h = len(lines) * lh
        sy = y + (h - total_h) / 2
        for i, line in enumerate(lines):
            self.set_xy(x, sy + i * lh)
            self.cell(w, lh, line, align="C")

    def arrow(self, x1, y1, x2, y2, color=DARK_BLUE, w=0.5):
        self.set_draw_color(*color)
        self.set_line_width(w)
        self.line(x1, y1, x2, y2)
        angle = math.atan2(y2 - y1, x2 - x1)
        al = 3
        self.line(x2, y2, x2 - al * math.cos(angle - 0.4), y2 - al * math.sin(angle - 0.4))
        self.line(x2, y2, x2 - al * math.cos(angle + 0.4), y2 - al * math.sin(angle + 0.4))

    def arrow_down(self, x, y1, y2, color=DARK_BLUE, w=0.5):
        self.arrow(x, y1, x, y2, color, w)

    def arrow_right(self, x1, y, x2, color=DARK_BLUE, w=0.5):
        self.arrow(x1, y, x2, y, color, w)

    def caption(self, text):
        self.ln(4)
        self.set_font("Arial", "I", 8)
        self.set_text_color(*GRAY)
        self.cell(0, 5, text, align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)

    def render_table(self, table_lines):
        if len(table_lines) < 2:
            return
        rows = []
        for tl in table_lines:
            cells = [c.strip() for c in tl.split("|")[1:-1]]
            rows.append(cells)
        if not rows:
            return
        nc = len(rows[0])
        cw = [170.0 / nc] * nc
        self.set_font("Arial", "B", 7)
        self.set_fill_color(*DARK_BLUE)
        self.set_text_color(*WHITE)
        rh = 5
        for j, cell in enumerate(rows[0]):
            if j < nc:
                self.cell(cw[j], rh, sanitize(cell[:30]), border=1, fill=True, align="C")
        self.ln(rh)
        self.set_font("Arial", "", 7)
        self.set_text_color(*BLACK)
        for ri, row in enumerate(rows[1:]):
            self.set_fill_color(*LIGHT_GRAY if ri % 2 == 0 else WHITE)
            for j in range(nc):
                ct = row[j] if j < len(row) else ""
                self.cell(cw[j], rh, sanitize(ct[:30]), border=1, fill=True, align="C")
            self.ln(rh)
        self.ln(3)

    def render_markdown(self, text):
        lines = text.split("\n")
        in_code = False
        code_buf = []
        i = 0
        while i < len(lines):
            line = lines[i]
            stripped = line.strip()
            if stripped.startswith("```"):
                if in_code:
                    in_code = False
                    if code_buf:
                        self.set_font("Courier", "", 7)
                        self.set_text_color(*BLACK)
                        ch = len(code_buf) * 3.5 + 4
                        if self.get_y() + ch > 265:
                            self.add_page()
                        self.set_fill_color(*LIGHT_GRAY)
                        self.rect(22, self.get_y(), 166, ch, style="DF")
                        self.set_xy(25, self.get_y() + 2)
                        for cl in code_buf:
                            self.set_x(25)
                            self.cell(160, 3.5, sanitize(cl[:88]))
                            self.ln(3.5)
                        self.ln(4)
                    code_buf = []
                else:
                    in_code = True
                i += 1
                continue
            if in_code:
                code_buf.append(line[:90])
                i += 1
                continue
            if stripped == "":
                self.ln(2)
                i += 1
                continue
            if stripped.startswith("---"):
                self.set_draw_color(*LIGHT_GRAY)
                self.set_line_width(0.3)
                self.line(25, self.get_y(), 185, self.get_y())
                self.ln(3)
                i += 1
                continue
            if stripped.startswith("# "):
                self.set_font("Arial", "B", 18)
                self.set_text_color(*DARK_BLUE)
                self.cell(0, 10, sanitize(stripped[2:]), new_x="LMARGIN", new_y="NEXT")
                self.set_draw_color(*DARK_BLUE)
                self.set_line_width(0.8)
                self.line(20, self.get_y(), 190, self.get_y())
                self.ln(4)
                i += 1
                continue
            if stripped.startswith("## "):
                if self.get_y() > 250:
                    self.add_page()
                self.set_font("Arial", "B", 14)
                self.set_text_color(*DARK_BLUE)
                self.cell(0, 8, sanitize(stripped[3:]), new_x="LMARGIN", new_y="NEXT")
                self.ln(2)
                i += 1
                continue
            if stripped.startswith("### "):
                self.set_font("Arial", "B", 11)
                self.set_text_color(*MEDIUM_BLUE)
                self.cell(0, 7, sanitize(stripped[4:]), new_x="LMARGIN", new_y="NEXT")
                self.ln(1)
                i += 1
                continue
            if stripped.startswith("|") and "---" in stripped:
                i += 1
                continue
            if stripped.startswith("|"):
                tbl = []
                while i < len(lines) and lines[i].strip().startswith("|"):
                    tbl.append(lines[i].strip())
                    i += 1
                if tbl:
                    self.render_table(tbl)
                continue
            if stripped.startswith("> "):
                self.set_font("Arial", "I", 9)
                self.set_text_color(*MEDIUM_BLUE)
                self.set_fill_color(*LIGHT_BLUE)
                self.rect(22, self.get_y(), 2, 5, style="DF")
                self.set_xy(26, self.get_y())
                self.cell(150, 5, sanitize(stripped[2:]))
                self.ln(6)
                i += 1
                continue
            if stripped.startswith("- ") or stripped.startswith("* "):
                self.set_font("Arial", "", 9)
                self.set_text_color(*BLACK)
                self.set_x(28)
                clean = re.sub(r'\*\*(.*?)\*\*', r'\1', stripped[2:])
                clean = re.sub(r'`(.*?)`', r'\1', clean)
                self.cell(150, 5, sanitize(stripped[:2] + " " + clean))
                self.ln(5)
                i += 1
                continue
            clean = re.sub(r'\*\*(.*?)\*\*', r'\1', stripped)
            clean = re.sub(r'\*(.*?)\*', r'\1', clean)
            clean = re.sub(r'`(.*?)`', r'\1', clean)
            self.set_font("Arial", "", 9)
            self.set_text_color(*BLACK)
            self.multi_cell(170, 5, sanitize(clean))
            self.ln(1)
            i += 1

    # ===== DIAGRAM 1: How It Works Flow =====
    def draw_d1_how_it_works(self):
        y0 = self.get_y() + 5
        bw, bh, gap = 28, 14, 5
        total = 6 * bw + 5 * gap
        x0 = 20 + (170 - total) / 2
        boxes = [
            ("Legacy\nSystem", DARK_BLUE), ("Discovery", DARK_BLUE),
            ("10 Validation\nControls", DARK_BLUE), ("Scoring", DARK_BLUE),
            ("Release\nGate", GREEN), ("Audit\nReport", ORANGE),
        ]
        for i, (label, color) in enumerate(boxes):
            x = x0 + i * (bw + gap)
            self.draw_box(x, y0, bw, bh, label, fill=color, fs=7, bold=True)
            if i < len(boxes) - 1:
                self.arrow_right(x + bw, y0 + bh / 2, x + bw + gap, color=DARK_BLUE, w=0.6)
        gx = x0 + 4 * (bw + gap) + bw / 2
        self.arrow_down(gx, y0 + bh, y0 + bh + 8, color=GREEN, w=0.6)
        self.set_font("Arial", "B", 7)
        self.set_text_color(*GREEN)
        self.set_xy(gx - 15, y0 + bh + 2)
        self.cell(30, 5, "Approved / Blocked", align="C")
        self.set_y(y0 + bh + 14)

    # ===== DIAGRAM 2: Platform Architecture =====
    def draw_d2_platform_arch(self):
        y0 = self.get_y() + 3
        cx, bw, bh, ag = 105, 60, 10, 4
        self.draw_box(cx - bw/2, y0, bw, bh, "Users / CLI / API", fill=GRAY, fs=8, bold=True)
        self.arrow_down(cx, y0 + bh, y0 + bh + ag)
        y1 = y0 + bh + ag
        self.draw_box(cx - bw/2, y1, bw, bh, "API Layer (FastAPI)", fill=MEDIUM_BLUE, fs=8, bold=True)
        self.arrow_down(cx, y1 + bh, y1 + bh + ag)
        y2 = y1 + bh + ag
        ch = 14
        self.draw_box(cx - bw/2, y2, bw, ch, "Platform Core\n(Orchestrator)", fill=DARK_BLUE, fs=8, bold=True)
        self.arrow_down(cx, y2 + ch, y2 + ch + ag)
        y3 = y2 + ch + ag
        ew = 35
        engs = ["Discovery Engine", "Validation Engine", "Scoring Engine"]
        xps = [cx - ew - 5, cx - ew/2, cx + 5]
        for j, (eng, xp) in enumerate(zip(engs, xps)):
            self.draw_box(xp, y3, ew, bh, eng, fill=MEDIUM_BLUE, fs=7, bold=True)
        self.arrow_down(cx, y3 + bh, y3 + bh + ag)
        y4 = y3 + bh + ag
        self.draw_box(cx - bw/2, y4, bw, bh, "Governance Engine", fill=MEDIUM_BLUE, fs=8, bold=True)
        self.arrow_down(cx, y4 + bh, y4 + bh + ag)
        y5 = y4 + bh + ag
        self.draw_box(cx - bw/2, y5, bw, bh, "Database (PostgreSQL)", fill=DARK_BLUE, fs=8, bold=True)
        self.set_y(y5 + bh + 8)

    # ===== DIAGRAM 3: Control Dependency DAG =====
    def draw_d3_control_dag(self):
        y0 = self.get_y() + 3
        bw, bh, vg = 16, 8, 6
        cx = 105
        c01x = cx - bw / 2
        c01y = y0
        self.draw_box(c01x, c01y, bw, bh, "C01", fill=DARK_BLUE, fs=8, bold=True)
        c02y = c01y + bh + vg
        self.arrow_down(cx, c01y + bh, c02y)
        self.draw_box(c01x, c02y, bw, bh, "C02", fill=DARK_BLUE, fs=8, bold=True)
        c03y = c02y + bh + vg
        self.arrow_down(cx, c02y + bh, c03y)
        self.draw_box(c01x, c03y, bw, bh, "C03", fill=DARK_BLUE, fs=8, bold=True)
        c09x = cx + 30
        self.arrow_right(c01x + bw, c03y + bh / 2, c09x)
        self.draw_box(c09x, c03y, bw, bh, "C09", fill=MEDIUM_BLUE, fs=8, bold=True)
        c04y = c03y + bh + vg
        self.arrow_down(cx, c03y + bh, c04y)
        self.draw_box(c01x, c04y, bw, bh, "C04", fill=DARK_BLUE, fs=8, bold=True)
        chain = ["C05", "C06", "C07", "C08", "C010"]
        chx = c01x
        for ctrl in chain:
            nx = chx + bw + 6
            self.arrow_right(chx + bw, c04y + bh / 2, nx)
            self.draw_box(nx, c04y, bw, bh, ctrl, fill=DARK_BLUE, fs=8, bold=True)
            chx = nx
        self.set_y(c04y + bh + 12)

    # ===== DIAGRAM 4: Azure Architecture =====
    def draw_d4_azure_arch(self):
        y0 = self.get_y() + 3
        cx, bw, bh, ag = 105, 55, 8, 4
        self.draw_box(cx - bw/2, y0, bw, bh, "Users / CLI / DevOps", fill=GRAY, fs=7, bold=True)
        self.arrow_down(cx, y0 + bh, y0 + bh + ag)
        y1 = y0 + bh + ag
        self.draw_box(cx - bw/2, y1, bw, bh, "Azure Front Door", fill=MEDIUM_BLUE, fs=7, bold=True)
        self.arrow_down(cx, y1 + bh, y1 + bh + ag)
        y2 = y1 + bh + ag
        self.draw_box(cx - bw/2, y2, bw, bh, "Azure API Management", fill=MEDIUM_BLUE, fs=7, bold=True)
        self.arrow_down(cx, y2 + bh, y2 + bh + ag)
        y3 = y2 + bh + ag
        self.draw_box(cx - bw/2, y3, bw, bh, "Microsoft Entra ID", fill=MEDIUM_BLUE, fs=7, bold=True)
        self.arrow_down(cx, y3 + bh, y3 + bh + ag)
        y4 = y3 + bh + ag
        core_h = 12
        self.draw_box(cx - bw/2, y4, bw, core_h, "Platform Core\n(Container Apps)", fill=DARK_BLUE, fs=7, bold=True)
        self.arrow_down(cx, y4 + core_h, y4 + core_h + ag)
        y5 = y4 + core_h + ag
        ew = 30
        engs = ["Discovery", "Validation", "Scoring", "Governance", "Reports"]
        tw = 5 * ew + 4 * 5
        ex0 = cx - tw / 2
        for j, eng in enumerate(engs):
            ex = ex0 + j * (ew + 5)
            self.draw_box(ex, y5, ew, bh, eng, fill=MEDIUM_BLUE, fs=6, bold=True)
        self.arrow_down(cx, y5 + bh, y5 + bh + ag)
        y6 = y5 + bh + ag
        sw = 38
        self.draw_box(cx - sw - 5, y6, sw, bh, "Azure SQL / PostgreSQL", fill=DARK_BLUE, fs=6, bold=True)
        self.draw_box(cx + 5, y6, sw, bh, "Azure Blob Storage", fill=DARK_BLUE, fs=6, bold=True)
        self.arrow_down(cx, y6 + bh, y6 + bh + ag)
        y7 = y6 + bh + ag
        self.draw_box(cx - sw/2, y7, sw, bh, "Azure Key Vault", fill=DARK_BLUE, fs=6, bold=True)
        self.set_y(y7 + bh + 8)

    # ===== DIAGRAM 5: Five Platform Pillars =====
    def draw_d5_pillars(self):
        y0 = self.get_y() + 5
        pw, ph, gap = 30, 25, 3
        total = 5 * pw + 4 * gap
        x0 = 20 + (170 - total) / 2
        pillars = [
            ("Enterprise\nDiscovery", GREEN, "Built"),
            ("Intelligent\nMapping", GREEN, "Built"),
            ("Migration\nValidation", GREEN, "Built"),
            ("Governance\n& Audit", GREEN, "Built"),
            ("AI Intelligence\nLayer", ORANGE, "In Dev"),
        ]
        for i, (name, color, status) in enumerate(pillars):
            x = x0 + i * (pw + gap)
            self.draw_box(x, y0, pw, ph, name, fill=color, fs=7, bold=True)
            self.set_font("Arial", "I", 6)
            self.set_text_color(*WHITE)
            self.set_xy(x, y0 + ph - 5)
            self.cell(pw, 4, status, align="C")
        self.set_y(y0 + ph + 10)

    # ===== DIAGRAM 6: CI/CD Pipeline =====
    def draw_d6_cicd(self):
        y0 = self.get_y() + 5
        stages = ["Commit", "Build", "Unit\nTests", "Security\nScan", "Container\nBuild", "Deploy\nTest", "Integration\nTests", "Production"]
        bw, bh, gap = 19, 14, 3
        total = len(stages) * bw + (len(stages) - 1) * gap
        x0 = 20 + (170 - total) / 2
        colors = [GRAY, DARK_BLUE, MEDIUM_BLUE, ORANGE, MEDIUM_BLUE, MEDIUM_BLUE, MEDIUM_BLUE, GREEN]
        for i, (stage, color) in enumerate(zip(stages, colors)):
            x = x0 + i * (bw + gap)
            self.draw_box(x, y0, bw, bh, stage, fill=color, fs=6, bold=True)
            if i < len(stages) - 1:
                self.arrow_right(x + bw, y0 + bh / 2, x + bw + gap, color=DARK_BLUE, w=0.4)
        self.set_y(y0 + bh + 10)

    # ===== DIAGRAM 7: Business Flow =====
    def draw_d7_biz_flow(self):
        y0 = self.get_y() + 5
        bw, bh, gap = 38, 20, 8
        total = 4 * bw + 3 * gap
        x0 = 20 + (170 - total) / 2
        boxes = [
            ("Discover", "10 Controls", DARK_BLUE),
            ("Validate", "Objective Metrics", MEDIUM_BLUE),
            ("Score", "Release Gates", GREEN),
            ("Govern", "Audit Trail", ORANGE),
        ]
        for i, (main, sub, color) in enumerate(boxes):
            x = x0 + i * (bw + gap)
            self.draw_box(x, y0, bw, bh, main, fill=color, fs=9, bold=True)
            self.set_font("Arial", "I", 6)
            self.set_text_color(*WHITE)
            self.set_xy(x, y0 + bh - 6)
            self.cell(bw, 5, sub, align="C")
            if i < len(boxes) - 1:
                self.arrow_right(x + bw, y0 + bh / 2, x + bw + gap, color=DARK_BLUE, w=0.6)
        self.set_y(y0 + bh + 10)

    # ===== DIAGRAM 8: TAM/SAM/SOM =====
    def draw_d8_tam_sam_som(self):
        y0 = self.get_y() + 5
        cx, cy = 105, y0 + 35
        for r, label, color, fs in [(35, "$8-12B TAM", DARK_BLUE, 9), (25, "$1.5-2.5B SAM", MEDIUM_BLUE, 8)]:
            self.set_draw_color(*color)
            self.set_line_width(1)
            self.ellipse(cx - r, cy - r, 2 * r, 2 * r, style="D")
            self.set_font("Arial", "B", fs)
            self.set_text_color(*color)
            self.set_xy(cx - r, cy - r + (10 if r == 35 else 12))
            self.cell(2 * r, 5, label, align="C")
        self.set_draw_color(*GREEN)
        self.set_fill_color(*GREEN)
        self.set_line_width(1)
        self.ellipse(cx - 12, cy - 12, 24, 24, style="DF")
        self.set_font("Arial", "B", 7)
        self.set_text_color(*WHITE)
        self.set_xy(cx - 12, cy - 4)
        self.cell(24, 5, "$10-30M", align="C")
        self.set_xy(cx - 12, cy + 1)
        self.cell(24, 5, "SOM", align="C")
        self.set_y(cy + 45)

    # ===== DIAGRAM 9: Competitive Quadrant =====
    def draw_d9_quadrant(self):
        y0 = self.get_y() + 3
        ox, oy = 45, y0 + 5
        qw, qh = 65, 50
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.8)
        self.line(ox, oy + qh, ox + qw, oy + qh)
        self.line(ox, oy, ox, oy + qh)
        self.set_font("Arial", "B", 7)
        self.set_text_color(*DARK_BLUE)
        self.set_xy(ox - 5, oy - 8)
        self.cell(qw + 10, 5, "Governance Capability", align="C")
        self.set_xy(ox + qw / 2 - 15, oy + qh + 3)
        self.cell(30, 5, "Migration Focus", align="C")
        self.set_draw_color(*LIGHT_GRAY)
        self.set_line_width(0.3)
        self.line(ox + qw / 2, oy, ox + qw / 2, oy + qh)
        self.line(ox, oy + qh / 2, ox + qw, oy + qh / 2)
        pts = [
            (ox + qw * 0.82, oy + qh * 0.15, "Our Platform", GREEN),
            (ox + qw * 0.78, oy + qh * 0.75, "ETL Tools", ORANGE),
            (ox + qw * 0.22, oy + qh * 0.25, "Data Quality", GRAY),
            (ox + qw * 0.25, oy + qh * 0.80, "Manual", GRAY),
        ]
        for px, py, label, color in pts:
            self.set_fill_color(*color)
            self.ellipse(px - 4, py - 4, 8, 8, style="DF")
            self.set_font("Arial", "B", 6)
            self.set_text_color(*color)
            self.set_xy(px - 15, py + 5)
            self.cell(30, 4, label, align="C")
        self.set_y(oy + qh + 18)

    # ===== DIAGRAM 10: Revenue Bar Chart =====
    def draw_d10_revenue(self):
        y0 = self.get_y() + 5
        ox, oy = 45, y0
        cw, ch = 100, 50
        vals = [550, 2700, 8900]
        saas = [450, 2400, 8400]
        svcs = [100, 300, 500]
        mx = 10000
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.5)
        self.line(ox, oy, ox, oy + ch)
        self.line(ox, oy + ch, ox + cw, oy + ch)
        for tick in [0, 2000, 4000, 6000, 8000, 10000]:
            ty = oy + ch - (tick / mx) * ch
            self.set_draw_color(*LIGHT_GRAY)
            self.set_line_width(0.2)
            self.line(ox, ty, ox + cw, ty)
            self.set_font("Arial", "", 6)
            self.set_text_color(*GRAY)
            self.set_xy(ox - 18, ty - 2)
            self.cell(15, 4, "%dK" % (tick // 1000) if tick > 0 else "0", align="R")
        bw, bg = 22, 12
        for i in range(3):
            bx = ox + 15 + i * (bw + bg)
            sh = (saas[i] / mx) * ch
            vh = (svcs[i] / mx) * ch
            self.set_fill_color(*MEDIUM_BLUE)
            self.rect(bx, oy + ch - sh - vh, bw, sh, style="DF")
            self.set_fill_color(*LIGHT_BLUE)
            self.rect(bx, oy + ch - vh, bw, vh, style="DF")
            self.set_font("Arial", "B", 7)
            self.set_text_color(*DARK_BLUE)
            self.set_xy(bx, oy + ch - sh - vh - 6)
            self.cell(bw, 5, "%dK" % (vals[i] // 1000), align="C")
            self.set_font("Arial", "", 7)
            self.set_xy(bx, oy + ch + 2)
            self.cell(bw, 4, "Year %d" % (i + 1), align="C")
        self.set_xy(ox, oy + ch + 8)
        self.set_font("Arial", "", 6)
        self.set_fill_color(*MEDIUM_BLUE)
        self.rect(ox, oy + ch + 8, 4, 3, style="DF")
        self.set_xy(ox + 5, oy + ch + 7)
        self.cell(20, 4, "SaaS Revenue")
        self.set_fill_color(*LIGHT_BLUE)
        self.rect(ox + 30, oy + ch + 8, 4, 3, style="DF")
        self.set_xy(ox + 35, oy + ch + 7)
        self.cell(30, 4, "Professional Services")
        self.set_y(oy + ch + 18)

    # ===== DIAGRAM 11: Channel Stacked Bar =====
    def draw_d11_channels(self):
        y0 = self.get_y() + 5
        ox, oy = 45, y0
        cw, ch = 100, 45
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.5)
        self.line(ox, oy, ox, oy + ch)
        self.line(ox, oy + ch, ox + cw, oy + ch)
        for tick in [0, 20, 40, 60, 80, 100]:
            ty = oy + ch - (tick / 100) * ch
            self.set_draw_color(*LIGHT_GRAY)
            self.set_line_width(0.2)
            self.line(ox, ty, ox + cw, ty)
            self.set_font("Arial", "", 6)
            self.set_text_color(*GRAY)
            self.set_xy(ox - 12, ty - 2)
            self.cell(10, 4, "%d%%" % tick, align="R")
        bw, bg = 22, 12
        channels = [
            ("Direct", [60, 40, 25], DARK_BLUE),
            ("Marketplace", [20, 25, 30], MEDIUM_BLUE),
            ("SI", [10, 20, 25], LIGHT_BLUE),
            ("Co-Sell", [5, 10, 15], GREEN),
            ("Inbound", [5, 5, 5], GRAY),
        ]
        for i in range(3):
            bx = ox + 15 + i * (bw + bg)
            cum = 0
            for _, vals, color in channels:
                h = (vals[i] / 100) * ch
                self.set_fill_color(*color)
                self.rect(bx, oy + ch - cum - h, bw, h, style="DF")
                cum += h
            self.set_font("Arial", "", 7)
            self.set_text_color(*DARK_BLUE)
            self.set_xy(bx, oy + ch + 2)
            self.cell(bw, 4, "Year %d" % (i + 1), align="C")
        self.set_y(oy + ch + 10)

    # ===== DIAGRAM 12: EBITDA Trajectory =====
    def draw_d12_ebitda(self):
        y0 = self.get_y() + 5
        ox, oy = 45, y0
        cw, ch = 100, 45
        vals = [50, 1734, 6980]
        labels = ["Year 1", "Year 2", "Year 3"]
        mx = 8000
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(0.5)
        self.line(ox, oy, ox, oy + ch)
        self.line(ox, oy + ch, ox + cw, oy + ch)
        for tick in [0, 2000, 4000, 6000, 8000]:
            ty = oy + ch - (tick / mx) * ch
            self.set_draw_color(*LIGHT_GRAY)
            self.set_line_width(0.2)
            self.line(ox, ty, ox + cw, ty)
            self.set_font("Arial", "", 6)
            self.set_text_color(*GRAY)
            self.set_xy(ox - 18, ty - 2)
            self.cell(15, 4, "%dM" % (tick // 1000) if tick > 0 else "0", align="R")
        pts = []
        for i in range(3):
            px = ox + 15 + i * 40
            py = oy + ch - (vals[i] / mx) * ch
            pts.append((px, py))
        self.set_line_width(1)
        self.set_draw_color(*MEDIUM_BLUE)
        for i in range(len(pts) - 1):
            self.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])
        self.set_fill_color(*LIGHT_BLUE)
        for i in range(len(pts) - 1):
            x1, y1 = pts[i]
            x2 = pts[i + 1][0]
            self.set_draw_color(*LIGHT_BLUE)
            self.set_line_width(0.3)
            poly_pts = [(x1, y1), (x2, pts[i + 1][1]), (x2, oy + ch), (x1, oy + ch)]
            for j in range(len(poly_pts) - 1):
                self.line(poly_pts[j][0], poly_pts[j][1], poly_pts[j + 1][0], poly_pts[j + 1][1])
            self.line(poly_pts[-1][0], poly_pts[-1][1], poly_pts[0][0], poly_pts[0][1])
        for i, (px, py) in enumerate(pts):
            self.set_fill_color(*MEDIUM_BLUE)
            self.ellipse(px - 3, py - 3, 6, 6, style="DF")
            self.set_font("Arial", "B", 7)
            self.set_text_color(*DARK_BLUE)
            vtxt = "%dK" % vals[i] if vals[i] < 1000 else ".%dM" % (vals[i] // 1000)
            if vals[i] >= 1000:
                vtxt = "%dM" % (vals[i] / 1000)
            self.set_xy(px - 12, py - 10)
            self.cell(24, 5, vtxt, align="C")
            self.set_font("Arial", "", 7)
            self.set_xy(px - 12, oy + ch + 2)
            self.cell(24, 4, labels[i], align="C")
        self.set_y(oy + ch + 12)

    # ===== DIAGRAM 13: Use of Funds Pie =====
    def draw_d13_pie(self):
        y0 = self.get_y() + 3
        cx, cy = 105, y0 + 30
        r = 28
        segs = [
            (40, "Product Dev 40%", DARK_BLUE),
            (20, "AI Mapping 20%", MEDIUM_BLUE),
            (20, "Customer Pilots 20%", LIGHT_BLUE),
            (10, "Security 10%", GREEN),
            (10, "Marketplace 10%", ORANGE),
        ]
        start = 0
        for pct, label, color in segs:
            sweep = pct / 100 * 360
            end = start + sweep
            steps = max(int(sweep / 2), 3)
            pts = [(cx, cy)]
            for s in range(steps + 1):
                a = math.radians(start + sweep * s / steps)
                pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
            pts.append((cx, cy))
            self.set_fill_color(*color)
            self.set_draw_color(*WHITE)
            self.set_line_width(1)
            for j in range(1, len(pts) - 1):
                x1, y1 = pts[0]
                x2, y2 = pts[j]
                x3, y3 = pts[j + 1]
                self.set_fill_color(*color)
                self.set_draw_color(*WHITE)
                self.set_line_width(0.3)
                self.polygon([pts[0], pts[j], pts[j + 1]], style="DF")
            mid_a = math.radians(start + sweep / 2)
            mx = cx + r * 0.65 * math.cos(mid_a)
            my = cy + r * 0.65 * math.sin(mid_a)
            self.set_font("Arial", "B", 6)
            self.set_text_color(*WHITE)
            self.set_xy(mx - 12, my - 2)
            self.cell(24, 4, "%d%%" % pct, align="C")
            start = end
        for i, (pct, label, color) in enumerate(segs):
            self.set_fill_color(*color)
            lx, ly = 25, y0 + 65 + i * 5
            self.rect(lx, ly, 4, 3, style="DF")
            self.set_font("Arial", "", 6)
            self.set_text_color(*BLACK)
            self.set_xy(lx + 6, ly - 1)
            self.cell(40, 4, label)
        self.set_y(y0 + 65 + len(segs) * 5 + 8)

    # ===== DIAGRAM 14: Roadmap Timeline =====
    def draw_d14_roadmap(self):
        y0 = self.get_y() + 5
        phases = [
            ("Phase 1", "Complete", GREEN, ["CLI Engine", "10 Controls", "Scoring", "Docker"]),
            ("Phase 2", "In Dev", ORANGE, ["Web Dashboard", "AI Mapping", "Enterprise SSO"]),
            ("Phase 3", "Planned", GRAY, ["Multi-tenant SaaS", "Marketplace", "SI Partners"]),
            ("Phase 4", "Future", GRAY, ["AI Agents", "Fabric Integration", "Global"]),
        ]
        pw, ph, gap = 38, 35, 5
        total = 4 * pw + 3 * gap
        x0 = 20 + (170 - total) / 2
        bar_y = y0 + 5
        self.set_draw_color(*DARK_BLUE)
        self.set_line_width(2)
        self.line(x0, bar_y + 6, x0 + total, bar_y + 6)
        for i, (name, status, color, caps) in enumerate(phases):
            x = x0 + i * (pw + gap)
            self.set_fill_color(*color)
            self.ellipse(x + pw / 2 - 4, bar_y + 2, 8, 8, style="DF")
            self.set_font("Arial", "B", 7)
            self.set_text_color(*color)
            self.set_xy(x, bar_y - 5)
            self.cell(pw, 5, name, align="C")
            self.set_font("Arial", "I", 6)
            self.set_xy(x, bar_y + 12)
            self.cell(pw, 4, status, align="C")
            self.set_font("Arial", "", 6)
            self.set_text_color(*BLACK)
            for j, cap in enumerate(caps):
                self.set_xy(x, bar_y + 17 + j * 4)
                self.cell(pw, 4, "- " + cap, align="C")
        self.set_y(y0 + ph + 10)

    # ===== DIAGRAM 15: Architecture Evolution =====
    def draw_d15_evolution(self):
        y0 = self.get_y() + 5
        bw, bh = 65, 40
        gap = 15
        xl = 25
        xr = 25 + bw + gap
        self.set_draw_color(*MEDIUM_BLUE)
        self.set_line_width(0.8)
        self.rect(xl, y0, bw, bh, style="D")
        self.set_font("Arial", "B", 9)
        self.set_text_color(*MEDIUM_BLUE)
        self.set_xy(xl, y0 + 2)
        self.cell(bw, 5, "Current", align="C")
        for j, item in enumerate(["CLI + API", "Platform Core", "Validation Controls"]):
            self.set_font("Arial", "", 7)
            self.set_text_color(*BLACK)
            self.set_xy(xl + 5, y0 + 9 + j * 6)
            self.cell(bw - 10, 5, "- " + item)
        self.set_draw_color(*GREEN)
        self.rect(xr, y0, bw, bh, style="D")
        self.set_font("Arial", "B", 9)
        self.set_text_color(*GREEN)
        self.set_xy(xr, y0 + 2)
        self.cell(bw, 5, "Future", align="C")
        for j, item in enumerate(["Web UI + API", "Platform Core", "Discovery, Mapping", "Validation, Scoring", "AI, Governance"]):
            self.set_font("Arial", "", 7)
            self.set_text_color(*BLACK)
            self.set_xy(xr + 5, y0 + 9 + j * 5)
            self.cell(bw - 10, 4, "- " + item)
        self.arrow_right(xl + bw + 2, y0 + bh / 2, xr - 2, color=DARK_BLUE, w=1)
        self.set_y(y0 + bh + 10)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    pdf = MasterPDF()

    # Cover page
    pdf.add_page()
    pdf.ln(50)
    pdf.set_font("Arial", "B", 28)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 15, "FS Migration Validation Engine", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.set_font("Arial", "", 18)
    pdf.set_text_color(*MEDIUM_BLUE)
    pdf.cell(0, 12, "Microsoft Founders Hub Application Pack", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(15)
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(1)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(15)
    pdf.set_font("Arial", "B", 16)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 12, "Technical Master Document with Diagrams", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    pdf.set_font("Arial", "", 14)
    pdf.set_text_color(*MEDIUM_BLUE)
    pdf.cell(0, 10, "Version 2.0 - June 2026", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.set_font("Arial", "B", 12)
    pdf.set_text_color(*GREEN)
    pdf.cell(0, 10, "Status: Ready for Review", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(30)
    pdf.set_font("Arial", "", 10)
    pdf.set_text_color(*GRAY)
    pdf.cell(0, 8, "Based on: FS Migration Validation Engine v1.4", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "Target Program: Microsoft for Startups Founders Hub", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "Classification: Confidential", align="C", new_x="LMARGIN", new_y="NEXT")

    # Table of Contents
    pdf.add_page()
    pdf.set_font("Arial", "B", 22)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 12, "Table of Contents", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)
    pdf.set_draw_color(*DARK_BLUE)
    pdf.set_line_width(0.8)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(8)
    toc = [
        ("1", "Phase 1 - Azure Founders Hub Pack (Overview)"),
        ("1.1", "Product Overview"),
        ("1.2", "Technical Architecture"),
        ("1.3", "Platform Core Definition"),
        ("1.4", "Azure Cloud Architecture"),
        ("1.5", "Azure Reference Architecture Diagram"),
        ("1.6", "Azure Founders Hub Technical Narrative"),
        ("2", "Phase 2 - Commercial & Investor Readiness"),
        ("2.1", "Executive Pitch Narrative"),
        ("2.2", "Investor Pitch Deck"),
        ("2.3", "Market Analysis TAM/SAM/SOM"),
        ("2.4", "Business Model & Pricing Strategy"),
        ("2.5", "Go-to-Market Strategy & Financial Projections"),
        ("2.6", "Financial Model & Funding Strategy"),
        ("2.7", "Competitive Differentiation"),
        ("2.8", "Product Roadmap"),
        ("2.9", "Investor FAQ"),
        ("2.10", "Demo Script"),
    ]
    for num, title in toc:
        is_main = "." not in num
        if is_main:
            pdf.set_font("Arial", "B", 11)
            pdf.set_text_color(*DARK_BLUE)
        else:
            pdf.set_font("Arial", "", 10)
            pdf.set_text_color(*BLACK)
        indent = 0 if is_main else 5
        pdf.set_x(25 + indent)
        pdf.cell(140 - indent, 7, "%s  %s" % (num, title))
        pdf.ln(7)

    # Process each document
    for idx, (filename, display_title) in enumerate(DOCUMENT_FILES):
        filepath = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(filepath):
            print("WARNING: File not found: %s" % filename)
            continue
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.set_text_color(*DARK_BLUE)
        pdf.cell(0, 10, display_title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(*DARK_BLUE)
        pdf.set_line_width(0.8)
        pdf.line(20, pdf.get_y(), 190, pdf.get_y())
        pdf.ln(6)

        pdf.render_markdown(content)

        # Insert diagrams at appropriate points
        if "Phase 1 - Azure Founders Hub Pack" in display_title:
            pdf.add_page()
            pdf.draw_d5_pillars()
            pdf.caption("Figure 1: The Five Platform Pillars")

        elif "Phase 1.1 - Product Overview" in display_title:
            pdf.add_page()
            pdf.draw_d1_how_it_works()
            pdf.caption("Figure 2: How It Works - Legacy System to Audit Report Flow")

        elif "Phase 1.2 - Technical Architecture" in display_title:
            pdf.add_page()
            pdf.draw_d2_platform_arch()
            pdf.caption("Figure 3: Platform Architecture Diagram")
            pdf.ln(5)
            pdf.draw_d15_evolution()
            pdf.caption("Figure 4: Architecture Evolution - Current to Future")

        elif "Phase 1.3 - Platform Core Definition" in display_title:
            pdf.add_page()
            pdf.draw_d3_control_dag()
            pdf.caption("Figure 5: Control Dependency DAG - C01 to C010 Execution Order")

        elif "Phase 1.4 - Azure Cloud Architecture" in display_title:
            pdf.add_page()
            pdf.draw_d4_azure_arch()
            pdf.caption("Figure 6: Azure Cloud Architecture - Service Integration")
            pdf.ln(5)
            pdf.draw_d6_cicd()
            pdf.caption("Figure 7: CI/CD Pipeline Stages")

        elif "Phase 2.1 - Executive Pitch Narrative" in display_title:
            pdf.add_page()
            pdf.draw_d7_biz_flow()
            pdf.caption("Figure 8: Business Flow - Discover, Validate, Score, Govern")

        elif "Phase 2.3 - Market Analysis" in display_title:
            pdf.add_page()
            pdf.draw_d8_tam_sam_som()
            pdf.caption("Figure 9: TAM / SAM / SOM Market Sizing")
            pdf.ln(3)
            pdf.draw_d9_quadrant()
            pdf.caption("Figure 10: Competitive Positioning Quadrant")

        elif "Phase 2.5 - Go-to-Market" in display_title:
            pdf.add_page()
            pdf.draw_d11_channels()
            pdf.caption("Figure 11: Channel Contribution by Year")
            pdf.ln(3)
            pdf.draw_d10_revenue()
            pdf.caption("Figure 12: Revenue Growth - 3-Year Projection")

        elif "Phase 2.6 - Financial Model" in display_title:
            pdf.add_page()
            pdf.draw_d12_ebitda()
            pdf.caption("Figure 13: EBITDA Trajectory")
            pdf.ln(3)
            pdf.draw_d13_pie()
            pdf.caption("Figure 14: Use of Funds - Seed Round Allocation")

        elif "Phase 2.8 - Product Roadmap" in display_title:
            pdf.add_page()
            pdf.draw_d14_roadmap()
            pdf.caption("Figure 15: Product Roadmap Timeline")

    pdf.output(OUTPUT_FILE)
    print("PDF generated successfully!")
    print("Output: %s" % OUTPUT_FILE)
    print("Total pages: %d" % pdf.page_no())


if __name__ == "__main__":
    main()
