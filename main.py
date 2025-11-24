"""FastAPI application for Product CRUD operations."""
from typing import List
import uvicorn

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from models import Product, ProductCreate, ProductUpdate, User, UserCreate, UserUpdate
from database import db, InMemoryDatabase

app = FastAPI(
    title="Product CRUD API",
    description="A simple CRUD API for managing products",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> InMemoryDatabase:
    """Dependency function to get database instance."""
    return db


@app.get("/")
def read_root():
    """Root endpoint returning welcome message."""
    return {"message": "Welcome to the Product CRUD API"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/products", response_model=List[Product])
def get_products(database: InMemoryDatabase = Depends(get_db)):
    """Get all products"""
    return database.get_all_products()

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int, database: InMemoryDatabase = Depends(get_db)):
    """Get a specific product by ID"""
    product = database.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/products", response_model=Product)
def create_product(product: ProductCreate, database: InMemoryDatabase = Depends(get_db)):
    """Create a new product"""
    # TODO: Add validation logic here
    return database.create_product(product)


@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: int, product_update: ProductUpdate, database: InMemoryDatabase = Depends(get_db)):
    """Update an existing product"""
    # TODO: Add validation and error handling
    updated_product = database.update_product(product_id, product_update)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, database: InMemoryDatabase = Depends(get_db)):
    """Delete a product"""
    if database.delete_product(product_id):
        return {"message": "Product deleted successfully"}
    raise HTTPException(status_code=404, detail="Product not found")


@app.post("/users", response_model=User)
def create_user(user: UserCreate, database: InMemoryDatabase = Depends(get_db)):
    """Create a new user"""
    return database.create_user(user)

@app.get("/users", response_model=List[User])
def get_users(database: InMemoryDatabase = Depends(get_db)):
    """Get all users"""
    return database.get_all_users()

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int, database: InMemoryDatabase = Depends(get_db)):
    """Get a specific user by ID"""
    user = database.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, user_update: UserUpdate, database: InMemoryDatabase = Depends(get_db)):
    """Update an existing user"""
    updated_user = database.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, database: InMemoryDatabase = Depends(get_db)):
    """Delete a user"""
    success = database.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
