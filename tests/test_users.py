"""Unit tests for user endpoints."""
import pytest
from fastapi.testclient import TestClient


def test_get_users_empty(test_client: TestClient):
    """Test GET /users returns empty list when no users exist."""
    response = test_client.get("/users")
    assert response.status_code == 200
    assert response.json() == []


def test_create_user(test_client: TestClient):
    """Test POST /users creates a new user."""
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    response = test_client.post("/users", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert data["password"] == user_data["password"]
    assert "created_at" in data


def test_get_users_with_data(test_client: TestClient):
    """Test GET /users returns all users."""
    # Create a user first
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    test_client.post("/users", json=user_data)
    
    response = test_client.get("/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 1
    assert users[0]["name"] == user_data["name"]
    assert users[0]["email"] == user_data["email"]


def test_get_user_success(test_client: TestClient):
    """Test GET /users/{user_id} returns user when it exists."""
    # Create a user first
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    create_response = test_client.post("/users", json=user_data)
    user_id = create_response.json()["id"]
    
    response = test_client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]


def test_get_user_not_found(test_client: TestClient):
    """Test GET /users/{user_id} returns 404 when user doesn't exist."""
    response = test_client.get("/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_update_user_success(test_client: TestClient):
    """Test PUT /users/{user_id} updates user when it exists."""
    # Create a user first
    user_data = {
        "name": "Original User",
        "email": "original@example.com",
        "password": "original123"
    }
    create_response = test_client.post("/users", json=user_data)
    user_id = create_response.json()["id"]
    
    # Update the user
    update_data = {
        "name": "Updated User",
        "email": "updated@example.com"
    }
    response = test_client.put(f"/users/{user_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["name"] == update_data["name"]
    assert data["email"] == update_data["email"]
    # Unchanged fields should remain
    assert data["password"] == user_data["password"]


def test_update_user_partial(test_client: TestClient):
    """Test PUT /users/{user_id} with partial update."""
    # Create a user first
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    create_response = test_client.post("/users", json=user_data)
    user_id = create_response.json()["id"]
    
    # Update only the name
    update_data = {
        "name": "New Name"
    }
    response = test_client.put(f"/users/{user_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["email"] == user_data["email"]
    assert data["password"] == user_data["password"]


def test_update_user_not_found(test_client: TestClient):
    """Test PUT /users/{user_id} returns 404 when user doesn't exist."""
    update_data = {
        "name": "Updated User"
    }
    response = test_client.put("/users/999", json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_delete_user_success(test_client: TestClient):
    """Test DELETE /users/{user_id} deletes user when it exists."""
    # Create a user first
    user_data = {
        "name": "User to Delete",
        "email": "delete@example.com",
        "password": "password123"
    }
    create_response = test_client.post("/users", json=user_data)
    user_id = create_response.json()["id"]
    
    # Delete the user
    response = test_client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted successfully"
    
    # Verify user is deleted
    get_response = test_client.get(f"/users/{user_id}")
    assert get_response.status_code == 404


def test_delete_user_not_found(test_client: TestClient):
    """Test DELETE /users/{user_id} returns 404 when user doesn't exist."""
    response = test_client.delete("/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_create_multiple_users(test_client: TestClient):
    """Test creating multiple users and retrieving them."""
    user1_data = {
        "name": "User One",
        "email": "user1@example.com",
        "password": "pass1"
    }
    user2_data = {
        "name": "User Two",
        "email": "user2@example.com",
        "password": "pass2"
    }
    
    test_client.post("/users", json=user1_data)
    test_client.post("/users", json=user2_data)
    
    response = test_client.get("/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 2
    assert users[0]["id"] == 1
    assert users[1]["id"] == 2

