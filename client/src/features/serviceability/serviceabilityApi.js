const backendurl = import.meta.env.VITE_BACKEND_URL;

/**
 * Serviceability API
 * 
 * Public endpoints for city serviceability
 */

/**
 * Get all serviceable cities
 * @returns {Promise<Object>} Response with cities list
 */
export const getServiceableCities = async () => {
  console.log('backendurl', backendurl);
  try {
    console.log('📡 [Serviceability API] Fetching serviceable cities...');
    
    const response = await fetch(`${backendurl}/api/bookings/serviceable-cities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ [Serviceability API] Cities fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ [Serviceability API] Error fetching cities:', error);
    throw error;
  }
};

/**
 * Check if a city is serviceable
 * @param {string} city - City name to check
 * @returns {Promise<Object>} Response with serviceability status
 */
export const checkCityServiceability = async (city) => {
  try {
    console.log('📡 [Serviceability API] Checking city:', city);
    
    const response = await fetch(`${backendurl}/api/bookings/check-serviceability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ [Serviceability API] City check complete: ${city} - ${data.data.isServiceable ? 'Serviceable' : 'Not Serviceable'}`);
    return data;
  } catch (error) {
    console.error('❌ [Serviceability API] Error checking city:', error);
    throw error;
  }
};

/**
 * Check if both city and pincode are serviceable
 * @param {string} city - City name to check
 * @param {string} pincode - Pincode to check
 * @returns {Promise<Object>} Response with location serviceability status
 */
export const checkLocationServiceability = async (city, pincode) => {
  try {
    console.log('📡 [Serviceability API] Checking location:', { city, pincode });
    
    const response = await fetch(`${backendurl}/api/bookings/check-location-serviceability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, pincode }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ [Serviceability API] Location check complete: ${city} (${pincode}) - ${data.data.isServiceable ? 'Serviceable' : 'Not Serviceable'}`);
    return data;
  } catch (error) {
    console.error('❌ [Serviceability API] Error checking location:', error);
    throw error;
  }
};

export default {
  getServiceableCities,
  checkCityServiceability,
  checkLocationServiceability
};



