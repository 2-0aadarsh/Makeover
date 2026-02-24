import { useState } from 'react';
const backendurl = import.meta.env.VITE_BACKEND_URL;
import { useSelector } from 'react-redux';

/**
 * Custom hook for managing enquiry form state and submission
 * @returns {Object} Enquiry state and handlers
 */
const useEnquiry = () => {
  // Get user from Redux auth store (for auto-filling user details). User lives at state.auth.user.
  const { user } = useSelector((state) => state.auth || {});

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber != null ? String(user.phoneNumber).trim() : '',
    message: '',
    preferredDate: '',
    preferredTimeSlot: '',
    additionalRequirements: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [enquiryNumber, setEnquiryNumber] = useState('');

  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  /**
   * Pre-fill name, email, phone from logged-in user (e.g. when enquiry modal opens).
   * Fields remain editable; user can clear or change them.
   */
  const prefillUserDetails = () => {
    if (!user) return;
    const phone = user.phoneNumber != null ? String(user.phoneNumber).trim() : '';
    setFormData((prev) => ({
      ...prev,
      ...(user.name != null && user.name !== '' && { name: user.name }),
      ...(user.email != null && user.email !== '' && { email: user.email }),
      ...(phone !== '' && { phone }),
    }));
  };

  /**
   * Validate form data
   * @returns {Object} Validation result with isValid and errors
   */
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Message validation (optional but with length limit)
    if (formData.message && formData.message.length > 1000) {
      errors.message = 'Message must not exceed 1000 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  /**
   * Submit enquiry form
   * @param {Object} serviceData - Service details (name, category, priceRange, etc.)
   * @param {String} source - Source of enquiry (e.g., "professional-makeup")
   * @returns {Promise} - Resolves to enquiry result
   */
  const submitEnquiry = async (serviceData, source) => {
    try {
      // Validate form
      const { isValid, errors } = validateForm();
      
      if (!isValid) {
        const firstError = Object.values(errors)[0];
        setErrorMessage(firstError);
        return { success: false, message: firstError };
      }

      // Validate service data
      if (!serviceData || !serviceData.serviceName || !serviceData.serviceCategory) {
        setErrorMessage('Service details are missing');
        return { success: false, message: 'Service details are missing' };
      }

      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Prepare enquiry data
      const enquiryData = {
        userId: user?._id || null, // Include userId if user is logged in
        source: source || 'other',
        userDetails: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        serviceDetails: {
          serviceName: serviceData.serviceName,
          serviceCategory: serviceData.serviceCategory,
          priceRange: serviceData.priceRange || null,
          serviceId: serviceData.serviceId || null,
        },
        enquiryDetails: {
          message: formData.message.trim() || '',
          preferredDate: formData.preferredDate || null,
          preferredTimeSlot: formData.preferredTimeSlot || '',
          additionalRequirements: formData.additionalRequirements.trim() || '',
        },
      };

      console.log('📤 Submitting enquiry:', enquiryData);

      // Submit enquiry to API
      const response = await fetch(`${backendurl}/api/enquiry/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      });

      // Check response
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `Server error: ${response.status} ${response.statusText}`,
          };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Enquiry submitted successfully:', data);

      if (data.success) {
        setEnquiryNumber(data.data.enquiryNumber);
        setSuccessMessage(
          data.message || `Thank you! Your enquiry has been submitted. Reference: ${data.data.enquiryNumber}`
        );
        
        // Reset form
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          message: '',
          preferredDate: '',
          preferredTimeSlot: '',
          additionalRequirements: '',
        });

        return {
          success: true,
          message: data.message,
          enquiryNumber: data.data.enquiryNumber,
        };
      } else {
        throw new Error(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('❌ Error submitting enquiry:', error);
      
      const errorMsg =
        error.message || 'Failed to submit enquiry. Please try again later.';
      
      setErrorMessage(errorMsg);
      
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset all messages
   */
  const resetMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
    setEnquiryNumber('');
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      message: '',
      preferredDate: '',
      preferredTimeSlot: '',
      additionalRequirements: '',
    });
    resetMessages();
  };

  /**
   * Check enquiry status by enquiry number
   * @param {String} enquiryNum - Enquiry number to check
   * @returns {Promise} - Enquiry status data
   */
  const checkEnquiryStatus = async (enquiryNum) => {
    try {
      const response = await fetch(
        `${backendurl}/api/enquiry/status/${enquiryNum}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch enquiry status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error checking enquiry status:', error);
      throw error;
    }
  };

  return {
    // Form state
    formData,
    
    // UI state
    isSubmitting,
    successMessage,
    errorMessage,
    enquiryNumber,
    
    // Handlers
    handleInputChange,
    submitEnquiry,
    resetMessages,
    resetForm,
    checkEnquiryStatus,
    prefillUserDetails,

    // Utility
    isLoggedIn: !!user,
  };
};

export default useEnquiry;