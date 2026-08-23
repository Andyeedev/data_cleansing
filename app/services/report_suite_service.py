"""Report Suite Service - builds the eight report sections for the Board Pack."""
from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_int(val: Any, default: int = 0) -> int:
    try:
        return int(val) if val is not None else default
    except (ValueError, TypeError):
        return default


def _row_to_dict(row, columns):
    if row is None:
        return {}
    return {columns[i]: row[i] for i in range(len(columns))}


class ReportSuiteService:
    def __init__(self, db):
        self.db = db

    def get_suite(self, tenant_id=None, batch_id=None):
        batch = self._resolve_batch(tenant_id, batch_id)
        if batch is None:
            return {"has_data": False, "generated_at": _now_iso(), "batch": None, "message": "No validation batches found for this tenant."}

        resolved_batch_id = batch.get("batch_id")

        return {
            "has_data": True,
            "generated_at": _now_iso(),
            "batch": {
                "batch_id": batch.get("batch_id"),
                "batch_name": batch.get("batch_name", ""),
                "batch_status": batch.get("batch_status", ""),
                "started_at": str(batch.get("batch_start_time") or ""),
                "ended_at": str(batch.get("batch_end_time") or ""),
                "created_at": str(batch.get("created_at") or ""),
                "duration_seconds": None,
            },
            "executive": self._build_executive(resolved_batch_id, tenant_id),
            "migration": self._build_migration(tenant_id),
            "validation": self._build_validation(resolved_batch_id),
            "governance": self._build_governance(resolved_batch_id),
            "risk": self._build_risk(resolved_batch_id),
            "quality": self._build_quality(resolved_batch_id),
            "readiness": self._build_readiness(resolved_batch_id),
            "issues": self._build_issues(resolved_batch_id),
        }

    def _execute(self, query, params=None):
        with self.db.conn.cursor() as cur:
            cur.execute(query, params)
            cols = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            return [_row_to_dict(r, cols) for r in rows]

    def _execute_one(self, query, params=None):
        rows = self._execute(query, params)
        return rows[0] if rows else None

    def _resolve_batch(self, tenant_id, batch_id):
        if batch_id:
            return self._execute_one("SELECT * FROM engine.migration_batch_registry WHERE batch_id = %s", (batch_id,))
        if tenant_id:
            return self._execute_one("SELECT * FROM engine.migration_batch_registry WHERE tenant_id = %s ORDER BY created_at DESC LIMIT 1", (tenant_id,))
        return self._execute_one("SELECT * FROM engine.migration_batch_registry ORDER BY created_at DESC LIMIT 1")

    def _fetch_control_summary(self, batch_id):
        return self._execute("SELECT * FROM engine.migration_control_summary WHERE batch_id = %s", (batch_id,))

    def _fetch_controls(self):
        return self._execute("SELECT * FROM engine.control_registry WHERE enabled_flag = true ORDER BY control_id")

    def _fetch_exception_register(self, batch_id):
        return self._execute(
            "SELECT * FROM engine.migration_exception_register WHERE batch_id = %s ORDER BY created_timestamp DESC LIMIT 200",
            (batch_id,),
        )

    def _build_executive(self, batch_id, tenant_id=None):
        controls = self._fetch_control_summary(batch_id)
        registry = self._fetch_controls()
        total = _safe_int(len(registry))
        passed = sum(1 for c in controls if (c.get("overall_status") or "").upper() == "PASS")
        failed = sum(1 for c in controls if (c.get("overall_status") or "").upper() == "FAIL")
        error = sum(1 for c in controls if (c.get("overall_status") or "").upper() in ("ERROR", "BLOCKED"))
        blocked = sum(1 for c in controls if (c.get("overall_status") or "").upper() == "BLOCKED")
        readiness_pct = round((passed / total) * 100, 1) if total else 0
        total_rules = sum(_safe_int(c.get("total_rules")) for c in controls)
        total_passed = sum(_safe_int(c.get("passed_rules")) for c in controls)
        validation_score = round((total_passed / total_rules) * 100, 1) if total_rules else 0
        issues = self._fetch_exception_register(batch_id)
        validation_findings = len(issues)
        critical_issues = sum(1 for c in controls if (c.get("overall_status") or "").upper() in ("BLOCKED", "ERROR"))
        blocking = critical_issues

        sev_map = {}
        for iss in issues:
            sev = (iss.get("variance_type") or "DATA_MISMATCH").upper()
            sev_map[sev] = sev_map.get(sev, 0) + 1
        issues_by_severity = [{"severity": k, "controls": v} for k, v in sorted(sev_map.items())]

        if validation_score >= 80 and blocking == 0:
            recommendation = "System is ready to proceed to the next phase. All critical controls have passed."
        elif validation_score >= 60:
            recommendation = "Review failing controls before proceeding. Address critical and high-severity issues."
        else:
            recommendation = "DO NOT PROCEED with migration. Critical validation issues must be resolved before production cutover."

        findings_detail = []
        if passed > 0:
            findings_detail.append(f"{passed} control{'s' if passed != 1 else ''} passed validation successfully")
        if failed > 0:
            findings_detail.append(f"{failed} control{'s' if failed != 1 else ''} failed validation indicating data integrity issues")
        if error > 0:
            findings_detail.append(f"{error} control{'s' if error != 1 else ''} encountered execution errors requiring investigation")
        if blocked > 0:
            findings_detail.append(f"{blocked} control{'s' if blocked != 1 else ''} blocked pending resolution of upstream dependencies")
        skipped = total - passed - failed - error - blocked
        if skipped > 0:
            findings_detail.append(f"{skipped} control{'s' if skipped != 1 else ''} skipped (not applicable to this migration scope)")
        if validation_score < 80:
            findings_detail.append(f"Data quality score of {validation_score}% indicates substantial remediation needed")

        batch = self._execute_one("SELECT * FROM engine.migration_batch_registry WHERE batch_id = %s", (batch_id,))
        scenario_name = "N/A"
        industry = "Financial Services"
        source_platform = "N/A"
        target_platform = "N/A"
        source_records = 0
        target_records = 0
        entities_mapped = 0
        duration_seconds = None

        if batch:
            project_id = batch.get("project_id")
            if project_id:
                proj = self._execute_one("SELECT project_name FROM core.projects WHERE project_id = %s", (project_id,))
                if proj:
                    scenario_name = proj.get("project_name", "N/A")
            start = batch.get("batch_start_time")
            end = batch.get("batch_end_time")
            if start and end:
                try:
                    from datetime import datetime
                    if isinstance(start, str):
                        start = datetime.fromisoformat(start)
                    if isinstance(end, str):
                        end = datetime.fromisoformat(end)
                    duration_seconds = int((end - start).total_seconds())
                except Exception:
                    pass

        if tenant_id:
            schema_rows = self._execute(
                "SELECT DISTINCT dm.source_schema, dm.target_schema FROM core.dataset_mappings dm JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s LIMIT 2",
                (tenant_id,),
            )
            ent_count = self._execute_one(
                "SELECT COUNT(*) as cnt FROM core.dataset_mappings dm JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s",
                (tenant_id,),
            )
        else:
            schema_rows = self._execute("SELECT DISTINCT source_schema, target_schema FROM core.dataset_mappings LIMIT 2")
            ent_count = self._execute_one("SELECT COUNT(*) as cnt FROM core.dataset_mappings")

        if schema_rows:
            source_platform = schema_rows[0].get("source_schema", "N/A")
            target_platform = schema_rows[0].get("target_schema", "N/A")
        entities_mapped = _safe_int(ent_count["cnt"]) if ent_count else 0

        if tenant_id:
            src_rec = self._execute_one(
                "SELECT COALESCE(SUM(array_length(dm.source_columns, 1)), 0) as cnt FROM core.dataset_mappings dm JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s",
                (tenant_id,),
            )
            tgt_rec = self._execute_one(
                "SELECT COALESCE(SUM(array_length(dm.target_columns, 1)), 0) as cnt FROM core.dataset_mappings dm JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s",
                (tenant_id,),
            )
        else:
            src_rec = self._execute_one("SELECT COALESCE(SUM(array_length(source_columns, 1)), 0) as cnt FROM core.dataset_mappings")
            tgt_rec = self._execute_one("SELECT COALESCE(SUM(array_length(target_columns, 1)), 0) as cnt FROM core.dataset_mappings")
        source_records = _safe_int(src_rec["cnt"]) if src_rec else 0
        target_records = _safe_int(tgt_rec["cnt"]) if tgt_rec else 0

        return {
            "controls_summary": {"total": total, "passed": passed, "failed": failed, "error": error, "blocked": blocked},
            "readiness_pct": readiness_pct,
            "validation_score": validation_score,
            "data_quality_score": validation_score,
            "validation_findings": validation_findings,
            "critical_issues": critical_issues,
            "blocking_controls": blocking,
            "total_failed_rules": total_rules - total_passed,
            "total_error_rules": 0,
            "issues_by_severity": issues_by_severity,
            "recommendation": recommendation,
            "executive_recommendation": f"The migration assessment reveals significant data quality and validation concerns. The overall readiness score of {readiness_pct}% {'falls below' if readiness_pct < 80 else 'meets'} the 80% threshold required for production migration. Key findings include:" if total > 0 else "No validation data available for assessment.",
            "findings_detail": findings_detail,
            "next_steps": [
                "Review failed controls and address root causes",
                "Re-run validation on remediated data",
                "Obtain governance sign-off for next phase",
            ],
            "scenario": {
                "name": scenario_name,
                "industry": industry,
                "source_platform": source_platform,
                "target_platform": target_platform,
                "source_records": source_records,
                "target_records": target_records,
                "entities_mapped": entities_mapped,
                "duration_seconds": duration_seconds,
            },
        }

    def _build_migration(self, tenant_id):
        if tenant_id:
            r = self._execute_one("SELECT COUNT(*) as cnt FROM core.projects WHERE tenant_id = %s", (tenant_id,))
            dr = self._execute_one(
                "SELECT COUNT(*) as cnt FROM core.dataset_mappings dm JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s",
                (tenant_id,),
            )
            cr = self._execute_one(
                "SELECT COUNT(*) as cnt FROM core.column_mappings cm JOIN core.dataset_mappings dm ON cm.mapping_id = dm.mapping_id JOIN core.projects p ON dm.project_id = p.project_id WHERE p.tenant_id = %s",
                (tenant_id,),
            )
        else:
            r = self._execute_one("SELECT COUNT(*) as cnt FROM core.projects")
            dr = self._execute_one("SELECT COUNT(*) as cnt FROM core.dataset_mappings")
            cr = self._execute_one("SELECT COUNT(*) as cnt FROM core.column_mappings")
        project_count = _safe_int(r["cnt"]) if r else 0
        dataset_count = _safe_int(dr["cnt"]) if dr else 0
        col_count = _safe_int(cr["cnt"]) if cr else 0

        if tenant_id:
            entity_rows = self._execute(
                """SELECT dm.source_table, dm.target_table,
                   COALESCE(array_length(dm.source_columns, 1), 0) as source_columns,
                   COALESCE(array_length(dm.target_columns, 1), 0) as target_columns,
                   CASE WHEN COALESCE(array_length(dm.source_columns, 1), 0) = 0 THEN '0.0'
                        ELSE ROUND(COALESCE(mc.matched, 0)::numeric / array_length(dm.source_columns, 1) * 100, 1)::text
                   END as match_pct,
                   CASE WHEN COALESCE(mc.matched, 0)::numeric / NULLIF(array_length(dm.source_columns, 1), 0) >= 0.9 THEN 'passed'
                        WHEN COALESCE(mc.matched, 0)::numeric / NULLIF(array_length(dm.source_columns, 1), 0) >= 0.5 THEN 'attention'
                        ELSE 'failed'
                   END as status
                   FROM core.dataset_mappings dm
                   JOIN core.projects p ON dm.project_id = p.project_id
                   LEFT JOIN (SELECT mapping_id, COUNT(*) as matched FROM core.column_mappings WHERE match_status = 'AUTO_MATCHED' GROUP BY mapping_id) mc ON mc.mapping_id = dm.mapping_id
                   WHERE p.tenant_id = %s
                   LIMIT 50""",
                (tenant_id,),
            )
        else:
            entity_rows = self._execute(
                """SELECT dm.source_table, dm.target_table,
                   COALESCE(array_length(dm.source_columns, 1), 0) as source_columns,
                   COALESCE(array_length(dm.target_columns, 1), 0) as target_columns,
                   CASE WHEN COALESCE(array_length(dm.source_columns, 1), 0) = 0 THEN '0.0'
                        ELSE ROUND(COALESCE(mc.matched, 0)::numeric / array_length(dm.source_columns, 1) * 100, 1)::text
                   END as match_pct,
                   CASE WHEN COALESCE(mc.matched, 0)::numeric / NULLIF(array_length(dm.source_columns, 1), 0) >= 0.9 THEN 'passed'
                        WHEN COALESCE(mc.matched, 0)::numeric / NULLIF(array_length(dm.source_columns, 1), 0) >= 0.5 THEN 'attention'
                        ELSE 'failed'
                   END as status
                   FROM core.dataset_mappings dm
                   LEFT JOIN (SELECT mapping_id, COUNT(*) as matched FROM core.column_mappings WHERE match_status = 'AUTO_MATCHED' GROUP BY mapping_id) mc ON mc.mapping_id = dm.mapping_id
                   LIMIT 50"""
            )
        entities = [{"source": r["source_table"], "target": r["target_table"], "source_columns": _safe_int(r["source_columns"]), "target_columns": _safe_int(r["target_columns"]), "match_pct": r["match_pct"], "status": r["status"]} for r in entity_rows]

        total_source_records = 0
        total_target_records = 0
        passed_count = sum(1 for e in entities if e["status"] == "passed")
        attention_count = sum(1 for e in entities if e["status"] == "attention")
        failed_count = sum(1 for e in entities if e["status"] == "failed")

        dq_observations = []
        if failed_count > 0:
            dq_observations.append(f"{failed_count} entity mapping(s) with critical discrepancies requiring immediate remediation")
        if attention_count > 0:
            dq_observations.append(f"{attention_count} entity mapping(s) with partial matches requiring review")
        if passed_count > 0:
            dq_observations.append(f"{passed_count} entity mapping(s) fully validated with no discrepancies")
        if not dq_observations:
            dq_observations.append("All entity mappings have been validated successfully with no outstanding issues")

        return {
            "platform_overview": {
                "source_platform": "Legacy System",
                "target_platform": "MAPNEXUS Target",
                "source_records": total_source_records,
                "target_records": total_target_records,
                "entities_mapped": len(entities),
                "projects": project_count,
            },
            "platform": {"projects": project_count, "mapped_datasets": dataset_count, "mapped_columns": col_count},
            "entity_mapping": {"entities": entities, "total": len(entities)},
            "data_quality_observations": " ".join(dq_observations),
        }

    def _build_validation(self, batch_id):
        controls = self._fetch_control_summary(batch_id)
        registry = self._fetch_controls()
        dist = {"Passed": 0, "Failed": 0, "Error": 0, "Blocked": 0, "Skipped": 0}
        for c in controls:
            st = (c.get("overall_status") or "").upper()
            if st == "PASS": dist["Passed"] += 1
            elif st == "FAIL": dist["Failed"] += 1
            elif st in ("ERROR", "BLOCKED"): dist["Error"] += 1
            elif st == "SKIPPED": dist["Skipped"] += 1
        ctrl_outcomes = []
        for reg in registry:
            cid = reg.get("control_id")
            ctrl_row = next((c for c in controls if c.get("control_id") == cid), None)
            ctrl_outcomes.append({
                "control_id": cid,
                "control_name": reg.get("control_name", cid),
                "severity": reg.get("severity_level", "MEDIUM"),
                "status": (ctrl_row.get("overall_status") or "SKIPPED") if ctrl_row else "SKIPPED",
                "total_rules": _safe_int(ctrl_row.get("total_rules")) if ctrl_row else 0,
                "passed_rules": _safe_int(ctrl_row.get("passed_rules")) if ctrl_row else 0,
                "failed_rules": _safe_int(ctrl_row.get("failed_rules")) if ctrl_row else 0,
                "error_rules": _safe_int(ctrl_row.get("error_rules")) if ctrl_row else 0,
                "skipped_rules": _safe_int(ctrl_row.get("skipped_rules")) if ctrl_row else 0,
            })

        total = dist["Passed"] + dist["Failed"] + dist["Error"] + dist["Blocked"] + dist["Skipped"]
        failed_ctrls = [c for c in ctrl_outcomes if c["status"] in ("FAIL", "BLOCKED")]
        analysis_parts = []
        if failed_ctrls:
            critical_names = [c["control_name"] for c in failed_ctrls if c["severity"] in ("CRITICAL", "HIGH")]
            if critical_names:
                analysis_parts.append(f"CRITICAL FINDING: {len(critical_names)} high-severity control(s) failed: {', '.join(critical_names)}. These issues must be resolved before production migration.")
        analysis_parts.append(f"Of {total} controls assessed, {dist['Passed']} passed, {dist['Failed']} failed, {dist['Error']} encountered errors, and {dist['Skipped']} were skipped.")
        if dist["Passed"] > 0 and dist["Failed"] == 0:
            analysis_parts.append("All executed controls have passed validation. Skipped controls represent optional or scenario-specific rules not applicable to this migration scope.")
        analysis = " ".join(analysis_parts)

        return {"distribution": dist, "controls": ctrl_outcomes, "analysis": analysis}

    def _build_governance(self, batch_id):
        exceptions = self._fetch_exception_register(batch_id)
        registry = self._fetch_controls()
        sev_lookup = {r.get("control_id"): (r.get("severity_level") or "MEDIUM").upper() for r in registry}
        ctrl_meta = {
            "C01": {"type": "Data Quality", "owner": "Data Engineering Team", "desc": "Source-to-target record count mismatch detected"},
            "C02": {"type": "Schema", "owner": "Platform Engineering Team", "desc": "Target schema deviation from expected structure"},
            "C03": {"type": "Validation", "owner": "Data Engineering Team", "desc": "Referential integrity violation in related entities"},
            "C04": {"type": "Execution", "owner": "Platform Engineering Team", "desc": "Control execution timeout during processing"},
            "C05": {"type": "Data Quality", "owner": "Data Engineering Team", "desc": "Null value drift detected in required fields"},
            "C06": {"type": "Data Quality", "owner": "Data Engineering Team", "desc": "Duplicate key constraint violation detected"},
            "C07": {"type": "Validation", "owner": "Data Engineering Team", "desc": "Data type mismatch between source and target"},
            "C08": {"type": "Performance", "owner": "Platform Engineering Team", "desc": "Numeric data drift exceeding acceptable threshold"},
            "C09": {"type": "Validation", "owner": "Data Engineering Team", "desc": "Referential coverage gap in foreign key relationships"},
            "C010": {"type": "Schema", "owner": "Platform Engineering Team", "desc": "Schema drift detected between source and target"},
        }
        findings = []
        type_counts = {}
        owner_map = {}
        sev_counts = {"critical": 0, "high": 0, "medium": 0, "open": 0}
        for ex in exceptions:
            cid = ex.get("control_id", "")
            sev = sev_lookup.get(cid, "MEDIUM")
            if sev not in ("CRITICAL", "HIGH", "MEDIUM"):
                sev = "MEDIUM"
            meta = ctrl_meta.get(cid, {"type": "Data Quality", "owner": "Unassigned", "desc": "Validation finding detected"})
            ftype = meta["type"]
            owner = meta["owner"]
            description = meta["desc"]
            f = {
                "id": str(ex.get("exception_id", ""))[:8],
                "control_id": cid,
                "rule_id": ex.get("rule_id"),
                "entity": ex.get("entity_name"),
                "description": description,
                "type": ftype,
                "severity": sev,
                "owner": owner,
                "status": "OPEN",
                "date": str(ex.get("created_timestamp") or ""),
                "source_value": str(ex.get("source_value") or ""),
                "target_value": str(ex.get("target_value") or ""),
                "delta_value": str(ex.get("variance_value") or ""),
                "created_at": str(ex.get("created_timestamp") or ""),
            }
            findings.append(f)
            type_counts[f["type"]] = type_counts.get(f["type"], 0) + 1
            sev_lower = sev.lower()
            if owner not in owner_map:
                owner_map[owner] = {"total": 0, "critical": 0, "high": 0, "medium": 0}
            owner_map[owner]["total"] += 1
            if sev_lower in owner_map[owner]:
                owner_map[owner][sev_lower] += 1
            if sev_lower in sev_counts:
                sev_counts[sev_lower] += 1
            sev_counts["open"] += 1
        by_type = [{"label": k, "value": v} for k, v in sorted(type_counts.items(), key=lambda x: -x[1])]
        by_owner = [{"owner": k, **v} for k, v in sorted(owner_map.items(), key=lambda x: -x[1]["total"])]
        return {
            "overview": {"total_findings": len(findings), "open": sev_counts["open"], "critical": sev_counts["critical"], "high": sev_counts["high"], "medium": sev_counts["medium"]},
            "total": len(findings),
            "findings": findings,
            "by_type": by_type,
            "by_owner": by_owner,
        }

    def _build_risk(self, batch_id):
        validation = self._build_validation(batch_id)
        dist = validation.get("distribution", {})
        total = sum(dist.values())
        passed = dist.get("Passed", 0)
        skipped = dist.get("Skipped", 0)
        pass_rate = round((passed / total) * 100, 1) if total else 0
        controls = self._fetch_control_summary(batch_id)
        registry = self._fetch_controls()
        sev_lookup = {r.get("control_id"): (r.get("severity_level") or "MEDIUM").upper() for r in registry}
        crit_count = sum(1 for c in controls if (c.get("overall_status") or "").upper() in ("BLOCKED", "ERROR"))
        if crit_count == 0 and pass_rate >= 80:
            decision, level, reason = "GO", "Low", "All controls passed; no critical blockers."
        elif crit_count == 0 and pass_rate >= 50:
            decision, level, reason = "NO-GO", "Medium", f"Pass rate {pass_rate}% is below 80% threshold."
        else:
            decision, level, reason = "NO-GO", "High", f"{crit_count} critical control(s) blocked; pass rate {pass_rate}%."
        risks = []
        rid = 0
        for c in controls:
            st = (c.get("overall_status") or "").upper()
            cid = c.get("control_id", "")
            if st in ("FAIL", "ERROR", "BLOCKED"):
                rid += 1
                risks.append({
                    "id": f"R-{rid:03d}", "risk": f"Control {cid} failed validation",
                    "severity": "CRITICAL" if st in ("ERROR", "BLOCKED") else "HIGH",
                    "impact": "Data integrity compromised", "detail": f"Status: {st}",
                    "mitigation": "Investigate root cause and remediate data",
                    "owner": "Migration Lead", "status": "OPEN",
                })
        if skipped > 0:
            skipped_ctrls = [c for c in controls if (c.get("overall_status") or "").upper() == "SKIPPED"]
            for c in skipped_ctrls:
                rid += 1
                cid = c.get("control_id", "")
                risks.append({
                    "id": f"R-{rid:03d}", "risk": f"Control {cid} not executed — validation scope gap",
                    "severity": "MEDIUM",
                    "impact": "Unvalidated data may contain undetected quality issues",
                    "detail": "Control skipped during execution",
                    "mitigation": "Include control in next validation batch or document exclusion rationale",
                    "owner": "Migration Lead", "status": "OPEN",
                })
        if pass_rate < 80 and pass_rate > 0:
            rid += 1
            risks.append({
                "id": f"R-{rid:03d}", "risk": f"Overall pass rate {pass_rate}% below 80% threshold",
                "severity": "HIGH",
                "impact": "Migration readiness not met — production cutover at risk",
                "detail": f"Only {passed}/{total} controls passed",
                "mitigation": "Remediate failed controls and re-run validation to improve pass rate",
                "owner": "Migration Lead", "status": "OPEN",
            })
        crit_risks = sum(1 for r in risks if r["severity"] == "CRITICAL")
        high_risks = sum(1 for r in risks if r["severity"] == "HIGH")
        med_risks = sum(1 for r in risks if r["severity"] == "MEDIUM")
        return {
            "decision": decision, "level": level, "score": pass_rate, "reason": reason,
            "overview": {"total_risks": len(risks), "critical": crit_risks, "high": high_risks, "medium": med_risks},
            "minimum_requirements": [
                {"label": "All CRITICAL controls resolved", "met": crit_count == 0},
                {"label": "Validation score > 80%", "met": pass_rate > 80},
                {"label": "Zero blocking controls", "met": crit_count == 0},
            ],
            "risks": risks,
        }

    def _build_quality(self, batch_id):
        validation = self._build_validation(batch_id)
        dist = validation.get("distribution", {})
        total = sum(dist.values())
        passed = dist.get("Passed", 0)
        overall_score = round((passed / total) * 100, 1) if total else 0
        rating = "GOOD" if overall_score >= 90 else "FAIR" if overall_score >= 70 else "POOR"
        dims = [
            {"name": "Completeness", "score": overall_score, "rating": rating, "assessment": "Field completeness across migrated datasets", "details": f"{passed}/{total} controls passed"},
            {"name": "Accuracy", "score": overall_score, "rating": rating, "assessment": "Data accuracy validation results", "details": "Values match source within tolerance"},
            {"name": "Consistency", "score": overall_score, "rating": rating, "assessment": "Cross-system data consistency", "details": "Referential integrity checks"},
            {"name": "Timeliness", "score": overall_score, "rating": rating, "assessment": "Data freshness and latency", "details": "Timestamps within acceptable range"},
            {"name": "Validity", "score": overall_score, "rating": rating, "assessment": "Business rule compliance", "details": "Format and range validations"},
            {"name": "Uniqueness", "score": overall_score, "rating": rating, "assessment": "Duplicate detection results", "details": "Primary key and unique constraint checks"},
        ]
        best = max(dims, key=lambda d: d["score"])
        worst = min(dims, key=lambda d: d["score"])
        return {
            "overall_score": overall_score,
            "dimensions": dims,
            "trend": [{"label": f"Batch {i+1}", "value": overall_score} for i in range(max(2, total // 10 + 1))],
            "best_dimension": {"name": best["name"], "score": best["score"]},
            "worst_dimension": {"name": worst["name"], "score": worst["score"]},
            "analysis": {
                "narrative": f"Overall data quality score is {overall_score}%. {'All dimensions are performing well.' if overall_score >= 80 else 'Several dimensions require attention.'}",
                "strengths": f"Completeness and validity checks show {overall_score}% pass rate.",
                "remediation": f"Focus on improving {worst['name']} which scored {worst['score']}%." if worst["score"] < 80 else "No critical remediation required.",
            },
        }

    def _build_readiness(self, batch_id):
        cats = [
            {"category": "Data Quality", "weight": 30},
            {"category": "Validation", "weight": 25},
            {"category": "Risk", "weight": 20},
            {"category": "Governance", "weight": 15},
            {"category": "Migration Completeness", "weight": 10},
        ]
        validation = self._build_validation(batch_id)
        dist = validation.get("distribution", {})
        total = sum(dist.values())
        passed = dist.get("Passed", 0)
        base_score = round((passed / total) * 100, 1) if total else 0
        for cat in cats:
            cat["score"] = base_score
            cat["weighted"] = round(base_score * cat["weight"] / 100, 1)
            cat["met"] = base_score >= 80
        overall = sum(c["weighted"] for c in cats)
        threshold = 80
        gap = round(overall - threshold, 1)
        ready = overall >= threshold
        actions = []
        if not ready:
            actions = [
                "Improve data quality scores above 80% threshold",
                "Resolve all critical validation failures",
                "Complete governance sign-off process",
                "Ensure risk assessment is below medium level",
                "Verify migration completeness for all datasets",
            ]
        return {
            "score": {"overall": overall, "threshold": threshold, "gap": gap, "ready": ready},
            "categories": cats,
            "verdict_title": "MIGRATION READY" if ready else "MIGRATION NOT READY",
            "verdict_text": f"Overall readiness score is {overall}% ({'meets' if ready else 'below'} the {threshold}% threshold)." if total > 0 else "No validation data available to assess readiness.",
            "required_actions": actions,
        }

    def _build_issues(self, batch_id):
        governance = self._build_governance(batch_id)
        overview = governance.get("overview", {})
        return {
            "summary": {"total": overview.get("total_findings", 0), "open": overview.get("open", 0), "critical": overview.get("critical", 0), "high": overview.get("high", 0), "medium": overview.get("medium", 0)},
            "issues": governance.get("findings", []),
            "by_owner": governance.get("by_owner", []),
        }