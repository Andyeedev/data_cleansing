"""
FS Migration Validation Engine - Microsoft Founders Hub Application Pack
Professional PDF Document Generator using fpdf2
"""

import os
import re
import sys
from fpdf import FPDF


def sanitize_unicode(text):
    """Replace Unicode characters with ASCII equivalents for core fonts."""
    if not text:
        return text
    replacements = {
        '\u2013': '-',   # en-dash
        '\u2014': '--',  # em-dash
        '\u2018': "'",   # left single quote
        '\u2019': "'",   # right single quote
        '\u201c': '"',   # left double quote
        '\u201d': '"',   # right double quote
        '\u2022': '-',   # bullet
        '\u2026': '...', # ellipsis
        '\u2714': '[Y]', # check mark
        '\u2718': '[N]', # cross mark
        '\u2705': '[Y]', # green check
        '\u274c': '[N]', # red cross
        '\u26a0': '[!]', # warning
        '\u2713': '[Y]', # check
        '\u2717': '[N]', # cross
        '\u25cf': '*',   # filled circle
        '\u25cb': 'o',   # empty circle
        '\u25b6': '>',   # right triangle
        '\u25bc': 'v',   # down triangle
        '\u00b0': 'deg', # degree
        '\u00a3': 'GBP', # pound sign
        '\u00d7': 'x',   # multiplication
        '\u2264': '<=',  # less than or equal
        '\u2265': '>=',  # greater than or equal
        '\u2192': '->',  # right arrow
        '\u2190': '<-',  # left arrow
        '\u2194': '<->', # left-right arrow
        '\u2191': '^',   # up arrow
        '\u2193': 'v',   # down arrow
        '\u00e2': 'a',   # replacement for corrupted chars
        '\u0080': '',
        '\u009d': '',
        '\ufffd': '?',   # replacement character
    }
    for unicode_char, ascii_char in replacements.items():
        text = text.replace(unicode_char, ascii_char)
    # Remove any remaining non-latin-1 characters
    result = []
    for char in text:
        try:
            char.encode('latin-1')
            result.append(char)
        except UnicodeEncodeError:
            result.append('?')
    return ''.join(result)


class FoundersHubPDF(FPDF):
    """Custom PDF class with headers and footers."""

    def __init__(self):
        super().__init__(orientation='P', unit='mm', format='A4')
        self.set_auto_page_break(auto=True, margin=25)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('Helvetica', 'B', 8)
        self.set_text_color(0, 51, 102)
        self.cell(0, 5, sanitize_unicode('FS Migration Validation Engine'), align='L')
        self.cell(0, 5, sanitize_unicode('Microsoft Founders Hub Application'), align='R', new_x='LMARGIN', new_y='NEXT')
        self.set_draw_color(0, 51, 102)
        self.line(10, 12, 200, 12)
        self.ln(5)

    def footer(self):
        self.set_y(-20)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')


