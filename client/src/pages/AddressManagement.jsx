import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../features/address/addressThunks';
import { MapPin, Plus, Edit, Trash2, Star, Home, Building2, Navigation } from 'lucide-react';

const AddressManagement = () => {
  const dispatch = useDispatch();
  const { addresses, isLoading, error } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    houseFlatNumber: '',
    streetAreaName: '',
    address: '', // This will be mapped to completeAddress
    landmark: '',
    city: '',
    state: 'Bihar',
    country: 'India',
    pincode: '',
    phone: '',
    addressType: 'home',
    isDefault: false
  });

  useBodyScrollLock(isLoading);

  // Load addresses on component mount
  useEffect(() => {
    if (user) {
      dispatch(getUserAddresses());
    }
  }, [dispatch, user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ id: editingAddress._id, data: formData })).unwrap();
        toast.success('Address updated successfully!');
      } else {
        await dispatch(createAddress(formData)).unwrap();
        toast.success('Address added successfully!');
      }
      
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        houseFlatNumber: '',
        streetAreaName: '',
        address: '',
        landmark: '',
        city: '',
        state: 'Bihar',
        country: 'India',
        pincode: '',
        phone: '',
        addressType: 'home',
        isDefault: false
      });
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  // Handle edit address
  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      houseFlatNumber: address.houseFlatNumber || '',
      streetAreaName: address.streetAreaName || '',
      address: address.completeAddress || address.address || '', // Map completeAddress to address field
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || 'Bihar',
      country: address.country || 'India',
      pincode: address.pincode || '',
      phone: address.phone || '',
      addressType: address.addressType || 'home',
      isDefault: address.isDefault || false
    });
    setShowForm(true);
  };

  // Handle delete address
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  // Handle set default address
  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      toast.success('Default address updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  // Reset form
  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      houseFlatNumber: '',
      streetAreaName: '',
      address: '',
      landmark: '',
      city: '',
      state: 'Bihar',
      country: 'India',
      pincode: '',
      phone: '',
      addressType: 'home',
      isDefault: false
    });
  };

  // Get address type icon
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'work': return <Building2 className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // Get address type color
  const getAddressTypeColor = (type) => {
    switch (type) {
      case 'home': return 'text-green-600 bg-green-50';
      case 'work': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Addresses</h1>
          <p className="text-gray-600">Save and manage your delivery addresses</p>
        </div>

        {/* Add Address Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-[#CC2B52] text-white px-6 py-3 rounded-lg hover:bg-[#CC2B52]/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Address</span>
            </button>
          </div>
        )}

        {/* Address Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* House/Flat Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House/Flat Number *
                  </label>
                  <input
                    type="text"
                    name="houseFlatNumber"
                    value={formData.houseFlatNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter house/flat number"
                  />
                </div>

                {/* Street/Area Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street/Area Name *
                  </label>
                  <input
                    type="text"
                    name="streetAreaName"
                    value={formData.streetAreaName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter street/area name"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Near landmark (optional)"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                    placeholder="Enter pincode"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData(prev => ({ ...prev, phone: value }));
                      }}
                      required
                      maxLength={10}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {formData.phone.length > 0 && formData.phone.length < 10 && (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter {10 - formData.phone.length} more digit{10 - formData.phone.length > 1 ? 's' : ''}
                    </p>
                  )}
                  {formData.phone.length === 10 && !/^[6-9]\d{9}$/.test(formData.phone) && (
                    <p className="mt-1 text-xs text-red-600">Phone must start with 6, 7, 8, or 9</p>
                  )}
                </div>

                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  >
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#CC2B52] bg-gray-100 border-gray-300 rounded focus:ring-[#CC2B52] focus:ring-2"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#CC2B52] text-white py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {console.log('addresses', addresses)}
          {addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-[#CC2B52]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getAddressTypeColor(address.addressType)}`}>
                        {getAddressTypeIcon(address.addressType)}
                        <span className="capitalize">{address.addressType}</span>
                      </div>
                      {address.isDefault && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-[#CC2B52] text-white rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Default</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{address.name}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 text-sm sm:text-base line-clamp-2">{address.phone}</span>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="text-gray-700">
                          <p>{address.address}</p>
                          {address.completeAddress && (
                            <p className="text-sm sm:text-base line-clamp-2">Near {address.completeAddress}</p>
                          )}
                          <p className="text-sm sm:text-base line-clamp-2" >{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="p-2 text-gray-400 hover:text-[#CC2B52] transition-colors"
                        title="Set as default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit address"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first address to get started with faster bookings</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-[#CC2B52] text-white px-6 py-3 rounded-lg hover:bg-[#CC2B52]/90 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Address</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden overscroll-contain">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-[#CC2B52] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Loading addresses...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManagement;


