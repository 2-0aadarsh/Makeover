import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../features/address/addressThunks";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
};

const normalizeAddressString = (addressString = "") =>
  addressString.replace(/\|\s*Phone:.*$/, "").trim();

const formatAddressString = (address) => {
  if (!address) return "";
  const phoneFormatted = address.phone
    ? ` | Phone: ${formatPhoneNumber(address.phone)}`
    : "";
  return `${address.houseFlatNumber}, ${address.streetAreaName}, ${address.completeAddress}, ${address.landmark}, ${address.city} (${address.pincode})${phoneFormatted}`;
};

const mapAddressForParent = (address) => {
  if (!address) return null;
  return {
    street: address.streetAreaName,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    houseFlatNumber: address.houseFlatNumber,
    completeAddress: address.completeAddress || address.address,
    landmark: address.landmark,
    country: address.country,
    phone: address.phone,
    addressType: address.addressType,
    _id: address._id,
  };
};

/**
 * AddressDetail Component
 *
 * Displays the booking address section with update/add and change address functionality
 * Includes a modal form for address management
 */
const AddressDetail = ({ currentAddress = "", onAddressUpdate = null }) => {
  const dispatch = useDispatch();
  const { addresses, isLoading, error, defaultAddress } = useSelector(
    (state) => state.address
  );
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
    phone: "",
    addressType: "home",
    isDefault: false,
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressPendingDelete, setAddressPendingDelete] = useState(null);
  useBodyScrollLock(
    showAddressForm || showSavedAddresses || Boolean(addressPendingDelete)
  );

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
      const addressObject = mapAddressForParent(defaultAddress);
      onAddressUpdate(fullAddress, addressObject);
      setSelectedAddressId(defaultAddress._id);
    }
  }, [addresses, defaultAddress, currentAddress, onAddressUpdate]);

  useEffect(() => {
    if (currentAddress && addresses.length > 0) {
      const normalizedCurrent = normalizeAddressString(currentAddress);
      const matched = addresses.find(
        (addr) =>
          normalizeAddressString(formatAddressString(addr)) ===
          normalizedCurrent
      );
      if (matched) {
        setSelectedAddressId(matched._id);
      }
    }
  }, [currentAddress, addresses]);

  // Sort addresses so default is always first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  // Validation helper for phone number
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.houseFlatNumber.trim() !== "" &&
      formData.streetAreaName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.pincode.trim() !== "" &&
      formData.phone.trim() !== "" &&
      isValidPhoneNumber(formData.phone)
    );
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-detect city based on pincode
    if (field === "pincode" && value.length === 6) {
      const detectedCity = detectCityFromPincode(value);
      if (detectedCity) {
        setFormData((prev) => ({
          ...prev,
          city: detectedCity,
        }));
      }
    }
  };

  // Function to detect city from pincode (sample data)
  const detectCityFromPincode = (pincode) => {
    const pincodeCityMap = {
      823001: "Gaya",
      110001: "New Delhi",
      400001: "Mumbai",
      560001: "Bangalore",
      600001: "Chennai",
      700001: "Kolkata",
      380001: "Ahmedabad",
      302001: "Jaipur",
      500001: "Hyderabad",
      411001: "Pune",
      800001: "Patna",
      751001: "Bhubaneswar",
      440001: "Nagpur",
      641001: "Coimbatore",
      695001: "Thiruvananthapuram",
    };

    return pincodeCityMap[pincode] || null;
  };

  // Handle form submission
  const handleSaveAddress = async () => {
    if (!isFormValid()) return;

    try {
      let savedAddressResponse;
      if (editingAddress) {
        savedAddressResponse = await dispatch(
          updateAddress({ id: editingAddress._id, data: formData })
        ).unwrap();
        toast.success("Address updated successfully!");
      } else {
        savedAddressResponse = await dispatch(createAddress(formData)).unwrap();
        toast.success("Address added successfully!");
      }

      const savedAddress =
        savedAddressResponse?.data?.address ||
        (editingAddress
          ? {
              ...editingAddress,
              houseFlatNumber: formData.houseFlatNumber,
              streetAreaName: formData.streetAreaName,
              completeAddress: formData.address,
              landmark: formData.landmark,
              city: formData.city,
              state: formData.state,
              country: formData.country,
              pincode: formData.pincode,
              phone: formData.phone,
              addressType: formData.addressType,
              isDefault: formData.isDefault,
            }
          : null);

      if (savedAddress) {
        const fullAddress = formatAddressString(savedAddress);
        const addressObject = mapAddressForParent(savedAddress) || {
          street: formData.streetAreaName,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          houseFlatNumber: formData.houseFlatNumber,
          completeAddress: formData.address,
          landmark: formData.landmark,
          country: formData.country,
          phone: formData.phone,
          addressType: formData.addressType,
        };

        setSelectedAddressId(savedAddress._id || editingAddress?._id || null);

        if (onAddressUpdate) {
          onAddressUpdate(fullAddress, addressObject);
        }
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
        phone: "",
        addressType: "home",
        isDefault: false,
      });
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    }
  };

  // Handle address selection from saved addresses
  const handleSelectAddress = async (selectedAddressId) => {
    try {
      await dispatch(setDefaultAddress(selectedAddressId)).unwrap();
      toast.success("Default address updated!");

      // Find the selected address and update parent component
      const selectedAddr = addresses.find(
        (addr) => addr._id === selectedAddressId
      );
      if (selectedAddr && onAddressUpdate) {
        const fullAddress = formatAddressString(selectedAddr);

        // Also create address object for payment processing
        const addressObject = mapAddressForParent(selectedAddr);

        onAddressUpdate(fullAddress, addressObject);
      }

      setSelectedAddressId(selectedAddressId);
      setShowSavedAddresses(false);
    } catch (error) {
      toast.error(error.message || "Failed to set default address");
    }
  };

  // Handle delete address
  const handleDeleteAddress = async () => {
    if (!addressPendingDelete) return;
    try {
      await dispatch(deleteAddress(addressPendingDelete._id)).unwrap();
      toast.success("Address deleted successfully!");
      if (addressPendingDelete._id === selectedAddressId) {
        setSelectedAddressId(null);
      }
      setAddressPendingDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
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
    const addressObj =
      typeof addressToEdit === "string"
        ? addresses.find(
            (addr) =>
              normalizeAddressString(formatAddressString(addr)) ===
              normalizeAddressString(addressToEdit)
          )
        : addressToEdit;

    if (!addressObj) return;

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
      phone: addressObj.phone || "",
      addressType: addressObj.addressType || "home",
      isDefault: addressObj.isDefault || false,
    });
    setShowAddressForm(true);
    setShowSavedAddresses(false);
  };

  // Handle edit current address
  const handleEditCurrentAddress = () => {
    let addressObj = null;

    if (selectedAddressId) {
      addressObj = addresses.find((addr) => addr._id === selectedAddressId);
    }

    if (!addressObj) {
      const addressToEdit =
        currentAddress || formatAddressString(defaultAddress);
      if (addressToEdit) {
        addressObj = addresses.find(
          (addr) =>
            normalizeAddressString(formatAddressString(addr)) ===
            normalizeAddressString(addressToEdit)
        );
      }
    }

    if (addressObj) {
      handleEditAddress(addressObj);
    } else {
      toast.error(
        "Unable to find current address details. Please use Change Address."
      );
    }
  };

  return (
    <>
      {/* Address Section - Responsive Design */}
      <div className="w-full pb-4 border-b border-gray-200">
        {/* Header Row - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex items-center">
            <span className="font-bold text-black text-base sm:text-lg">
              Booking Address:
            </span>
          </div>

          {/* Action Buttons - Wrap on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={handleUpdateAddAddress}
              className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer px-2 py-1 rounded hover:bg-pink-50 transition-colors"
            >
              Update/Add Address
            </button>
            <button
              onClick={handleChangeAddress}
              className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer px-2 py-1 rounded hover:bg-pink-50 transition-colors"
            >
              Change Address
            </button>
          </div>
        </div>

        {/* Address Display - Stack on mobile */}
        <div className="mt-2">
          {currentAddress || defaultAddress ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-black text-sm sm:text-base flex-1 break-words">
                {currentAddress || formatAddressString(defaultAddress)}
              </p>
              <button
                onClick={handleEditCurrentAddress}
                className="text-[#CC2B52] text-sm font-medium hover:underline cursor-pointer px-3 py-2 bg-white rounded-lg border border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white transition-all duration-200 flex-shrink-0 self-start sm:self-auto"
                title="Edit Address"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[60px]">
              <p className="text-gray-500 text-sm text-center">
                No address selected. Please add an address.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal - Responsive */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden overscroll-contain">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingAddress ? "Edit Address" : "Add New Address"}
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
                    phone: "",
                    addressType: "home",
                    isDefault: false,
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl p-1"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
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
                    onChange={(e) =>
                      handleInputChange("houseFlatNumber", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("streetAreaName", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent resize-none"
                  />
                </div>

                {/* Landmark, City, State Row - Stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Enter A Landmark"
                      value={formData.landmark}
                      onChange={(e) =>
                        handleInputChange("landmark", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                        formData.pincode.length === 6 &&
                        detectCityFromPincode(formData.pincode) &&
                        formData.city
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
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Pincode and Address Type Row - Stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      placeholder="Pin Code"
                      value={formData.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                        formData.pincode.length === 6 &&
                        detectCityFromPincode(formData.pincode)
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
                      onChange={(e) =>
                        handleInputChange("addressType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    >
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                        if (value.length <= 10) {
                          handleInputChange("phone", value);
                        }
                      }}
                      maxLength={10}
                      className={`w-full pl-12 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent ${
                        formData.phone.length === 10 &&
                        isValidPhoneNumber(formData.phone)
                          ? "border-[#CC2B52] bg-green-50"
                          : formData.phone.length > 0 &&
                            !isValidPhoneNumber(formData.phone)
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formData.phone.length > 0 &&
                    !isValidPhoneNumber(formData.phone) && (
                      <p className="mt-1 text-xs text-red-600">
                        {formData.phone.length < 10
                          ? `Please enter ${
                              10 - formData.phone.length
                            } more digit${
                              10 - formData.phone.length > 1 ? "s" : ""
                            }`
                          : "Phone number must start with 6, 7, 8, or 9"}
                      </p>
                    )}
                  {formData.phone.length === 10 &&
                    isValidPhoneNumber(formData.phone) && (
                      <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Valid phone number
                      </p>
                    )}
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="defaultAddress"
                    checked={addresses.length === 0 || formData.isDefault}
                    onChange={(e) =>
                      handleInputChange("isDefault", e.target.checked)
                    }
                    className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                  />
                  <label
                    htmlFor="defaultAddress"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Set as default address
                    {addresses.length === 0 && (
                      <span className="text-[#CC2B52] ml-1 text-xs">
                        (First address will be default)
                      </span>
                    )}
                  </label>
                </div>

                {/* Save Address Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveAddress}
                    disabled={!isFormValid() || isLoading}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                      isFormValid() && !isLoading
                        ? "bg-[#CC2B52] hover:bg-[#CC2B52]/90 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading
                      ? "Saving..."
                      : editingAddress
                      ? "Update Address"
                      : "Save Address"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses Modal - Responsive */}
      {showSavedAddresses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden overscroll-contain">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Saved Address
              </h2>
              <button
                onClick={() => setShowSavedAddresses(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl p-1"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {sortedAddresses.map((savedAddress) => {
                const fullAddress = formatAddressString(savedAddress);

                return (
                  <div
                    key={savedAddress._id}
                    className={`border rounded-lg p-4 relative overflow-hidden transition-all duration-300 ${
                      savedAddress.isDefault
                        ? "border-[#CC2B52] bg-pink-50"
                        : "border-gray-200 bg-white"
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

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#CC2B52] mb-1">
                          Address:
                        </p>
                        <p
                          className={`text-gray-900 text-sm ${
                            savedAddress.isDefault ? "font-medium" : ""
                          } break-words`}
                        >
                          {fullAddress}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => handleEditAddress(savedAddress)}
                            className="text-blue-500 hover:text-blue-700 text-sm p-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                            title="Edit Address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              setAddressPendingDelete(savedAddress)
                            }
                            className="text-red-500 hover:text-red-700 text-sm p-2 hover:bg-red-50 rounded transition-colors border border-red-200"
                            title="Delete Address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        {!savedAddress.isDefault && (
                          <button
                            onClick={() =>
                              handleSelectAddress(savedAddress._id)
                            }
                            className="bg-[#CC2B52] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#CC2B52]/90 transition-colors font-medium self-start sm:self-auto"
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
                  <p className="mb-2">No saved addresses found.</p>
                  <button
                    onClick={handleUpdateAddAddress}
                    className="text-[#CC2B52] hover:underline font-medium"
                  >
                    Add your first address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {addressPendingDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 overflow-hidden overscroll-contain">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#CC2B52] to-[#A91D3A] p-5 text-white">
              <h3 className="text-lg font-semibold">Delete Address</h3>
              <p className="text-sm text-white/80 mt-1">
                This action cannot be undone. Are you sure you want to delete
                this address?
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                {formatAddressString(addressPendingDelete)}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setAddressPendingDelete(null)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAddress}
                  className="flex-1 bg-[#CC2B52] text-white py-2.5 rounded-lg font-semibold hover:bg-[#A91D3A] transition-colors"
                >
                  Delete
                </button>
              </div>
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
