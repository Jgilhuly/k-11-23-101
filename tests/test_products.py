"""Unit tests for product endpoints."""
import pytest
from fastapi.testclient import TestClient

from models import ProductCreate, ProductUpdate


def test_get_products_empty(test_client: TestClient):
    """Test GET /products returns empty list when no products exist."""
    response = test_client.get("/products")
    assert response.status_code == 200
    assert response.json() == []


def test_create_product(test_client: TestClient):
    """Test POST /products creates a new product."""
    product_data = {
        "name": "Test Product",
        "description": "A test product",
        "price": 99.99,
        "category": "Test",
        "tags": ["test", "sample"],
        "in_stock": True
    }
    response = test_client.post("/products", json=product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == product_data["name"]
    assert data["description"] == product_data["description"]
    assert data["price"] == product_data["price"]
    assert data["category"] == product_data["category"]
    assert data["tags"] == product_data["tags"]
    assert data["in_stock"] == product_data["in_stock"]
    assert "created_at" in data


def test_get_products_with_data(test_client: TestClient):
    """Test GET /products returns all products."""
    # Create a product first
    product_data = {
        "name": "Test Product",
        "description": "A test product",
        "price": 99.99,
        "category": "Test"
    }
    test_client.post("/products", json=product_data)
    
    response = test_client.get("/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 1
    assert products[0]["name"] == product_data["name"]


def test_get_product_success(test_client: TestClient):
    """Test GET /products/{product_id} returns product when it exists."""
    # Create a product first
    product_data = {
        "name": "Test Product",
        "description": "A test product",
        "price": 99.99,
        "category": "Test"
    }
    create_response = test_client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    response = test_client.get(f"/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["name"] == product_data["name"]


def test_get_product_not_found(test_client: TestClient):
    """Test GET /products/{product_id} returns 404 when product doesn't exist."""
    response = test_client.get("/products/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_update_product_success(test_client: TestClient):
    """Test PUT /products/{product_id} updates product when it exists."""
    # Create a product first
    product_data = {
        "name": "Original Product",
        "description": "Original description",
        "price": 50.00,
        "category": "Original"
    }
    create_response = test_client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    # Update the product
    update_data = {
        "name": "Updated Product",
        "price": 75.00
    }
    response = test_client.put(f"/products/{product_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["name"] == update_data["name"]
    assert data["price"] == update_data["price"]
    # Unchanged fields should remain
    assert data["description"] == product_data["description"]
    assert data["category"] == product_data["category"]


def test_update_product_not_found(test_client: TestClient):
    """Test PUT /products/{product_id} returns 404 when product doesn't exist."""
    update_data = {
        "name": "Updated Product"
    }
    response = test_client.put("/products/999", json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_delete_product_success(test_client: TestClient):
    """Test DELETE /products/{product_id} deletes product when it exists."""
    # Create a product first
    product_data = {
        "name": "Product to Delete",
        "description": "Will be deleted",
        "price": 25.00,
        "category": "Test"
    }
    create_response = test_client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    # Delete the product
    response = test_client.delete(f"/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Product deleted successfully"
    
    # Verify product is deleted
    get_response = test_client.get(f"/products/{product_id}")
    assert get_response.status_code == 404


def test_delete_product_not_found(test_client: TestClient):
    """Test DELETE /products/{product_id} returns 404 when product doesn't exist."""
    response = test_client.delete("/products/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_create_product_minimal_fields(test_client: TestClient):
    """Test POST /products with minimal required fields."""
    product_data = {
        "name": "Minimal Product",
        "description": "Minimal description",
        "price": 10.00,
        "category": "Minimal"
    }
    response = test_client.post("/products", json=product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product_data["name"]
    # Default values should be applied
    assert data["tags"] == []
    assert data["in_stock"] is True

