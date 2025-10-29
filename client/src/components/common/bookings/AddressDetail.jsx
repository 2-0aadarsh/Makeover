import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../../../features/address/addressThunks';

/**
 * AddressDetail Component
 * 
 * Displays the booking address section with update/add and change address functionality
 * Includes a modal form for address management
 */
const AddressDetail = ({ 
  currentAddress = "",
  onAddressUpdate = null 
}) => {
  const dispatch = useDispatch();
  const { addresses, isLoading, error, defaultAddress } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    houseFlatNumber: "",
    streetAreaName: "",
    address: "", // This will be mapped to completeAddress
    landmark: "",
    city: "",
    state: "Bihar",
    country: "India",
    pincode: "",
    addressType: "home",
    isDefault: false
  });

  // Load addresses from Redux store on component mount
  useEffect(() => {
    if (user) {
      dispatch(getUserAddresses());
    }
  }, [dispatch, user]);

  // Auto-sync with default address from Redux store
  useEffect(() => {
    // If no currentAddress is provided and we have a default address, use it
    if (!currentAddress && defaultAddress && onAddressUpdate) {
      const fullAddress = formatAddressString(defaultAddress);
      onAddressUpdate(fullAddress);
    }
  }, [addresses, defaultAddress, currentAddress, onAddressUpdate]);

  // Helper function to format address string
  const formatAddressString = (address) => {
    if (!address) return '';
    return `${address.houseFlatNumber}, ${address.streetAreaName}, ${address.completeAddress}, ${address.landmark}, ${address.city} (${address.pincode})`;
  };

  // Sort addresses so default is always first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  // Check if form is valid
  const isFormValid = () => {
    return formData.houseFlatNumber.trim() !== "" &&
           formData.streetAreaName.trim() !== "" &&
           formData.address.trim() !== "" &&
           formData.city.trim() !== "" &&
           formData.state.trim() !== "" &&
           formData.pincode.trim() !== "";
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-detect city based on pincode
    if (field === "pincode" && value.length === 6) {
      const detectedCity = detectCityFromPincode(value);
      if (detectedCity) {
        setFormData(prev => ({
          ...prev,
          city: detectedCity
        }));
      }
    }
  };

  // Function to detect city from pincode (sample data)
  const detectCityFromPincode = (pincode) => {
    const pincodeCityMap = {
      "823001": "Gaya",
      "110001": "New Delhi",
      "400001": "Mumbai",
      "560001": "Bangalore",
      "600001": "Chennai",
      "700001": "Kolkata",
      "380001": "Ahmedabad",
      "302001": "Jaipur",
      "500001": "Hyderabad",
      "411001": "Pune",
      "800001": "Patna",
      "751001": "Bhubaneswar",
      "440001": "Nagpur",
      "641001": "Coimbatore",
      "695001": "Thiruvananthapuram"
    };
    
    return pincodeCityMap[pincode] || null;
  };

  // Handle form submission
  const handleSaveAddress = async () => {
    if (isFormValid()) {
      try {
        if (editingAddress) {
          await dispatch(updateAddress({ id: editingAddress._id, data: formData })).unwrap();
          toast.success('Address updated successfully!');
        } else {
          await dispatch(createAddress(formData)).unwrap();
          toast.success('Address added successfully!');
        }
        
        // Create full address string for display
        const fullAddress = `${formData.houseFlatNumber}, ${formData.streetAreaName}, ${formData.address}, ${formData.landmark}, ${formData.city} (${formData.pincode})`;
        
        // Also create address object for payment processing
        const addressObject = {
          street: formData.streetAreaName,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          houseFlatNumber: formData.houseFlatNumber,
          completeAddress: formData.address,
          landmark: formData.landmark,
          country: formData.country,
          phone: formData.phone || '+91-0000000000' // Include phone number
        };
        
        if (onAddressUpdate) {
          // Send both string and object for backward compatibility
          onAddressUpdate(fullAddress, addressObject);
        }
        
        setShowAddressForm(false);
        setEditingAddress(null);
        // Reset form
        setFormData({
          houseFlatNumber: "",
          streetAreaName: "",
          address: "",
          landmark: "",
          city: "",
          state: "Bihar",
          country: "India",
          pincode: "",
          addressType: "home",
          isDefault: false
        });
      } catch (error) {
        toast.error(error.message || 'Failed to save address');
      }
    }
  };

  // Handle address selection from saved addresses
  const handleSelectAddress = async (selectedAddressId) => {
    try {
      await dispatch(setDefaultAddress(selectedAddressId)).unwrap();
      toast.success('Default address updated!');
      
      // Find the selected address and update parent component
      const selectedAddr = addresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddr && onAddressUpdate) {
        const fullAddress = formatAddressString(selectedAddr);
        
        // Also create address object for payment processing
        const addressObject = {
          street: selectedAddr.streetAreaName,
          city: selectedAddr.city,
          state: selectedAddr.state,
          pincode: selectedAddr.pincode,
          houseFlatNumber: selectedAddr.houseFlatNumber,
          completeAddress: selectedAddr.completeAddress,
          landmark: selectedAddr.landmark,
          country: selectedAddr.country,
          phone: selectedAddr.phone || '+91-0000000000' // Include phone number
        };
        
        onAddressUpdate(fullAddress, addressObject);
      }
      
      setShowSavedAddresses(false);
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  // Handle different button clicks
  const handleUpdateAddAddress = () => {
    setShowAddressForm(true);
    setShowSavedAddresses(false);
  };

  const handleChangeAddress = () => {
    setShowSavedAddresses(true);
    setShowAddressForm(false);
  };

  // Handle edit address
  const handleEditAddress = (addressToEdit) => {
    // Find the address object from the addresses array
    const addressObj = addresses.find(addr => {
      const fullAddress = formatAddressString(addr);
      return fullAddress === addressToEdit;
    });

    if (addressObj) {
      setEditingAddress(addressObj);
      setFormData({
        houseFlatNumber: addressObj.houseFlatNumber || "",
        streetAreaName: addressObj.streetAreaName || "",
        address: addressObj.completeAddress || "",
        landmark: addressObj.landmark || "",
        city: addressObj.city || "",
        state: addressObj.state || "Bihar",
        country: addressObj.country || "India",
        pincode: addressObj.pincode || "",
        addressType: addressObj.addressType || "home",
        isDefault: addressObj.isDefault || false
      });
      setShowAddressForm(true);
      setShowSavedAddresses(false);
    }
  };

  // Handle edit current address
  const handleEditCurrentAddress = () => {
    const addressToEdit = currentAddress || formatAddressString(defaultAddress);
    
    if (addressToEdit) {
      handleEditAddress(addressToEdit);
    }
  };

  return (
    <>
      {/* Address Section - Fixed dimensions */}
      <div className="w-[509px] h-[66px] pb-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <span className="font-bold text-black text-base">Booking Address:</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpdateAddAddress}
              className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer"
            >
              Update/Add Address
            </button>
            <button
              onClick={handleChangeAddress}
              className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer"
            >
              Change Address
            </button>
          </div>
        </div>
        <div className="mt-2">
          {(currentAddress || defaultAddress) ? (
            <div className="flex items-center justify-between">
              <p className="text-black text-sm flex-1">
                {currentAddress || formatAddressString(defaultAddress)}
              </p>
              <button
                onClick={handleEditCurrentAddress}
                className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer ml-2"
                title="Edit Address"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-12 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No address selected. Please add an address.</p>
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setFormData({
                    houseFlatNumber: "",
                    streetAreaName: "",
                    address: "",
                    landmark: "",
                    city: "",
                    state: "Bihar",
                    country: "India",
                    pincode: "",
                    addressType: "home",
                    isDefault: false
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* House/Flat Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House/Flat Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter House/Flat Number"
                  value={formData.houseFlatNumber}
                  onChange={(e) => handleInputChange("houseFlatNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>

              {/* Street/Area Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street/Area Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Street Name"
                  value={formData.streetAreaName}
                  onChange={(e) => handleInputChange("streetAreaName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>

              {/* Complete Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  placeholder="Enter Your Complete Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>

              {/* Landmark, City, State Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Enter A Landmark"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Your City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                      formData.pincode.length === 6 && detectCityFromPincode(formData.pincode) && formData.city
                        ? "border-[#CC2B52] bg-pink-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="Your State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Pincode and Address Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="Pin Code"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                      formData.pincode.length === 6 && detectCityFromPincode(formData.pincode)
                        ? "border-[#CC2B52]"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    value={formData.addressType}
                    onChange={(e) => handleInputChange("addressType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={addresses.length === 0 || formData.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                  className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                />
                <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-700">
                  Set as default address
                  {addresses.length === 0 && (
                    <span className="text-[#CC2B52] ml-1">(First address will be default)</span>
                  )}
                </label>
              </div>

              {/* Save Address Button */}
              <div className="pt-4">
                <button
                  onClick={handleSaveAddress}
                  disabled={!isFormValid() || isLoading}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                    isFormValid() && !isLoading
                      ? "bg-[#CC2B52] hover:bg-[#CC2B52]/90 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses Modal */}
      {showSavedAddresses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Saved Address</h2>
              <button
                onClick={() => setShowSavedAddresses(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {sortedAddresses.map((savedAddress) => {
                const fullAddress = formatAddressString(savedAddress);
                
                return (
                  <div
                    key={savedAddress._id}
                    className={`border rounded-lg p-4 shadow-sm relative overflow-hidden transition-all duration-300 ${
                      savedAddress.isDefault 
                        ? 'border-[#CC2B52] bg-pink-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Default Badge */}
                    {savedAddress.isDefault && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#CC2B52] text-white text-xs px-2 py-1 rounded-full font-medium">
                          Selected
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <p className="text-sm font-medium text-[#CC2B52] mb-1">Address:</p>
                        <p className={`text-gray-900 ${savedAddress.isDefault ? 'font-medium' : ''}`}>
                          {fullAddress}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAddress(fullAddress)}
                            className="text-blue-500 hover:text-blue-700 text-sm p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Address"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAddress(savedAddress._id)}
                            className="text-red-500 hover:text-red-700 text-sm p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete Address"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {!savedAddress.isDefault && (
                          <button
                            onClick={() => handleSelectAddress(savedAddress._id)}
                            className="bg-[#CC2B52] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#CC2B52]/90 transition-colors font-medium"
                          >
                            Select This Address
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {addresses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No saved addresses found.</p>
                  <button
                    onClick={handleUpdateAddAddress}
                    className="text-[#CC2B52] hover:underline mt-2"
                  >
                    Add your first address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AddressDetail.propTypes = {
  currentAddress: PropTypes.string,
  onAddressUpdate: PropTypes.func,
};

export default AddressDetail;