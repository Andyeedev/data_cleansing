#!/usr/bin/env python3
"""Generate Document Analysis Report PDF for Microsoft Founders Hub application."""

from fpdf import FPDF
import os

class AnalysisReport(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)
        
    def header(self):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, 'FS Migration Validation Engine - Document Analysis Report', 0, 0, 'L')
        self.cell(0, 8, 'Microsoft Founders Hub Application', 0, 1, 'R')
        self.set_draw_color(0, 102, 178)
        self.set_line_width(0.5)
        self.line(10, 16, 200, 16)
        self.ln(10)
        
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')
        
    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(0, 51, 102)
        self.cell(0, 10, title, 0, 1, 'L')
        self.set_draw_color(0, 102, 178)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)
        
    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(0, 76, 153)
        self.cell(0, 8, title, 0, 1, 'L')
        self.ln(2)
        
    def subsection_title(self, title):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(51, 51, 51)
        self.cell(0, 7, title, 0, 1, 'L')
        self.ln(1)
        
    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(51, 51, 51)
        self.multi_cell(0, 5.5, text)
        self.ln(2)
        
    def rating_cell(self, label, rating, max_rating=5):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(51, 51, 51)
        self.cell(80, 6, label, 0, 0)
        
        # Draw rating boxes
        x = self.get_x()
        y = self.get_y()
        for i in range(max_rating):
            if i < rating:
                self.set_fill_color(0, 153, 76)  # Green
            else:
                self.set_fill_color(220, 220, 220)  # Gray
            self.rect(x + i * 8, y, 6, 5, 'F')
        
        self.set_x(x + max_rating * 8 + 5)
        if rating >= 4:
            self.set_text_color(0, 153, 76)
        elif rating >= 3:
            self.set_text_color(204, 153, 0)
        else:
            self.set_text_color(204, 0, 0)
        self.set_font('Helvetica', 'B', 9)
        self.cell(0, 6, f'{rating}/{max_rating}', 0, 1)
        self.set_text_color(51, 51, 51)
        self.ln(1)

    def table_header(self, headers, widths):
        self.set_font('Helvetica', 'B', 9)
        self.set_fill_color(0, 51, 102)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(widths[i], 7, header, 1, 0, 'C', True)
        self.ln()
        self.set_text_color(51, 51, 51)
        
    def table_row(self, data, widths, fill=False):
        self.set_font('Helvetica', '', 8)
        if fill:
            self.set_fill_color(240, 245, 250)
        for i, cell in enumerate(data):
            self.cell(widths[i], 6, str(cell), 1, 0, 'C', fill)
        self.ln()

