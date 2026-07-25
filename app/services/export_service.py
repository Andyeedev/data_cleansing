import csv
import io
from app.db.connection import get_db_connection


class ExportService:

    def __init__(self):
        self.db = get_db_connection()

    def export_csv(self, batch_id: str):
        query = """
            SELECT
                ce.rule_id,
                ce.entity_name,
                ce.execution_status,
                ce.delta_value,
                ce.execution_time_seconds,
                ce.severity_level,
                ce.control_id
            FROM engine.migration_control_execution ce
            WHERE ce.batch_id = %s
            ORDER BY ce.control_id, ce.rule_id
        """
        rows = self.db.execute(query, (batch_id,))

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            'Rule ID', 'Entity Name', 'Status', 'Delta Value',
            'Execution Time (s)', 'Severity Level', 'Control ID'
        ])

        for row in rows:
            writer.writerow([
                row[0], row[1], row[2], row[3], row[4], row[5], row[6]
            ])

        return output.getvalue()

    def export_pdf(self, batch_id: str):
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import inch

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        c.setFont("Helvetica-Bold", 16)
        c.drawString(1 * inch, height - 1 * inch, f"Execution Report - Batch {batch_id}")

        c.setFont("Helvetica", 12)
        y_position = height - 1.5 * inch

        summary_query = """
            SELECT
                batch_status,
                total_controls,
                completed_controls,
                failed_controls
            FROM engine.migration_batch_registry
            WHERE batch_id = %s
        """
        summary = self.db.execute(summary_query, (batch_id,))
        if summary:
            row = summary[0]
            c.drawString(1 * inch, y_position, f"Status: {row[0]}")
            y_position -= 0.3 * inch
            c.drawString(1 * inch, y_position, f"Total Controls: {row[1]}")
            y_position -= 0.3 * inch
            c.drawString(1 * inch, y_position, f"Completed: {row[2]}")
            y_position -= 0.3 * inch
            c.drawString(1 * inch, y_position, f"Failed: {row[3]}")
            y_position -= 0.5 * inch

        c.setFont("Helvetica-Bold", 14)
        c.drawString(1 * inch, y_position, "Control Execution Details")
        y_position -= 0.3 * inch

        c.setFont("Helvetica", 10)
        detail_query = """
            SELECT
                rule_id,
                entity_name,
                execution_status,
                delta_value,
                control_id
            FROM engine.migration_control_execution
            WHERE batch_id = %s
            ORDER BY control_id, rule_id
            LIMIT 50
        """
        details = self.db.execute(detail_query, (batch_id,))
        for detail in details:
            if y_position < 1 * inch:
                c.showPage()
                y_position = height - 1 * inch
                c.setFont("Helvetica", 10)
            c.drawString(1 * inch, y_position,
                        f"{detail[0]} | {detail[1]} | {detail[2]} | Delta: {detail[3]} | {detail[4]}")
            y_position -= 0.2 * inch

        c.save()
        return buffer.getvalue()
