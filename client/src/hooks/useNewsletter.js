import { useState } from 'react';
const backendurl = import.meta.env.VITE_BACKEND_URL;

/**
 * Custom hook for newsletter subscription
 * @param {string} source - Source page identifier (e.g., 'about-page', 'footer', 'home-page')
 * @returns {Object} Newsletter state and methods
 */
export const useNewsletter = (source = 'other') => {
  const [formData, setFormData] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  /**
   * Handle email input change
   */
  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    
    // Clear message when user types
    if (submitMessage.text) {
      setSubmitMessage({ type: '', text: '' });
    }
  };

  /**
   * Handle newsletter subscription
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const response = await fetch(
        `${backendurl}/api/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            source: source,
          }),
        }
      );

      // Check if response is ok before parsing
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (data.alreadySubscribed) {
          setSubmitMessage({
            type: 'info',
            text: "You're already subscribed to our newsletter!",
          });
        } else if (data.resubscribed) {
          setSubmitMessage({
            type: 'success',
            text: "Welcome back! You've been resubscribed.",
          });
          setFormData({ email: '' });
        } else {
          setSubmitMessage({
            type: 'success',
            text: 'Successfully subscribed! Check your email.',
          });
          setFormData({ email: '' });
        }
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.message || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // More specific error messages
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Sorry for the inconvenience caused.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Clear form and messages
   */
  const reset = () => {
    setFormData({ email: '' });
    setSubmitMessage({ type: '', text: '' });
    setIsSubmitting(false);
  };

  /**
   * Set custom message
   */
  const setMessage = (type, text) => {
    setSubmitMessage({ type, text });
  };

  return {
    // State
    email: formData.email,
    isSubmitting,
    submitMessage,
    
    // Actions
    handleChange,
    handleSubmit,
    reset,
    setMessage,
  };
};

