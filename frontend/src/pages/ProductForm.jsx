import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import productService from '../services/productService';
import './Pages.css';

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    in_stock: true,
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(parseInt(id));
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        tags: data.tags.join(', '),
        in_stock: data.in_stock,
      });
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        in_stock: formData.in_stock,
      };

      if (id) {
        await productService.updateProduct(parseInt(id), payload);
        setSuccess(true);
        setTimeout(() => navigate(`/products/${id}`), 1000);
      } else {
        const result = await productService.createProduct(payload);
        setSuccess(true);
        setTimeout(() => navigate(`/products/${result.id}`), 1000);
      }
    } catch (err) {
      setError(id ? 'Failed to update product' : 'Failed to create product');
      console.error(err);
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
    <div className="form-container">
      <Card>
        <CardHeader>{id ? 'Edit Product' : 'Create Product'}</CardHeader>
        <CardBody>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Saved successfully!</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Product Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <Input
              label="Category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <Input
              label="Tags (comma-separated)"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., electronics, wireless, premium"
            />

            <div className="input-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleChange}
                />
                In Stock
              </label>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">
                {id ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(id ? `/products/${id}` : '/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductForm;

