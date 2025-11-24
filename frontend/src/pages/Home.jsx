import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import './Pages.css';

export const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Welcome to CRUD App</h1>
        <p>Manage your Products and Users with ease</p>
      </div>

      <div className="grid-container">
        <Card className="feature-card">
          <CardBody>
            <h3>Products Management</h3>
            <p>Create, read, update, and delete products. Manage inventory efficiently with category and tag support.</p>
            <div className="card-actions">
              <Link to="/products">
                <Button variant="primary">View Products</Button>
              </Link>
              <Link to="/products/new">
                <Button variant="outline">Create Product</Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card className="feature-card">
          <CardBody>
            <h3>Users Management</h3>
            <p>Manage user accounts with email and authentication. Add, edit, and remove users from your system.</p>
            <div className="card-actions">
              <Link to="/users">
                <Button variant="primary">View Users</Button>
              </Link>
              <Link to="/users/new">
                <Button variant="outline">Create User</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Home;

