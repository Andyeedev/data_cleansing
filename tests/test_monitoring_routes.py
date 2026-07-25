from fastapi.testclient import TestClient
from app.api.main import app
from app.api.core.auth.dependencies import get_current_user


def _mock_admin():
    return {"sub": "test@test.com", "role": "admin", "email": "test@test.com"}


def _mock_viewer():
    return {"sub": "viewer@test.com", "role": "viewer", "email": "viewer@test.com"}


def _get_client(user_override):
    app.dependency_overrides[get_current_user] = user_override
    return TestClient(app)


class TestMonitoringHealthEndpoint:

    def test_get_health_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data

    def test_get_health_database_field(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/health")
        data = response.json()
        assert "database" in data["data"]
        assert isinstance(data["data"]["database"], bool)

    def test_get_health_api_field(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/health")
        data = response.json()
        assert data["data"]["api"] is True

    def test_get_health_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/monitoring/health")
        assert response.status_code == 403


class TestMonitoringMetricsEndpoint:

    def test_get_metrics_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/metrics")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_metrics_has_required_fields(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/metrics")
        data = response.json()
        assert "total_executions" in data["data"]
        assert "active_executions" in data["data"]
        assert "completed_executions" in data["data"]
        assert "failed_executions" in data["data"]

    def test_get_metrics_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/monitoring/metrics")
        assert response.status_code == 403


class TestMonitoringQueueEndpoint:

    def test_get_queue_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/queue")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_queue_has_items(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/queue")
        data = response.json()
        assert "items" in data["data"]
        assert isinstance(data["data"]["items"], list)

    def test_get_queue_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/monitoring/queue")
        assert response.status_code == 403


class TestMonitoringAlertsEndpoint:

    def test_get_alerts_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/alerts")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_alerts_has_total(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/alerts")
        data = response.json()
        assert "total" in data["data"]

    def test_get_alerts_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/monitoring/alerts")
        assert response.status_code == 403


class TestMonitoringLogsEndpoint:

    def test_get_logs_returns_200(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/logs")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_get_logs_limit_parameter(self):
        client = _get_client(_mock_admin)
        response = client.get("/api/v1/monitoring/logs?limit=10")
        assert response.status_code == 200

    def test_get_logs_viewer_forbidden(self):
        client = _get_client(_mock_viewer)
        response = client.get("/api/v1/monitoring/logs")
        assert response.status_code == 403