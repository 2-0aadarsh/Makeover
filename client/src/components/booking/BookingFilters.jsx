import React, { useState } from 'react';

const BookingFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      status: 'all',
      dateFrom: null,
      dateTo: null,
      service: '',
      searchQuery: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      localFilters.status !== 'all' ||
      localFilters.dateFrom ||
      localFilters.dateTo ||
      localFilters.service ||
      localFilters.searchQuery
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex space-x-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Service Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service
          </label>
          <select
            value={localFilters.service}
            onChange={(e) => handleFilterChange('service', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">All Services</option>
            <option value="facial">Facial</option>
            <option value="waxing">Waxing</option>
            <option value="massage">Massage</option>
            <option value="manicure">Manicure</option>
            <option value="pedicure">Pedicure</option>
            <option value="hair">Hair</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              handleFilterChange('dateFrom', today.toISOString().split('T')[0]);
              handleFilterChange('dateTo', tomorrow.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date(today);
              nextWeek.setDate(nextWeek.getDate() + 7);
              handleFilterChange('dateFrom', today.toISOString().split('T')[0]);
              handleFilterChange('dateTo', nextWeek.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
          >
            This Week
          </button>
          
          <button
            onClick={() => {
              const today = new Date();
              const nextMonth = new Date(today);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              handleFilterChange('dateFrom', today.toISOString().split('T')[0]);
              handleFilterChange('dateTo', nextMonth.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
          >
            This Month
          </button>
          
          <button
            onClick={() => {
              handleFilterChange('status', 'upcoming');
              const today = new Date();
              handleFilterChange('dateFrom', today.toISOString().split('T')[0]);
              handleFilterChange('dateTo', null);
            }}
            className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors"
          >
            Upcoming
          </button>
          
          <button
            onClick={() => {
              handleFilterChange('status', 'completed');
              const today = new Date();
              handleFilterChange('dateFrom', null);
              handleFilterChange('dateTo', today.toISOString().split('T')[0]);
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
          >
            Past Bookings
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Status: {localFilters.status}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-pink-200"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            
            {localFilters.dateFrom && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                From: {localFilters.dateFrom}
                <button
                  onClick={() => handleFilterChange('dateFrom', null)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            
            {localFilters.dateTo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                To: {localFilters.dateTo}
                <button
                  onClick={() => handleFilterChange('dateTo', null)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            
            {localFilters.service && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Service: {localFilters.service}
                <button
                  onClick={() => handleFilterChange('service', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;
