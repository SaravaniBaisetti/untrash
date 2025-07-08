import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-container d-flex flex-column justify-content-center align-items-center text-center px-3">

      <h1 className="hero-title mb-3">Turn Trash into Impact ♻️</h1>

      <p className="hero-subtext mb-4">
        Your plastic can feed a child, clean a street, and fund a cause — all without spending a rupee.
      </p>

      <div className="mb-4">
        <h5 className="hero-small-title mb-3" style={{ color: 'var(--subtext-color)' }}>Join the Movement As a</h5>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/register-cafe" className="hero-button">Cafe / Restaurant</Link>
          <Link to="/register-user" className="hero-button">Eco Volunteer</Link>
        </div>
      </div>

      <div className="hero-card animate-in mt-5" >
        <h3 className="hero-card-title mb-3" style={{ color: 'var(--text-color)' }}>♻️ Welcome to Untrash</h3>
        <p className="hero-card-text" >
          We help cafés and communities donate plastic for rewards & causes.
        </p>
        <Link to="/about" className="hero-button-outline mt-3">Learn More</Link>
      </div>
    </div>
  );
};

export default Hero;
