from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

styles = getSampleStyleSheet()

def create_pdf(filename, title, sections):
    elements = []
    elements.append(Paragraph(title, styles['Title']))
    elements.append(Spacer(1,20))

    for header, text in sections:
        elements.append(Paragraph(header, styles['Heading2']))
        elements.append(Spacer(1,10))
        elements.append(Paragraph(text, styles['BodyText']))
        elements.append(Spacer(1,20))

    doc = SimpleDocTemplate(filename)
    doc.build(elements)


# RELEASE NOTES
release_notes_sections = [
("Release Version","v1.5"),
("Overview",
"This release stabilises the Financial Services Migration Validation Engine. "
"It introduces a fully dynamic rule execution framework, control orchestration layer, "
"and migration intelligence scoring."),
("Key Features",
"- Dynamic rule factory\n"
"- Execution engine orchestration\n"
"- Migration control framework\n"
"- Exception logging\n"
"- Batch intelligence scoring\n"
"- Controls C01 to C06 implemented"),
("Controls Implemented",
"C01 Row Count Validation\n"
"C02 Balance Reconciliation\n"
"C03 Referential Integrity\n"
"C04 Column Count Validation\n"
"C05 Null Value Comparison\n"
"C06 Data Type Matching")
]

create_pdf("validation_engine_v1_5_release_notes.pdf",
           "Validation Engine v1.5 Release Notes",
           release_notes_sections)


# CHANGELOG
changelog_sections = [
("v1.5 Major Changes",
"- Implemented rule factory pattern\n"
"- Implemented BaseRule registry\n"
"- Added Execution Engine\n"
"- Added Rule Executor framework"),
("Controls Added",
"- C01 RowCount\n"
"- C02 Balance Recon\n"
"- C03 Referential Integrity\n"
"- C04 Column Count\n"
"- C05 Null Check\n"
"- C06 Data Type Match"),
("Database Enhancements",
"- migration_control_execution table\n"
"- migration_control_summary table\n"
"- migration_batch_summary table\n"
"- migration_batch_intelligence table")
]

create_pdf("validation_engine_v1_5_changelog.pdf",
           "Validation Engine v1.5 Changelog",
           changelog_sections)


# SUMMARY
summary_sections = [
("System Overview",
"The Financial Services Migration Validation Engine validates large-scale data migrations "
"between banking systems."),
("Architecture",
"Core Components:\n"
"- Execution Engine\n"
"- Rule Factory\n"
"- Rule Executor\n"
"- Control Framework\n"
"- Intelligence Engine"),
("Capabilities",
"- Automated validation\n"
"- Control scoring\n"
"- Exception detection\n"
"- Migration blocking logic"),
("Next Roadmap",
"- Automatic column role tagging\n"
"- Smart rule parameter inference\n"
"- AI anomaly explanation\n"
"- Dynamic rule activation")
]

create_pdf("validation_engine_v1_5_summary.pdf",
           "Validation Engine v1.5 Implementation Summary",
           summary_sections)

print("PDF documents generated successfully.")