def create_analysis_report():
    pdf = AnalysisReport()
    pdf.alias_nb_pages()
    
    # Title Page
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 15, 'Document Analysis Report', 0, 1, 'C')
    
    pdf.set_font('Helvetica', '', 14)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'FS Migration Validation Engine', 0, 1, 'C')
    pdf.cell(0, 10, 'Microsoft Founders Hub Application Pack', 0, 1, 'C')
    
    pdf.ln(10)
    pdf.set_draw_color(0, 102, 178)
    pdf.set_line_width(1)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 8, 'Version: 2.0', 0, 1, 'C')
    pdf.cell(0, 8, 'Date: June 2026', 0, 1, 'C')
    pdf.cell(0, 8, 'Status: Fitness-for-Purpose Review', 0, 1, 'C')
    
    pdf.ln(20)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.multi_cell(0, 6, 'This report evaluates the fitness-for-purpose of all documentation prepared for the Microsoft Founders Hub application. Each document is assessed for content quality, audience alignment, and presentation readiness.', 0, 'C')
    
    # Table of Contents
    pdf.add_page()
    pdf.chapter_title('Table of Contents')
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    
    toc_items = [
        ('1. Executive Summary', 3),
        ('2. Assessment Methodology', 3),
        ('3. Document-by-Document Analysis', 4),
        ('   3.1 Phase 1 Overview', 4),
        ('   3.2 Phase 1.1 - Product Overview', 4),
        ('   3.3 Phase 1.2 - Technical Architecture', 5),
        ('   3.4 Phase 1.3 - Platform Core Definition', 5),
        ('   3.5 Phase 1.4 - Azure Cloud Architecture', 6),
        ('   3.6 Phase 1.5 - Azure Reference Architecture Diagram', 6),
        ('   3.7 Phase 1.6 - Technical Narrative', 7),
        ('   3.8 Phase 2.1 - Executive Pitch Narrative', 7),
        ('   3.9 Phase 2.2 - Investor Pitch Deck', 8),
        ('   3.10 Phase 2.3 - Market Analysis', 8),
        ('   3.11 Phase 2.4 - Business Model & Pricing', 9),
        ('   3.12 Phase 2.5 - Go-to-Market Strategy', 9),
        ('   3.13 Phase 2.6 - Financial Model & Funding', 10),
        ('   3.14 Phase 2.7 - Competitive Differentiation', 10),
        ('   3.15 Phase 2.8 - Product Roadmap', 11),
        ('   3.16 Phase 2.9 - Investor FAQ', 11),
        ('   3.17 Phase 2.10 - Demo Script', 12),
        ('4. Overall Assessment Summary', 12),
        ('5. Key Recommendations', 13),
        ('6. Fitness-for-Purpose Matrix', 14),
    ]
    
    for item, page in toc_items:
        pdf.cell(150, 7, item, 0, 0)
        pdf.cell(0, 7, str(page), 0, 1, 'R')
    
    # Executive Summary
    pdf.add_page()
    pdf.chapter_title('1. Executive Summary')
    
    pdf.body_text('This report provides a comprehensive fitness-for-purpose analysis of the documentation pack prepared for the Microsoft for Startups Founders Hub application. The pack consists of 17 documents across two phases: Phase 1 (Technical Foundation, 7 documents) and Phase 2 (Commercial & Investor Readiness, 10 documents).')
    
    pdf.body_text('The documentation has been authored primarily from an engineering perspective, which presents both strengths and challenges for the target audience. The Founders Hub reviewers are startup programme reviewers, not engineers. They evaluate business viability, market opportunity, and strategic fit with the Microsoft ecosystem.')
    
    pdf.section_title('Key Findings')
    pdf.body_text('1. STRENGTH: Comprehensive technical foundation - The Phase 1 documents demonstrate a well-architected, Azure-native platform with clear alignment to Microsoft\'s Well-Architected Framework. This provides strong evidence of technical credibility.')
    
    pdf.body_text('2. STRENGTH: Strong commercial documents - Phase 2 documents (2.1-2.9) provide solid business model, pricing, financial projections, and competitive positioning that directly address Founders Hub reviewer questions.')
    
    pdf.body_text('3. CHALLENGE: Technical depth may overwhelm non-technical reviewers - Phase 1.2-1.5 contain implementation-level detail (code references, SQL templates, file paths) that is unnecessary for startup reviewers and may distract from the business narrative.')
    
    pdf.body_text('4. CHALLENGE: Missing traction evidence - The documents describe the product vision well but lack concrete traction metrics (pilot results, customer testimonials, pipeline evidence) that reviewers seek.')
    
    pdf.body_text('5. OPPORTUNITY: Two-version approach recommended - Creating both a technical version (for due diligence) and a business-focused version (for initial review) would optimise for both audiences.')
    
    # Assessment Methodology
    pdf.chapter_title('2. Assessment Methodology')
    pdf.body_text('Each document is assessed against the following criteria:')
    
    pdf.body_text('AUDIENCE ALIGNMENT: Does the content address what Founders Hub reviewers care about? (Who buys this? Why now? How big is the opportunity? Why are you different? Why Azure?)')
    
    pdf.body_text('CONTENT QUALITY: Is the information accurate, complete, and well-structured? Are claims supported with evidence or reasonable projections?')
    
    pdf.body_text('PRESENTATION READINESS: Is the document professional enough for a formal application? Does it follow consistent formatting and branding?')
    
    pdf.body_text('GAP ANALYSIS: What information is missing that would strengthen the application?')
    
    # Document-by-Document Analysis
    pdf.add_page()
    pdf.chapter_title('3. Document-by-Document Analysis')
    
    # Phase 1 Overview
    pdf.section_title('3.1 Phase 1 Overview (Pack Master)')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('This overview document serves as a strong table of contents and executive summary. It effectively positions the platform and provides a clear document inventory. The "Five Platform Pillars" framing is compelling.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Clear product positioning statement\n- Evidence portfolio demonstrates working code\n- Program alignment section shows versatility\n- Key differentiators table is effective')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Some technical references may confuse non-technical reviewers\n- Could benefit from a "Why This Matters" section at the top\n- Missing: Team backgrounds and traction metrics')
    
    # Phase 1.1
    pdf.section_title('3.2 Phase 1.1 - Product Overview')
    pdf.rating_cell('Fitness for Purpose', 5)
    pdf.body_text('Excellent document. Despite being authored by an engineer, it translates technical capabilities into business benefits effectively. The "Business Benefits" section with measurable impacts (70-80% reduction, 100% coverage) directly addresses reviewer questions about value proposition.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Problem/solution framing is clear\n- Platform capabilities explained in accessible language\n- Measurable business benefits table\n- Current development status shows progress\n- Why Azure section aligns with Microsoft\'s interests')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Minor: Could add customer validation evidence\n- Minor: Product Vision section could reference specific Microsoft technologies more')
    
    # Phase 1.2
    pdf.section_title('3.3 Phase 1.2 - Technical Architecture')
    pdf.rating_cell('Fitness for Purpose', 3)
    pdf.body_text('Technically excellent but too detailed for startup reviewers. The document contains implementation-level specifics (file paths, SQL templates, Python imports) that belong in engineering documentation, not a Founders Hub application. However, it serves as strong evidence of technical depth for due diligence.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Comprehensive architecture overview\n- Clear component decomposition\n- Security architecture section is relevant\n- Technology stack summary is useful')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- File path references (app/main.py, sql/controls/) should be removed for business audience\n- Code snippets may overwhelm non-technical reviewers\n- Consider creating a summary version for business audience\n- SQL template references are too implementation-specific')
    
    # Phase 1.3
    pdf.section_title('3.4 Phase 1.3 - Platform Core Definition')
    pdf.rating_cell('Fitness for Purpose', 2)
    pdf.body_text('The most technically dense document in the pack. While architecturally sound, it contains implementation details (Python class definitions, YAML configuration snippets, file paths) that are inappropriate for startup reviewers. The DAG diagrams and orchestration patterns are interesting but unnecessary for business evaluation.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Clear explanation of why Platform Core exists\n- Benefits section (technical, operational, business) is well-structured\n- Azure alignment table is relevant')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Python class code snippets should be removed entirely\n- YAML configuration examples are too implementation-specific\n- DAG diagrams may confuse non-technical audience\n- Consider condensing to 1-page summary for business version')
    
    # Phase 1.4
    pdf.section_title('3.5 Phase 1.4 - Azure Cloud Architecture')
    pdf.rating_cell('Fitness for Purpose', 3)
    pdf.body_text('Strong Azure alignment documentation. The Well-Architected Framework mapping is exactly what Microsoft wants to see. However, the networking architecture, deployment environments, and cost model sections contain too much implementation detail for startup reviewers.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Azure service mapping is comprehensive\n- Well-Architected Framework alignment is strong\n- Cost model projection is useful\n- Future Azure services section shows roadmap')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Networking architecture diagrams may overwhelm\n- Deployment environment tables are too detailed\n- Infrastructure as Code references are implementation-specific\n- Cost model should be simplified for business version')
    
    # Phase 1.5
    pdf.section_title('3.6 Phase 1.5 - Azure Reference Architecture Diagram')
    pdf.rating_cell('Fitness for Purpose', 2)
    pdf.body_text('This is purely a technical reference document. The ASCII architecture diagrams and deployment model tables are valuable for engineering review but not for startup programme evaluators. Should be included only in the technical version.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Comprehensive visual architecture\n- Security boundaries are clearly defined\n- Scalability model is well-documented')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Entirely too technical for business audience\n- ASCII diagrams may not render well in PDF\n- Should be excluded from business version\n- Consider replacing with simplified architecture diagram')
    
    # Phase 1.6
    pdf.section_title('3.7 Phase 1.6 - Technical Narrative')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('This document bridges technical and business narratives effectively. It explains the platform in accessible language while maintaining technical credibility. The "Value to Microsoft" section directly addresses Founders Hub reviewer interests.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Clear problem/solution framing\n- Why Azure section is strong\n- Value to Microsoft section is compelling\n- Platform architecture simplified for business audience\n- Current implementation status shows progress')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Minor: Could add specific customer pain points\n- Minor: Competitive advantages section is brief\n- Could reference specific Azure consumption projections')
    
    # Phase 2 Documents
    pdf.add_page()
    pdf.chapter_title('3. Document-by-Document Analysis (Phase 2)')
    
    # Phase 2.1
    pdf.section_title('3.8 Phase 2.1 - Executive Pitch Narrative')
    pdf.rating_cell('Fitness for Purpose', 5)
    pdf.body_text('Excellent. This is the strongest document for Founders Hub purposes. It directly addresses all five reviewer questions (Who buys? Why now? How big? Why different? Why Azure?) with clear, compelling answers. The business model section with pricing tiers is concrete and credible.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Compelling vision and problem statement\n- "Why Now?" section with market trends\n- Clear competitive advantage framing\n- Concrete pricing and revenue model\n- Investment opportunity section is well-articulated\n- Closing statement is strong')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Minor: Could add specific customer names or pipeline\n- Minor: Could reference specific Azure credits usage plan')
    
    # Phase 2.2
    pdf.section_title('3.9 Phase 2.2 - Investor Pitch Deck')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Well-structured 14-slide pitch deck outline. The narrative flow is logical and covers all essential topics. The slide content is appropriately concise for a pitch format.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Logical slide progression\n- Clear problem/solution framing\n- Market opportunity well-positioned\n- Why Microsoft section is strong\n- Use of funds is specific')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Slide content is text-heavy for a pitch deck\n- Could benefit from more visual descriptions\n- Missing: Team slide\n- Missing: Traction/milestones slide')
    
    # Phase 2.3
    pdf.section_title('3.10 Phase 2.3 - Market Analysis (TAM/SAM/SOM)')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Solid market analysis with appropriate TAM/SAM/SOM framing. The competitive landscape is well-categorised. However, market size estimates should be sourced to analyst data for credibility.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- TAM/SAM/SOM structure is correct\n- Market drivers are well-identified\n- Competitive landscape is comprehensive\n- Market entry strategy is phased appropriately')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- TAM estimate ($8-12B) needs analyst source citation\n- SOM estimate could be more conservative\n- Could add specific UK bank migration programme examples\n- Missing: Customer validation evidence')
    
    # Phase 2.4
    pdf.section_title('3.11 Phase 2.4 - Business Model & Pricing')
    pdf.rating_cell('Fitness for Purpose', 5)
    pdf.body_text('Excellent. The pricing model is well-researched and appropriate for UK enterprise SaaS. The unit economics (LTV:CAC ratios) are strong. Azure infrastructure cost model demonstrates understanding of platform economics.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Tiered pricing is clear and justified\n- Value-based pricing rationale is compelling\n- Unit economics are healthy (6:1 to 16:1 LTV:CAC)\n- Azure cost model shows financial discipline\n- UK market context is relevant')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Minor: Could add pricing benchmarks from competitors\n- Minor: Could reference specific customer willingness-to-pay data')
    
    # Phase 2.5
    pdf.section_title('3.12 Phase 2.5 - Go-to-Market Strategy')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Well-structured GTM strategy with phased approach. The channel strategy is realistic and the customer acquisition plan is specific. Financial projections are ambitious but defensible.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Target customer segments are well-defined\n- Channel strategy is phased appropriately\n- Sales cycle estimates are realistic\n- Financial projections are specific')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Year 1 revenue (£550k) may be aggressive for pre-revenue startup\n- Could add more specific customer acquisition tactics\n- Missing: Partnership development timeline')
    
    # Phase 2.6
    pdf.section_title('3.13 Phase 2.6 - Financial Model & Funding')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Comprehensive financial model with appropriate P&L structure. The sensitivity analysis is valuable and shows financial discipline. UK-specific funding options are relevant.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- 3-year P&L is well-structured\n- Revenue build-up assumptions are transparent\n- Azure cost model is detailed\n- Sensitivity analysis demonstrates risk awareness\n- UK-specific funding options are relevant')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Year 3 EBITDA margin (78%) may be overly optimistic\n- Could add cash flow projections\n- Could reference specific Innovate UK grant applications')
    
    # Phase 2.7
    pdf.section_title('3.14 Phase 2.7 - Competitive Differentiation')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Strong differentiation matrix. The competitive positioning is clear and defensible. The document effectively communicates why the platform is different from existing solutions.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Comprehensive competitive landscape\n- Clear differentiation matrix\n- Six core differentiators are well-articulated\n- Customer need comparison is effective')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Could add specific competitor pricing comparisons\n- Could reference specific customer switching cost analysis\n- Missing: Barriers to entry discussion')
    
    # Phase 2.8
    pdf.section_title('3.15 Phase 2.8 - Product Roadmap')
    pdf.rating_cell('Fitness for Purpose', 4)
    pdf.body_text('Clear, phased roadmap with realistic milestones. The technology roadmap table provides good visibility into development priorities.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Vision statement is compelling\n- Phased approach is realistic\n- Technology roadmap provides clarity\n- Milestones are specific and measurable')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Year 1 milestones show mix of complete and planned\n- Could add resource requirements per phase\n- Could reference specific Azure services per phase')
    
    # Phase 2.9
    pdf.section_title('3.16 Phase 2.9 - Investor FAQ')
    pdf.rating_cell('Fitness for Purpose', 5)
    pdf.body_text('Excellent. This document directly addresses the questions reviewers will ask. The Q&A format is accessible and the answers are concise and compelling.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Covers all key reviewer questions\n- Answers are concise and compelling\n- Risk mitigation is addressed\n- Pricing and business model clearly explained\n- Funding requirements are specific')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Minor: Could add more specific customer evidence\n- Minor: Could reference specific pilot results')
    
    # Phase 2.10
    pdf.section_title('3.17 Phase 2.10 - Demo Script')
    pdf.rating_cell('Fitness for Purpose', 3)
    pdf.body_text('Useful internal document for demo preparation but not directly relevant for Founders Hub application. Could be useful if a demo is requested during the review process.')
    
    pdf.subsection_title('What Works')
    pdf.body_text('- Demo flow is well-structured\n- Key messages are reinforced\n- Technical details are appropriately scoped')
    
    pdf.subsection_title('What Needs Attention')
    pdf.body_text('- Not directly relevant for written application\n- Could be useful as supplementary material\n- Should not be included in master document')
    
    # Overall Assessment Summary
    pdf.add_page()
    pdf.chapter_title('4. Overall Assessment Summary')
    
    pdf.body_text('The documentation pack demonstrates strong technical credibility and a clear commercial proposition. The primary challenge is optimising the content for non-technical Founders Hub reviewers while preserving the technical depth for due diligence.')
    
    pdf.section_title('Document Fitness Summary')
    
    # Table
    headers = ['Document', 'Rating', 'Audience', 'Priority']
    widths = [70, 20, 40, 40]
    pdf.table_header(headers, widths)
    
    rows = [
        ['Phase 1 Overview', '4/5', 'Both', 'High'],
        ['Phase 1.1 Product Overview', '5/5', 'Both', 'Critical'],
        ['Phase 1.2 Technical Architecture', '3/5', 'Technical', 'Medium'],
        ['Phase 1.3 Platform Core', '2/5', 'Technical', 'Low'],
        ['Phase 1.4 Azure Architecture', '3/5', 'Both', 'Medium'],
        ['Phase 1.5 Reference Architecture', '2/5', 'Technical', 'Low'],
        ['Phase 1.6 Technical Narrative', '4/5', 'Both', 'High'],
        ['Phase 2.1 Executive Pitch', '5/5', 'Business', 'Critical'],
        ['Phase 2.2 Pitch Deck', '4/5', 'Business', 'High'],
        ['Phase 2.3 Market Analysis', '4/5', 'Business', 'High'],
        ['Phase 2.4 Business Model', '5/5', 'Business', 'Critical'],
        ['Phase 2.5 Go-to-Market', '4/5', 'Business', 'High'],
        ['Phase 2.6 Financial Model', '4/5', 'Business', 'High'],
        ['Phase 2.7 Competitive', '4/5', 'Business', 'High'],
        ['Phase 2.8 Product Roadmap', '4/5', 'Both', 'High'],
        ['Phase 2.9 Investor FAQ', '5/5', 'Business', 'Critical'],
        ['Phase 2.10 Demo Script', '3/5', 'Internal', 'Low'],
    ]
    
    for i, row in enumerate(rows):
        pdf.table_row(row, widths, fill=(i % 2 == 0))
    
    # Key Recommendations
    pdf.ln(5)
    pdf.chapter_title('5. Key Recommendations')
    
    pdf.section_title('Recommendation 1: Create Two Versions')
    pdf.body_text('PRODUCE both a technical version (for due diligence) and a business-focused version (for initial review). The technical version keeps all content as-is. The business version summarizes Phase 1.2-1.5 into executive-level overviews.')
    
    pdf.section_title('Recommendation 2: Lead with Business Value')
    pdf.body_text('ENSURE the business version leads with the executive pitch (Phase 2.1) and market opportunity (Phase 2.3) rather than technical architecture. Founders Hub reviewers evaluate business viability first.')
    
    pdf.section_title('Recommendation 3: Add Traction Evidence')
    pdf.body_text('INCLUDE specific traction metrics: pilot customer results, pipeline evidence, customer testimonials, or LOIs. Even early-stage evidence significantly strengthens the application.')
    
    pdf.section_title('Recommendation 4: Simplify Azure Narrative')
    pdf.body_text('FOCUS the Azure narrative on consumption growth (how customer adoption drives Azure usage) rather than implementation details. Microsoft wants to see platform stickiness and ecosystem value.')
    
    pdf.section_title('Recommendation 5: Add Team Backgrounds')
    pdf.body_text('INCLUDE founder/team backgrounds highlighting relevant Financial Services and Azure experience. Founders Hub reviewers invest in teams, not just products.')
    
    # Fitness-for-Purpose Matrix
    pdf.add_page()
    pdf.chapter_title('6. Fitness-for-Purpose Matrix')
    
    pdf.body_text('The following matrix evaluates each document against the five core questions Founders Hub reviewers ask:')
    
    headers2 = ['Document', 'Who Buys?', 'Why Now?', 'How Big?', 'Why Different?', 'Why Azure?']
    widths2 = [40, 25, 25, 25, 30, 30]
    pdf.table_header(headers2, widths2)
    
    matrix_rows = [
        ['Phase 1 Overview', 'Yes', 'Partial', 'Partial', 'Yes', 'Yes'],
        ['Phase 1.1 Product', 'Yes', 'Yes', 'Partial', 'Yes', 'Yes'],
        ['Phase 1.2 Technical', 'No', 'No', 'No', 'Partial', 'Yes'],
        ['Phase 1.3 Platform', 'No', 'No', 'No', 'Partial', 'Yes'],
        ['Phase 1.4 Azure', 'No', 'No', 'No', 'Partial', 'Yes'],
        ['Phase 1.5 Reference', 'No', 'No', 'No', 'No', 'Yes'],
        ['Phase 1.6 Narrative', 'Yes', 'Yes', 'Partial', 'Yes', 'Yes'],
        ['Phase 2.1 Pitch', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
        ['Phase 2.2 Deck', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
        ['Phase 2.3 Market', 'Yes', 'Yes', 'Yes', 'Yes', 'Partial'],
        ['Phase 2.4 Business', 'Yes', 'Partial', 'Yes', 'Yes', 'Partial'],
        ['Phase 2.5 GTM', 'Yes', 'Partial', 'Yes', 'Partial', 'Partial'],
        ['Phase 2.6 Financial', 'Yes', 'Partial', 'Yes', 'Partial', 'Partial'],
        ['Phase 2.7 Competitive', 'Yes', 'Yes', 'Partial', 'Yes', 'Partial'],
        ['Phase 2.8 Roadmap', 'Partial', 'Yes', 'Partial', 'Yes', 'Yes'],
        ['Phase 2.9 FAQ', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    ]
    
    for i, row in enumerate(matrix_rows):
        pdf.table_row(row, widths2, fill=(i % 2 == 0))
    
    pdf.ln(5)
    pdf.body_text('SUMMARY: Phase 2 documents (2.1-2.9) generally score higher on fitness-for-purpose for Founders Hub reviewers. Phase 1 documents (1.2-1.5) are technically excellent but require summarisation for business audience. The two-version approach ensures both audiences are served effectively.')
    
    # Save
    output_path = os.path.join(os.path.dirname(__file__), 'Document_Analysis_Report.pdf')
    pdf.output(output_path)
    print(f'Analysis report saved to: {output_path}')

if __name__ == '__main__':
    create_analysis_report()
