import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import productService from '../services/productService';
import './Pages.css';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(parseInt(id));
      setProduct(data);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(parseInt(id));
        navigate('/products');
      } catch (err) {
        setError('Failed to delete product');
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

  if (error || !product) {
    return (
      <div>
        <div className="error-message">{error || 'Product not found'}</div>
        <Link to="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{product.name}</h1>
        <div className="detail-actions">
          <Link to={`/products/${product.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Link to="/products">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        <CardBody>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-label">Product ID</div>
              <div className="info-item-value">{product.id}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Category</div>
              <div className="info-item-value">{product.category}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Price</div>
              <div className="info-item-value">${product.price.toFixed(2)}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Stock Status</div>
              <div className="info-item-value">
                {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
              </div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Created</div>
              <div className="info-item-value">
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
            <div className="info-item-label">Description</div>
            <div className="info-item-value">{product.description}</div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="info-item-label">Tags</div>
              <div className="tags-container">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductDetail;

