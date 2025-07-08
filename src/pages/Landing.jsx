import { useEffect } from 'react';
import Hero from '../components/Hero';
import pollutionVideo from '../assets/plastic_vid.mp4';
import portraitVideo from '../assets/plastic_vid_mobile.mp4';

const Landing = () => {
  useEffect(() => {
    // Apply special transparent theme just for this page
    document.body.classList.add('landing-body');

    return () => {
      document.body.classList.remove('landing-body');
    };
  }, []);

  return (
    <div className="landing-page-wrapper">
      {/* 🌿 Landscape video for desktop */}
      <video
        className="bg-video desktop-only"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={pollutionVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 📱 Portrait video for mobile */}
      <video
        className="bg-video mobile-only"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={portraitVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay to enhance readability */}
      <div className="overlay-filter"></div>

      {/* Main content */}
      <div className="landing-content">
        <Hero />
      </div>
    </div>
  );
};

export default Landing;
