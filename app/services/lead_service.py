from app.db.connection import get_db_connection
import re

class LeadService:
    def create_lead(self, payload: dict):
        # Basic validation / normalization for data quality
        full_name = (payload.get("full_name") or "").strip()
        work_email = (payload.get("work_email") or "").strip().lower()
        if not full_name or not work_email:
            raise ValueError("Full name and work email are required")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", work_email):
            raise ValueError("Invalid work email")
        # Block free domains for quality
        free_domains = ["gmail.com","yahoo.com","hotmail.com","outlook.com"]
        domain = work_email.split("@")[-1]
        if domain in free_domains:
            raise ValueError("Please use a work email")
        company = (payload.get("company") or "").strip()
        org_size = payload.get("org_size")
        industry = payload.get("industry")
        role = payload.get("role")
        challenge = payload.get("challenge")
        message = (payload.get("message") or "").strip()
        source_form = payload.get("source_form") or "get_started"
        if source_form not in ("get_started","request_demo"):
            source_form = "get_started"
        utm_source = payload.get("utm_source")
        referrer = payload.get("referrer")

        db = get_db_connection()
        # work_email_hash for dedupe (crypt) — simple lower hash, not crypt for now
        work_email_hash = work_email  # could be hashed
        query = """
        INSERT INTO core.leads (full_name, work_email, work_email_hash, company, org_size, industry, role, challenge, message, source_form, utm_source, referrer)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING lead_id, created_at
        """
        row = db.execute(query, (full_name, work_email, work_email_hash, company, org_size, industry, role, challenge, message, source_form, utm_source, referrer))
        lead_id = row[0][0] if row else None
        return {"lead_id": str(lead_id), "source_form": source_form}
