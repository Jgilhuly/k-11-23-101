import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            CRUD App
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link
                to="/products"
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/users"
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              >
                Users
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 CRUD App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

