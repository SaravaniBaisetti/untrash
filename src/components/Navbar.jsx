import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../App.css'; // Ensure you're importing global styles

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: 'var(--navbar-bg)' }}>
      <div className="d-flex align-items-center gap-3">
        <img src={logo} alt="Untrash Logo" height="40" className="rounded-circle" />
        <span className="fw-bold fs-4" style={{ color: 'var(--highlight-color)' }}>Untrash</span>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <ThemeToggle />
        <Link to="/login" className="btn btn-success">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
