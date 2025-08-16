import { useState } from "react";

const useContactus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendContactData = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/contactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendContactData, loading, error };
};

export default useContactus;
