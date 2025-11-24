import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import userService from '../services/userService';
import './Pages.css';

export const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await userService.getUserById(parseInt(id));
      setFormData({
        name: data.name,
        email: data.email,
        password: '', // Don't display password for security
      });
    } catch (err) {
      setError('Failed to load user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (id) {
        await userService.updateUser(parseInt(id), payload);
        setSuccess(true);
        setTimeout(() => navigate(`/users/${id}`), 1000);
      } else {
        const result = await userService.createUser(payload);
        setSuccess(true);
        setTimeout(() => navigate(`/users/${result.id}`), 1000);
      }
    } catch (err) {
      setError(id ? 'Failed to update user' : 'Failed to create user');
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
        <CardHeader>{id ? 'Edit User' : 'Create User'}</CardHeader>
        <CardBody>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Saved successfully!</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label={id ? 'New Password (leave empty to keep current)' : 'Password'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!id}
            />

            <div className="form-actions">
              <Button type="submit" variant="primary">
                {id ? 'Update User' : 'Create User'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(id ? `/users/${id}` : '/users')}
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

export default UserForm;