class MarkdownToPDFConverter:
    """Converts markdown content to professionally formatted PDF."""

    def __init__(self, pdf):
        self.pdf = pdf
        self.DARK_BLUE = (0, 51, 102)
        self.DARK_GRAY = (51, 51, 51)
        self.MEDIUM_GRAY = (128, 128, 128)
        self.LIGHT_GRAY_BG = (240, 240, 240)
        self.TABLE_HEADER_BG = (0, 51, 102)
        self.TABLE_ALT_ROW = (245, 245, 250)
        self.WHITE = (255, 255, 255)
        self.MAX_Y = 270

    def check_page_space(self, needed=20):
        if self.pdf.get_y() + needed > self.MAX_Y:
            self.pdf.add_page()
            return True
        return False

    def render_cover_page(self):
        self.pdf.add_page()
        self.pdf.set_font('Helvetica', 'B', 28)
        self.pdf.set_text_color(*self.DARK_BLUE)
        self.pdf.ln(60)
        self.pdf.multi_cell(0, 14, sanitize_unicode('FS Migration Validation Engine'), align='C')
        self.pdf.ln(8)
        self.pdf.set_font('Helvetica', '', 16)
        self.pdf.set_text_color(*self.DARK_GRAY)
        self.pdf.multi_cell(0, 10, sanitize_unicode('Microsoft Founders Hub Application Pack'), align='C')
        self.pdf.ln(15)
        self.pdf.set_draw_color(*self.DARK_BLUE)
        self.pdf.set_line_width(0.8)
        self.pdf.line(60, self.pdf.get_y(), 150, self.pdf.get_y())
        self.pdf.ln(15)
        self.pdf.set_font('Helvetica', 'B', 14)
        self.pdf.set_text_color(*self.DARK_BLUE)
        self.pdf.multi_cell(0, 8, sanitize_unicode('Technical Master Document'), align='C')
        self.pdf.ln(10)
        self.pdf.set_font('Helvetica', '', 12)
        self.pdf.set_text_color(*self.DARK_GRAY)
        self.pdf.multi_cell(0, 8, sanitize_unicode('Version 2.0 - June 2026'), align='C')
        self.pdf.ln(8)
        self.pdf.set_font('Helvetica', 'B', 12)
        self.pdf.set_text_color(0, 128, 0)
        self.pdf.multi_cell(0, 8, sanitize_unicode('Status: Ready for Review'), align='C')
        self.pdf.ln(30)
        self.pdf.set_font('Helvetica', '', 10)
        self.pdf.set_text_color(*self.MEDIUM_GRAY)
        self.pdf.multi_cell(0, 6, sanitize_unicode('Confidential - For Microsoft Founders Hub Review'), align='C')

    def render_toc(self):
        self.pdf.add_page()
        self._add_section_title('Table of Contents')
        self.pdf.ln(5)
        toc_items = [
            ('Phase 1', 'Azure Founders Hub Pack - Overview'),
            ('Phase 1.1', 'Product Overview'),
            ('Phase 1.2', 'Technical Architecture'),
            ('Phase 1.3', 'Platform Core Definition'),
            ('Phase 1.4', 'Azure Cloud Architecture'),
            ('Phase 1.5', 'Azure Reference Architecture Diagram'),
            ('Phase 1.6', 'Azure Founders Hub Technical Narrative'),
            ('Phase 2.1', 'Executive Pitch Narrative'),
            ('Phase 2.2', 'Investor Pitch Deck'),
            ('Phase 2.3', 'Market Analysis TAM/SAM/SOM'),
            ('Phase 2.4', 'Business Model & Pricing Strategy'),
            ('Phase 2.5', 'Go-to-Market Strategy & Financial Projections'),
            ('Phase 2.6', 'Financial Model & Funding Strategy'),
            ('Phase 2.7', 'Competitive Differentiation'),
            ('Phase 2.8', 'Product Roadmap'),
            ('Phase 2.9', 'Investor FAQ'),
            ('Phase 2.10', 'Demo Script'),
        ]
        for num, title in toc_items:
            self.pdf.set_font('Helvetica', 'B', 11)
            self.pdf.set_text_color(*self.DARK_BLUE)
            self.pdf.cell(25, 7, sanitize_unicode(num))
            self.pdf.set_font('Helvetica', '', 11)
            self.pdf.set_text_color(*self.DARK_GRAY)
            self.pdf.cell(130, 7, sanitize_unicode(title))
            self.pdf.ln()
            self.pdf.set_draw_color(200, 200, 200)
            self.pdf.line(10, self.pdf.get_y(), 200, self.pdf.get_y())

    def _add_section_title(self, title, level=1):
        title = sanitize_unicode(title)
        self.check_page_space(20)
        if level == 1:
            self.pdf.set_font('Helvetica', 'B', 20)
            self.pdf.set_text_color(*self.DARK_BLUE)
            self.pdf.ln(5)
            self.pdf.multi_cell(0, 12, title)
            self.pdf.set_draw_color(*self.DARK_BLUE)
            self.pdf.set_line_width(0.6)
            self.pdf.line(10, self.pdf.get_y() + 2, 200, self.pdf.get_y() + 2)
            self.pdf.ln(6)
        elif level == 2:
            self.pdf.set_font('Helvetica', 'B', 14)
            self.pdf.set_text_color(*self.DARK_BLUE)
            self.check_page_space(15)
            self.pdf.ln(3)
            self.pdf.multi_cell(0, 9, title)
            self.pdf.ln(2)
        elif level == 3:
            self.pdf.set_font('Helvetica', 'B', 11)
            self.pdf.set_text_color(*self.DARK_BLUE)
            self.check_page_space(10)
            self.pdf.multi_cell(0, 7, title)
            self.pdf.ln(1)

    def _add_body_text(self, text):
        text = sanitize_unicode(text)
        self.check_page_space(10)
        self.pdf.set_font('Helvetica', '', 10)
        self.pdf.set_text_color(*self.DARK_GRAY)
        self.pdf.multi_cell(0, 5, text)
        self.pdf.ln(2)

    def _add_bold_text(self, text):
        text = sanitize_unicode(text)
        self.check_page_space(8)
        self.pdf.set_font('Helvetica', 'B', 10)
        self.pdf.set_text_color(*self.DARK_BLUE)
        self.pdf.multi_cell(0, 6, text)
        self.pdf.ln(2)

    def _add_bullet_point(self, text):
        text = sanitize_unicode(text)
        self.check_page_space(8)
        self.pdf.set_font('Helvetica', '', 10)
        self.pdf.set_text_color(*self.DARK_GRAY)
        self.pdf.cell(8, 5, '-')
        self.pdf.multi_cell(0, 5, text)
        self.pdf.ln(1)

    def _add_code_block(self, lines):
        self.check_page_space(15)
        self.pdf.set_fill_color(*self.LIGHT_GRAY_BG)
        self.pdf.set_draw_color(200, 200, 200)
        self.pdf.set_font('Courier', '', 8)
        self.pdf.set_text_color(*self.DARK_GRAY)

        start_y = self.pdf.get_y()
        max_width = 185
        line_height = 4.5

        total_height = len(lines) * line_height + 8
        if self.pdf.get_y() + total_height > self.MAX_Y:
            self.pdf.add_page()
            start_y = self.pdf.get_y()

        self.pdf.rect(10, start_y, max_width, total_height, style='DF')
        self.pdf.set_y(start_y + 4)

        for line in lines:
            self.pdf.set_x(14)
            truncated = line[:120] if len(line) > 120 else line
            self.pdf.cell(max_width - 8, line_height, sanitize_unicode(truncated), new_x='LMARGIN', new_y='NEXT')

        self.pdf.ln(4)

    def _add_table(self, headers, rows):
        if not headers:
            return

        self.check_page_space(20)

        num_cols = len(headers)
        available_width = 190
        col_widths = [available_width / num_cols] * num_cols

        self.pdf.set_font('Helvetica', 'B', 8)
        max_header_len = max(len(h) for h in headers) if headers else 10
        for i, h in enumerate(headers):
            if len(h) > max_header_len * 0.8:
                col_widths[i] *= 1.3

        total = sum(col_widths)
        col_widths = [w * available_width / total for w in col_widths]

        self.pdf.set_fill_color(*self.TABLE_HEADER_BG)
        self.pdf.set_text_color(*self.WHITE)
        self.pdf.set_font('Helvetica', 'B', 8)
        self.pdf.set_draw_color(180, 180, 180)

        header_height = 7
        for i, h in enumerate(headers):
            self.pdf.cell(col_widths[i], header_height, sanitize_unicode(h), border=1, fill=True, align='C')
        self.pdf.ln(header_height)

        self.pdf.set_font('Helvetica', '', 8)
        self.pdf.set_text_color(*self.DARK_GRAY)

        row_height = 6
        for row_idx, row in enumerate(rows):
            if self.pdf.get_y() + row_height > self.MAX_Y:
                self.pdf.add_page()
                self.pdf.set_fill_color(*self.TABLE_HEADER_BG)
                self.pdf.set_text_color(*self.WHITE)
                self.pdf.set_font('Helvetica', 'B', 8)
                for i, h in enumerate(headers):
                    self.pdf.cell(col_widths[i], header_height, sanitize_unicode(h), border=1, fill=True, align='C')
                self.pdf.ln(header_height)
                self.pdf.set_font('Helvetica', '', 8)
                self.pdf.set_text_color(*self.DARK_GRAY)

            if row_idx % 2 == 0:
                self.pdf.set_fill_color(*self.TABLE_ALT_ROW)
            else:
                self.pdf.set_fill_color(*self.WHITE)

            for i in range(num_cols):
                cell_text = row[i] if i < len(row) else ''
                cell_text = sanitize_unicode(cell_text)
                if len(cell_text) > 50:
                    cell_text = cell_text[:47] + '...'
                self.pdf.cell(col_widths[i], row_height, cell_text, border=1, fill=True)
            self.pdf.ln(row_height)

        self.pdf.ln(3)

    def _add_horizontal_rule(self):
        self.pdf.ln(3)
        self.pdf.set_draw_color(180, 180, 180)
        self.pdf.set_line_width(0.3)
        self.pdf.line(10, self.pdf.get_y(), 200, self.pdf.get_y())
        self.pdf.ln(5)

    def _parse_markdown_table(self, lines):
        headers = []
        rows = []
        for line in lines:
            line = line.strip()
            if not line.startswith('|'):
                continue
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if all(re.match(r'^[-:]+$', c) for c in cells if c):
                continue
            if not headers:
                headers = cells
            else:
                rows.append(cells)
        return headers, rows

    def _is_code_fence(self, line):
        stripped = line.strip()
        return stripped.startswith('```')

    def convert_content(self, content):
        lines = content.split('\n')
        i = 0
        in_code_block = False
        code_lines = []
        table_buffer = []

        while i < len(lines):
            line = lines[i]
            stripped = line.strip()

            if self._is_code_fence(stripped):
                if in_code_block:
                    self._add_code_block(code_lines)
                    code_lines = []
                    in_code_block = False
                else:
                    self._flush_table_buffer(table_buffer)
                    table_buffer = []
                    in_code_block = True
                i += 1
                continue

            if in_code_block:
                code_lines.append(line)
                i += 1
                continue

            if stripped.startswith('|'):
                table_buffer.append(stripped)
                i += 1
                continue
            else:
                self._flush_table_buffer(table_buffer)
                table_buffer = []

            if stripped.startswith('---'):
                self._add_horizontal_rule()
                i += 1
                continue

            if stripped.startswith('# ') and not stripped.startswith('## '):
                title = stripped[2:].strip()
                self._add_section_title(title, level=1)
                i += 1
                continue

            if stripped.startswith('## '):
                title = stripped[3:].strip()
                self._add_section_title(title, level=2)
                i += 1
                continue

            if stripped.startswith('### '):
                title = stripped[4:].strip()
                self._add_section_title(title, level=3)
                i += 1
                continue

            if stripped.startswith('> '):
                self.check_page_space(10)
                self.pdf.set_font('Helvetica', 'I', 10)
                self.pdf.set_text_color(80, 80, 80)
                self.pdf.set_fill_color(245, 245, 250)
                quote_text = stripped[2:].strip()
                quote_text = sanitize_unicode(quote_text)
                self.pdf.rect(10, self.pdf.get_y(), 190, 8, style='F')
                self.pdf.set_x(14)
                self.pdf.multi_cell(180, 5, quote_text)
                self.pdf.ln(3)
                i += 1
                continue

            if re.match(r'^[-*]\s+', stripped):
                text = re.sub(r'^[-*]\s+', '', stripped)
                self._add_bullet_point(text)
                i += 1
                continue

            if re.match(r'^\d+\.\s+', stripped):
                text = re.sub(r'^\d+\.\s+', '', stripped)
                self._add_bullet_point(text)
                i += 1
                continue

            if stripped == '':
                self.pdf.ln(2)
                i += 1
                continue

            if stripped.startswith('**') and stripped.endswith('**') and len(stripped) < 100:
                self._add_bold_text(stripped.strip('*'))
                i += 1
                continue

            self._add_body_text(stripped)
            i += 1

        self._flush_table_buffer(table_buffer)
        if in_code_block and code_lines:
            self._add_code_block(code_lines)

    def _flush_table_buffer(self, buffer):
        if buffer:
            headers, rows = self._parse_markdown_table(buffer)
            if headers:
                self._add_table(headers, rows)
            buffer.clear()


