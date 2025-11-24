"""Unit tests for basic endpoints (root and health)."""
import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(test_client: TestClient):
    """Test GET / returns welcome message."""
    response = test_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Welcome to the Product CRUD API"


def test_health_check(test_client: TestClient):
    """Test GET /health returns healthy status."""
    response = test_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"

