"""OC-REPORT-001 Phase 0.1 — export route tests.

P0: `batch_id` is taken from the URL. Before the fix neither export endpoint
called the canonical batch->project->tenant verification, so any authenticated
tenant user could export any other tenant's control execution rows.

These tests cover both halves of the requirement:
  * same-tenant export still succeeds (no regression on valid behaviour)
  * a foreign / unknown / non-UUID batch is refused, and never reaches the
    exporter, so no rows can leak through a crafted batch identifier.
"""
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.api.routes.export_routes import router
from app.api.core.auth.dependencies import get_current_user_with_tenant


app = FastAPI()
app.include_router(router)

client = TestClient(app)

TENANT_A = "11111111-1111-1111-1111-111111111111"
TENANT_B = "22222222-2222-2222-2222-222222222222"
BATCH_A = "aaaaaaaa-1111-1111-1111-111111111111"
BATCH_B = "bbbbbbbb-2222-2222-2222-222222222222"


@pytest.fixture(autouse=True)
def _hermetic_auth():
    """DEV-003: auth overrides are security-relevant. Set per-test so file
    execution order cannot leak or clear them. NOTE: the export routes depend on
    get_current_user_with_tenant, not get_current_user — the previous version of
    this file overrode the wrong dependency and silently exercised no auth path
    at all (all 5 tests were failing in the baseline)."""
    app.dependency_overrides[get_current_user_with_tenant] = lambda: {
        "sub": "test-user",
        "tenant_id": TENANT_A,
        "roles": ["Tenant Admin"],
    }
    yield
    app.dependency_overrides.clear()


class TestExportRoutesSameTenant:
    """Valid same-tenant behaviour must be unchanged by the fix."""

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_success(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}
        mock_service.export_csv.return_value = (
            "Rule ID,Entity Name,Status\nC01_ROWCOUNT,accounts,PASS\n"
        )

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/csv')

        assert response.status_code == 200
        assert response.headers['content-type'] == 'text/csv; charset=utf-8'
        assert 'attachment' in response.headers.get('content-disposition', '')
        assert 'C01_ROWCOUNT' in response.text

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_empty_data(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}
        mock_service.export_csv.return_value = "Rule ID,Entity Name,Status\n"

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/csv')

        assert response.status_code == 200
        assert 'Rule ID' in response.text

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_export_pdf_success(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}
        mock_service.export_pdf.return_value = b'%PDF-1.4 fake pdf content'

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/pdf')

        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/pdf'
        assert 'attachment' in response.headers.get('content-disposition', '')

    @patch('app.api.routes.export_routes.batch_tenant_service')
    def test_verification_is_scoped_to_effective_tenant(self, mock_batch):
        """The verification must receive the RESOLVED tenant, not a batch id."""
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}

        with patch('app.api.routes.export_routes.export_service') as svc:
            svc.export_csv.return_value = "h\n"
            client.get(f'/api/v1/execution/export/{BATCH_A}/csv')

        mock_batch.verify_batch_tenant.assert_called_once_with(BATCH_A, TENANT_A)


class TestExportRoutesTenantIsolation:
    """The P0 regression tests. A foreign batch must not be exportable, and the
    exporter must never be invoked."""

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_cross_tenant_csv_is_refused(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = None  # foreign batch
        mock_service.export_csv.return_value = "SHOULD NEVER BE PRODUCED\n"

        response = client.get(f'/api/v1/execution/export/{BATCH_B}/csv')

        assert response.status_code == 404
        assert 'SHOULD NEVER BE PRODUCED' not in response.text
        mock_service.export_csv.assert_not_called()

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_cross_tenant_pdf_is_refused(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = None

        response = client.get(f'/api/v1/execution/export/{BATCH_B}/pdf')

        assert response.status_code == 404
        mock_service.export_pdf.assert_not_called()

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_foreign_and_unknown_are_indistinguishable(self, mock_service, mock_batch):
        """404 for both — the API must not confirm that a foreign batch exists."""
        mock_batch.verify_batch_tenant.return_value = None
        mock_service.export_csv.return_value = "SECRET\n"

        foreign = client.get(f'/api/v1/execution/export/{BATCH_B}/csv')
        unknown = client.get(
            '/api/v1/execution/export/cccccccc-3333-3333-3333-333333333333/csv'
        )

        assert foreign.status_code == unknown.status_code == 404
        assert foreign.json() == unknown.json()

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_non_uuid_batch_id_cannot_bypass_scope(self, mock_service, mock_batch):
        """A crafted non-UUID batch id can never match the uuid-typed registry;
        verify_batch_tenant denies it early. The exporter must not run."""
        mock_batch.verify_batch_tenant.return_value = None
        mock_service.export_csv.return_value = "SECRET\n"

        for candidate in ("batch-1", "1 OR 1=1", "../../etc/passwd", "%00"):
            response = client.get(f'/api/v1/execution/export/{candidate}/csv')
            assert response.status_code == 404, candidate

        mock_service.export_csv.assert_not_called()

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_tenant_query_override_is_ignored_for_non_super_admin(self, mock_service, mock_batch):
        """resolve_tenant only honours ?tenant_id= for Super Admin. A Tenant Admin
        cannot borrow another tenant's id to widen their own scope."""
        mock_batch.verify_batch_tenant.return_value = None
        mock_service.export_csv.return_value = "SECRET\n"

        response = client.get(
            f'/api/v1/execution/export/{BATCH_A}/csv?tenant_id={TENANT_B}'
        )

        assert response.status_code == 404
        # verification still ran against the JWT tenant, not the override
        mock_batch.verify_batch_tenant.assert_called_once_with(BATCH_A, TENANT_A)
        mock_service.export_csv.assert_not_called()


class TestExportRoutesUnauthenticated:

    @patch('app.api.routes.export_routes.export_service')
    def test_export_requires_authentication(self, mock_service):
        app.dependency_overrides.clear()

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/csv')

        assert response.status_code == 401
        mock_service.export_csv.assert_not_called()


class TestExportRoutesErrorHandling:

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_export_csv_handles_error(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}
        mock_service.export_csv.side_effect = Exception("Database error")

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/csv')

        assert response.status_code == 500

    @patch('app.api.routes.export_routes.batch_tenant_service')
    @patch('app.api.routes.export_routes.export_service')
    def test_export_pdf_handles_error(self, mock_service, mock_batch):
        mock_batch.verify_batch_tenant.return_value = {"project_id": "proj-1"}
        mock_service.export_pdf.side_effect = Exception("Database error")

        response = client.get(f'/api/v1/execution/export/{BATCH_A}/pdf')

        assert response.status_code == 500
