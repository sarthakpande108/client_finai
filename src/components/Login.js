import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import Emailsent from './VerifyEmail';

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSentPopup, setShowEmailSentPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (isSignUp) {
      await sendVerificationLink();
    } else {
      await signIn();
    }

    setIsLoading(false);
  };

  const sendVerificationLink = async () => {
    try {
      const response = await fetch('https://finaiserver-production.up.railway.app/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      setIsVerificationSent(true);
      setShowEmailSentPopup(true);
    } catch (error) {
      console.error('Error sending verification link:', error);
      setErrorMessage(`Error sending verification link: ${error.message}`);
    }
  };

  const signIn = async () => {
    try {
      const response = await fetch('https://finaiserver-production.up.railway.app/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      navigate('/profile');
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage(`Error signing in: ${error.message}`);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://finaiserver-production.up.railway.app/api/auth/google';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-md w-full hover:bg-opacity-80 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        {isVerificationSent && isSignUp && (
          <p className="text-green-500 mt-4">Verification email sent!</p>
        )}
        <div className="border-t border-gray-700 my-4"></div>
        <h3 className="text-xl font-bold text-white mb-4">Or sign in with</h3>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded-md w-full flex items-center justify-center mb-2 hover:bg-red-600"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
        <div className="text-center text-white mt-4">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-400"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-400"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
      {showEmailSentPopup && <Emailsent onClose={() => setShowEmailSentPopup(false)} />}
    </div>
  );
};

export default Login;
