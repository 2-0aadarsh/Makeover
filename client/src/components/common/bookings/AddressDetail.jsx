import { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [address, setAddress] = useState({
    houseFlatNumber: "",
    streetAreaName: "",
    completeAddress: "",
    landmark: "",
    pincode: "",
    city: "",
    isDefault: false
  });

  // Start with empty saved addresses - first address added will be default
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load saved addresses from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      try {
        setSavedAddresses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved addresses:', error);
      }
    }
  }, []);

  // Save addresses to localStorage whenever savedAddresses changes
  useEffect(() => {
    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Check if form is valid
  const isFormValid = () => {
    return address.houseFlatNumber.trim() !== "" &&
           address.streetAreaName.trim() !== "" &&
           address.completeAddress.trim() !== "" &&
           address.pincode.trim() !== "";
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-detect city based on pincode
    if (field === "pincode" && value.length === 6) {
      const detectedCity = detectCityFromPincode(value);
      if (detectedCity) {
        setAddress(prev => ({
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
  const handleSaveAddress = () => {
    if (isFormValid()) {
      const fullAddress = `${address.houseFlatNumber}, ${address.streetAreaName}, ${address.completeAddress}, ${address.landmark}, ${address.city} (${address.pincode})`;
      
      // Check if this is the first address - if so, make it default
      const isFirstAddress = savedAddresses.length === 0;
      const shouldBeDefault = isFirstAddress || address.isDefault;
      
      // Add new address to saved addresses
      const newAddress = {
        id: Date.now(),
        address: fullAddress,
        isDefault: shouldBeDefault
      };

      // If this is set as default, remove default from other addresses
      if (shouldBeDefault) {
        setSavedAddresses(prev => 
          prev.map(addr => ({ ...addr, isDefault: false }))
        );
      }

      setSavedAddresses(prev => [...prev, newAddress]);
      
      if (onAddressUpdate) {
        onAddressUpdate(fullAddress);
      }
      
      setShowAddressForm(false);
      // Reset form
      setAddress({
        houseFlatNumber: "",
        streetAreaName: "",
        completeAddress: "",
        landmark: "",
        pincode: "",
        city: "",
        isDefault: false
      });
    }
  };

  // Handle address selection from saved addresses
  const handleSelectAddress = (selectedAddress) => {
    if (onAddressUpdate) {
      onAddressUpdate(selectedAddress);
    }
    setShowSavedAddresses(false);
  };

  // Handle delete address
  const handleDeleteAddress = (addressId) => {
    setSavedAddresses(prev => {
      const updatedAddresses = prev.filter(addr => addr.id !== addressId);
      
      // If we deleted the default address, make the first remaining address default
      if (updatedAddresses.length > 0) {
        const hasDefault = updatedAddresses.some(addr => addr.isDefault);
        if (!hasDefault) {
          updatedAddresses[0].isDefault = true;
        }
      }
      
      return updatedAddresses;
    });
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
    // Parse the address to fill the form
    const addressParts = addressToEdit.split(', ');
    setAddress({
      houseFlatNumber: addressParts[0] || "",
      streetAreaName: addressParts[1] || "",
      completeAddress: addressParts[2] || "",
      landmark: addressParts[3] || "",
      city: addressParts[4]?.split(' (')[0] || "",
      pincode: addressParts[4]?.match(/\((\d+)\)/)?.[1] || "",
      isDefault: false
    });
    setShowAddressForm(true);
    setShowSavedAddresses(false);
  };

  // Handle edit current address
  const handleEditCurrentAddress = () => {
    if (currentAddress) {
      handleEditAddress(currentAddress);
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
          {currentAddress ? (
            <div className="flex items-center justify-between">
              <p className="text-black text-sm flex-1">{currentAddress}</p>
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
              <h2 className="text-xl font-bold text-gray-800">Address Details</h2>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* House/Flat Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House/Flat Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter House/Flat Number"
                  value={address.houseFlatNumber}
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
                  value={address.streetAreaName}
                  onChange={(e) => handleInputChange("streetAreaName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>

              {/* Complete Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complete Address *
                </label>
                <textarea
                  placeholder="Enter Your Complete Address"
                  value={address.completeAddress}
                  onChange={(e) => handleInputChange("completeAddress", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>

              {/* Landmark, Pincode, City Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Enter A Landmark"
                    value={address.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="Pin Code"
                    value={address.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                      address.pincode.length === 6 && detectCityFromPincode(address.pincode)
                        ? "border-[#CC2B52]"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Your City"
                    value={address.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                      address.pincode.length === 6 && detectCityFromPincode(address.pincode) && address.city
                        ? "border-[#CC2B52] bg-pink-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={savedAddresses.length === 0 || address.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                  className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                />
                <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-700">
                  Make this my default address
                  {savedAddresses.length === 0 && (
                    <span className="text-[#CC2B52] ml-1">(First address will be default)</span>
                  )}
                </label>
              </div>

              {/* Save Address Button */}
              <div className="pt-4">
                <button
                  onClick={handleSaveAddress}
                  disabled={!isFormValid()}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                    isFormValid()
                      ? "bg-[#CC2B52] hover:bg-[#CC2B52]/90 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save Address
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
              {savedAddresses.map((savedAddress) => (
                <div
                  key={savedAddress.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative overflow-hidden"
                >
                  {/* Default Tag - Using Default.png image with specific positioning */}
                  {savedAddress.isDefault && (
                    <div className="relative">
                      <img 
                        src="./src/assets/Default.png" 
                        alt="Default" 
                        className="absolute top-2 right-2 w-16 h-6 object-contain"
                        style={{ top: '96px', left: '377px' }}
                        onError={(e) => {
                          console.log('Image failed to load:', e.target.src);
                          // Fallback to simple text
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="absolute top-2 right-2 bg-[#CC2B52] text-white text-xs px-2 py-1 rounded-full hidden">
                        Default
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#CC2B52] mb-1">Address:</p>
                      <p className="text-gray-900">{savedAddress.address}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAddress(savedAddress.address)}
                          className="text-blue-500 hover:text-blue-700 text-sm p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Address"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAddress(savedAddress.id)}
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
                          onClick={() => handleSelectAddress(savedAddress.address)}
                          className="bg-[#CC2B52] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#CC2B52]/90 transition-colors"
                        >
                          Select This Address
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {savedAddresses.length === 0 && (
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
