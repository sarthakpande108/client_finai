import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(`https://finaiserver-production.up.railway.app/api/auth/verify-email?token=${token}`);
          const data = await response.json();

          if (response.ok) {
            setVerificationStatus('success');
            setUserData({ email: data.email, userId: data.userId });

            // Store user data in localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('email', data.email);

            // Redirect to profile page after verification
            navigate(`/profile?userId=${data.userId}&email=${data.email}`);
          } else {
            setVerificationStatus('failed');
          }
        } catch (error) {
          console.error('Verification failed:', error);
          setVerificationStatus('failed');
        }
      };

      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="h-52 w-full max-w-md bg-gray-800 p-6 rounded-lg text-center">
        {verificationStatus === 'success' ? (
          <p>Your email has been successfully verified! Redirecting to profile...</p>
        ) : verificationStatus === 'failed' ? (
          <p>Email verification failed. Please try again or contact support.</p>
        ) : (
          <p>Verifying your email...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
