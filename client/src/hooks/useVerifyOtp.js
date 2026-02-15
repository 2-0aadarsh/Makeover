

// src/hooks/useVerifyOtp.js
import { useState } from 'react';

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyOtp = async ({ otp, email }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/auth/register/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'OTP verification failed');
        return null;
      }

      return data;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error };
};

export default useVerifyOtp;