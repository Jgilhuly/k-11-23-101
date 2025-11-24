import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import userService from '../services/userService';
import './Pages.css';

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(parseInt(id));
      setUser(data);
    } catch (err) {
      setError('Failed to load user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(parseInt(id));
        navigate('/users');
      } catch (err) {
        setError('Failed to delete user');
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

  if (error || !user) {
    return (
      <div>
        <div className="error-message">{error || 'User not found'}</div>
        <Link to="/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{user.name}</h1>
        <div className="detail-actions">
          <Link to={`/users/${user.id}/edit`}>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Link to="/users">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Card>
        <CardHeader>User Information</CardHeader>
        <CardBody>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-label">User ID</div>
              <div className="info-item-value">{user.id}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Email</div>
              <div className="info-item-value">{user.email}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Full Name</div>
              <div className="info-item-value">{user.name}</div>
            </div>

            <div className="info-item">
              <div className="info-item-label">Member Since</div>
              <div className="info-item-value">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDetail;