def get_file_order():
    return [
        'Phase 1 \u2013 Azure Founders Hub Pack.md',
        'Phase 1.1 Product Overview.md',
        'Phase 1.2 Technical Architecture.md',
        'Phase 1.3 \u2013 Platform Core Definition.md',
        'Phase 1.4 Azure Cloud Architecture.md',
        'Phase 1.5 Azure Reference Architecture Diagram.md',
        'Phase 1.6 Azure Founders Hub Technical Narrative.md',
        'Phase 2.1 Executive Pitch Narrative.md',
        'Phase 2.2 Investor Pitch Deck.md',
        'Phase 2.3 Market Analysis TAM_SAM_SOM and Competitor Landscape.md',
        'Phase 2.4 Business Model and Pricing Strategy.md',
        'Phase 2.5 Go-to-Market Strategy and Financial Projections.md',
        'Phase 2.6 Financial Model and Funding Strategy.md',
        'Phase 2.7 Competitive Differentiation.md',
        'Phase 2.8 Product Roadmap.md',
        'Phase 2.9 Investor FAQ.md',
        'Phase 2.10 Demo Script.md',
    ]


def main():
    source_dir = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready'
    output_dir = os.path.join(source_dir, 'output', 'v1-technical')
    output_path = os.path.join(output_dir, 'FS_Migration_Validation_Engine_Founders_Hub_Master.pdf')

    os.makedirs(output_dir, exist_ok=True)

    pdf = FoundersHubPDF()
    converter = MarkdownToPDFConverter(pdf)

    print("Generating PDF document...")
    print(f"Source directory: {source_dir}")
    print(f"Output path: {output_path}")
    print()

    # Cover page
    print("  Creating cover page...")
    converter.render_cover_page()

    # Table of contents
    print("  Creating table of contents...")
    converter.render_toc()

    # Process each markdown file
    files = get_file_order()
    for idx, filename in enumerate(files):
        filepath = os.path.join(source_dir, filename)
        if not os.path.exists(filepath):
            print(f"  WARNING: File not found: {filename}")
            continue

        print(f"  Processing [{idx+1}/{len(files)}]: {filename}")
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Add page break for each phase document
        pdf.add_page()

        # Render the content
        converter.convert_content(content)

    # Save the PDF
    pdf.output(output_path)
    print()
    print(f"PDF generated successfully!")
    print(f"Output path: {output_path}")
    print(f"Total pages: {pdf.page_no()}")


if __name__ == '__main__':
    main()
