import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-container d-flex flex-column justify-content-center align-items-center text-center px-3">
      <h1 className="display-4 text-success mb-3">Turn Trash into Impact ♻️</h1>
      <p className="lead text-light mb-4" style={{ maxWidth: '650px' }}>
        Your plastic can feed a child, clean a street, and fund a cause — all without spending a rupee.
      </p>

      <div className="text-white mb-4">
        <h5 className="mb-3">Join the Movement As a</h5>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/register-cafe" className="btn btn-outline-light">Cafe / Restaurant</Link>
          <Link to="/register-user" className="btn btn-outline-light">Eco Volunteer</Link>
        </div>
      </div>

      <div className="card bg-secondary text-white p-4 shadow rounded mt-5" style={{ maxWidth: '480px', width: '100%' }}>
        <h3 className="mb-3 text-white">♻️ Welcome to Untrash</h3>
        <p>
          We help cafés and communities donate plastic for rewards & causes.
        </p>
        <Link to="/about" className="btn btn-outline-light mt-3">Learn More</Link>
      </div>
    </div>
  );
};

export default Hero;
