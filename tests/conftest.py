"""Pytest configuration and shared fixtures for API tests."""
import pytest
from fastapi.testclient import TestClient

from main import app, get_db
from database import InMemoryDatabase


@pytest.fixture
def test_db():
    """Create a fresh database instance for each test."""
    return InMemoryDatabase(init_sample_data=False)


@pytest.fixture
def test_client(test_db):
    """Create a test client with database dependency override."""
    app.dependency_overrides[get_db] = lambda: test_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

