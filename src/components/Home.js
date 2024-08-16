import React, { useState }  from 'react';
import Typewriter from 'typewriter-effect';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import introImage from '../img/intro.avif';
import logo from '../img/logo.webp';
import Login from './Login';


const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${introImage})` }}>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 mr-2" />
          <h1 className="text-4xl font-bold" style={{
            background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            FinAI
          </h1>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center bg-black bg-opacity-0 p-12">
        <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          <h1>Introducing </h1>
            <span style={{
              background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
            <Typewriter
              options={{
              strings: ['AI Financial Planner'],
              autoStart: true,
              loop: true,
            }}
            />
          </span>
        </h1>

          <p className="text-lg md:text-xl mb-8 text-white mx-auto">
            FinAI is an innovative financial planning web application designed to offer personalized financial advice and investment suggestions. Leveraging cutting-edge GenAI and machine learning technologies, FinAI analyzes user inputs to create tailored financial plans aimed at helping users achieve their financial goals.
          </p>
          <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-md hover:bg-opacity-80"
              onClick={handleLogin}
              style={{ background: 'linear-gradient(45deg, #00f260, #0575e6)' }}
            >
              Try Now
            </button>
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <a href="https://twitter.com" className="mx-2 text-white hover:text-primary-blue">
          <FaTwitter size={30} />
        </a>
        <a href="https://instagram.com" className="mx-2 text-white hover:text-primary-blue">
          <FaInstagram size={30} />
        </a>
        <a href="https://facebook.com" className="mx-2 text-white hover:text-primary-blue">
          <FaFacebook size={30} />
        </a>
      </div>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

    </div>
  );
};

export default Home;
