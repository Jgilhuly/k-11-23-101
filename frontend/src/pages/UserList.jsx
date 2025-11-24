import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import userService from '../services/userService';
import './Pages.css';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
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
        <h1 className="list-title">Users</h1>
        <Link to="/users/new">
          <Button variant="primary">New User</Button>
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <Card>
          <CardBody>
            <div className="empty-state">
              <h2>No users found</h2>
              <p>Start by creating your first user</p>
              <Link to="/users/new" className="empty-state-button">
                <Button variant="primary">Create User</Button>
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
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                      {user.name}
                    </Link>
                  </td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/users/${user.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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

export default UserList;

