import logo from '../assets/logo.jpg';

const About = () => {
  return (
    <div className="container py-5 text-white">
      <div className="text-center mb-5">
        <img src={logo} alt="Untrash Logo" height="60" className="rounded-circle mb-3" />
        <h2 className="text-success">About Untrash</h2>
        <p className="text-light">Turning plastic waste into social good — one bottle at a time.</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-10">
          <div className="card bg-dark p-4 shadow mb-4">
            <h4 className="text-success">🌍 Our Mission</h4>
            <p>
              Untrash is a plastic donation and social impact initiative that connects communities and cafés
              to reduce waste while supporting powerful causes. We believe that your discarded plastic can
              clean a street, feed a child, or fund a cause — without spending a single rupee.
            </p>
          </div>

          <div className="card bg-dark p-4 shadow mb-4">
            <h4 className="text-success">♻️ How It Works</h4>
            <ul>
              <li>We collect PET bottles from cafés and public donation points.</li>
              <li>Each bottle earns you reward points or contributes to charity.</li>
              <li>We partner with recycling agencies and NGOs to fund verified causes.</li>
            </ul>
          </div>

          <div className="card bg-dark p-4 shadow mb-4">
            <h4 className="text-success">🤝 Who We Work With</h4>
            <p>
              Untrash partners with:
              <ul>
                <li>Cafés & Restaurants as donation hubs</li>
                <li>Eco Volunteers as our ambassadors</li>
                <li>Charities and NGOs to ensure impact</li>
              </ul>
            </p>
          </div>

          <div className="card bg-dark p-4 shadow mb-4">
            <h4 className="text-success">🚀 Our Vision</h4>
            <p>
              To make plastic collection as powerful as crowdfunding. Every bottle donated is a step towards a
              cleaner planet and a better tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
