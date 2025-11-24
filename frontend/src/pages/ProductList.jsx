import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import productService from '../services/productService';
import './Pages.css';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError('Failed to delete product. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <h1 className="list-title">Products</h1>
        <Link to="/products/new">
          <Button variant="primary">New Product</Button>
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Start by creating your first product</p>
              <Link to="/products/new" className="empty-state-button">
                <Button variant="primary">Create Product</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.in_stock ? 'In Stock' : 'Out of Stock'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;

