import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />

      <div className="text-end mt-3 me-3">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default Landing;
