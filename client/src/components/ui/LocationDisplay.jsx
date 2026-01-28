import { useState, useEffect, useCallback } from "react";
import { HiLocationMarker } from "react-icons/hi";

const LocationDisplay = () => {
  const [location, setLocation] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLocation("Location unavailable");
      setIsLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: false, // Changed to false for better browser compatibility
      timeout: 15000, // Increased timeout to 15 seconds for slower connections
      maximumAge: 0, // Always get fresh position to avoid stale data across breakpoints
    };

    console.log("🔍 LocationDisplay: Requesting geolocation...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        console.log("✅ LocationDisplay: Geolocation success", position.coords);
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        // Error callback
        console.error("❌ LocationDisplay: Geolocation error", error);
        handleGeolocationError(error);
      },
      options
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      console.log("🔍 LocationDisplay: Reverse geocoding...", {
        latitude,
        longitude,
      });

      // Using a free reverse geocoding service with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();
      console.log("✅ LocationDisplay: Geocoding success", data);

      if (data.city) {
        setLocation(data.city);
      } else if (data.principalSubdivision) {
        setLocation(data.principalSubdivision);
      } else if (data.locality) {
        setLocation(data.locality);
      } else {
        setLocation("Unknown location");
      }
      setError(null); // Clear any previous errors on success
    } catch (error) {
      console.error("❌ LocationDisplay: Reverse geocoding error:", error);
      if (error.name === "AbortError") {
        setLocation("Location timeout");
        setError("Location timeout");
      } else {
        setLocation("Location unavailable");
        setError("Location unavailable");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocationError = (error) => {
    let errorMessage = "Location unavailable";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timeout";
        break;
      default:
        errorMessage = "Location unavailable";
        break;
    }

    setError(errorMessage);
    setLocation(errorMessage);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
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
