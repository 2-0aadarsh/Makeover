// src/hooks/useSignup.js
import { useState } from 'react';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Signup failed');
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

  return { signup, loading, error };
};

export default useSignup;
