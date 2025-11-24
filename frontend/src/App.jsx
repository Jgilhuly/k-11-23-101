import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ProductDetail from './pages/ProductDetail';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
