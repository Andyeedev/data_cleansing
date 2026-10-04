from datetime import datetime

from app.pma.assessment_context import PMA_ASSESSMENT_TYPE, PmaAssessmentContext


class TestPmaAssessmentContext:

    def _context(self, **overrides):
        fields = {
            "tenant_id": "tenant-1",
            "project_id": "proj-1",
            "system_id": "sys-1",
            "system_name": "SourceDB",
            "batch_id": "batch-1",
            "started_at": datetime(2026, 10, 3, 14, 30),  # noqa: DTZ001
        }
        fields.update(overrides)
        return PmaAssessmentContext(**fields)

    def test_assessment_type_is_pma(self):
        context = self._context()
        assert context.assessment_type == "PMA"
        assert context.assessment_type == PMA_ASSESSMENT_TYPE

    def test_required_identity_fields_stored(self):
        context = self._context()
        assert context.tenant_id == "tenant-1"
        assert context.project_id == "proj-1"
        assert context.system_id == "sys-1"
        assert context.system_name == "SourceDB"
        assert context.batch_id == "batch-1"
        assert context.started_at == datetime(2026, 10, 3, 14, 30)  # noqa: DTZ001

    def test_phase5a_placeholders_are_empty(self):
        context = self._context()
        assert context.applicable_controls == []
        assert context.evidence_policy is None
        assert context.working_set is None
        assert context.health_check is None
        assert context.adapter is None
        assert context.batch_name is None
