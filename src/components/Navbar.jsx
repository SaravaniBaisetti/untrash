import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <div className="d-flex align-items-center">
        <img src={logo} alt="Untrash Logo" height="40" className="me-2 rounded-circle" />
        <span className="fw-bold text-success fs-4">Untrash</span>
      </div>
      <div className="ms-auto">
        <Link to="/login" className="btn btn-success">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
