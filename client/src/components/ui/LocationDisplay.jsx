import { useState, useEffect, useCallback } from "react";
import { HiLocationMarker } from "react-icons/hi";

const IPINFO_TOKEN = "3dd1e902544872";
const CACHE_KEY = "user_location_cache_v2"; // v2 = only cache when from browser (ignore old IP cache)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const GEOLOCATION_TIMEOUT = 5000; // Try browser location for 5s, then fallback to IP

const LocationDisplay = () => {
  const [location, setLocation] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveAndShowCity = useCallback((cityName, shouldCache = true) => {
    const display = cityName || "Unknown location";
    setLocation(display);
    setError(null);
    if (shouldCache) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ city: display, timestamp: Date.now() })
      );
    }
  }, []);

  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Geocode failed");
      const data = await response.json();
      const cityName = data.city || data.principalSubdivision || data.locality;
      return cityName || null;
    } catch {
      return null;
    }
  }, []);

  const fetchLocationFromIP = useCallback(async () => {
    const response = await fetch(
      `https://ipinfo.io/json?token=${IPINFO_TOKEN}`
    );
    if (!response.ok) throw new Error("IPinfo failed");
    const data = await response.json();
    return data.city || data.region || null;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { city, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION && city) {
          setLocation(city);
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Step 1: Try browser geolocation first (accurate when user allows)
      if (navigator.geolocation) {
        const cityFromBrowser = await new Promise((resolve) => {
          const timeoutId = setTimeout(() => resolve(null), GEOLOCATION_TIMEOUT);
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              clearTimeout(timeoutId);
              const { latitude, longitude } = position.coords;
              const city = await reverseGeocode(latitude, longitude);
              resolve(city);
            },
            () => {
              clearTimeout(timeoutId);
              resolve(null);
            },
            { enableHighAccuracy: false, timeout: GEOLOCATION_TIMEOUT, maximumAge: 60000 }
          );
        });

        if (cityFromBrowser) {
          saveAndShowCity(cityFromBrowser, true); // cache only accurate (browser) result
          setIsLoading(false);
          return;
        }
      }

      // Step 2: Fallback to IP-based (no permission / timeout / denied)
      const cityFromIP = await fetchLocationFromIP();
      saveAndShowCity(cityFromIP, false); // don't cache IP result — refresh will try browser again
    } catch (err) {
      setLocation("Location unavailable");
      setError("Location unavailable");
    } finally {
      setIsLoading(false);
    }
  }, [reverseGeocode, fetchLocationFromIP, saveAndShowCity]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    localStorage.removeItem(CACHE_KEY);
    getCurrentLocation();
  };

  return (
    <div className="flex items-center gap-1 md:gap-2 max-w-[120px] sm:max-w-[200px] overflow-hidden shrink pr-1">
      {/* Location Pin Icon */}
      <HiLocationMarker className="text-[#CC2B52] flex-shrink-0" size={14} />

      {/* Location Text */}
      <span className="text-[#CC2B52] font-inter font-bold text-xs md:text-sm truncate">
        {isLoading ? "Loading..." : location}
      </span>

      {/* Retry button for errors */}
      {error && !isLoading && (
        <button
          onClick={handleRetry}
          className="ml-1 text-[#CC2B52] hover:text-[#B02547] transition-colors flex-shrink-0"
          aria-label="Retry location"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default LocationDisplay;
