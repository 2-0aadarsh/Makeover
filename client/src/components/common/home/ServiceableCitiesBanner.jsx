import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectServiceableCities,
  selectCitiesLoading,
  selectCitiesError,
  selectIsCacheValid,
} from "../../../features/serviceability/serviceabilitySlice";
import { fetchServiceableCities } from "../../../features/serviceability/serviceabilityThunks";

/**
 * Minimal ServiceableCitiesBanner Component
 *
 * Clean, simple banner showing service availability
 * - Minimal design that doesn't overwhelm
 * - Maintains brand identity subtly
 * - Clear information hierarchy
 * - Professional and elegant
 */
const ServiceableCitiesBanner = () => {
  const dispatch = useDispatch();

  const cities = useSelector(selectServiceableCities);
  const loading = useSelector(selectCitiesLoading);
  const error = useSelector(selectCitiesError);
  const isCacheValid = useSelector(selectIsCacheValid);

  // Fetch cities on mount if cache is invalid
  useEffect(() => {
    if (!isCacheValid && !loading) {
      console.log(
        "🌍 [ServiceableCitiesBanner] Fetching serviceable cities..."
      );
      dispatch(fetchServiceableCities());
    }
  }, [dispatch, isCacheValid, loading]);

  // Don't render if there's an error or no cities
  if (error || cities.length === 0) {
    return null;
  }

  // Simple loading state
  if (loading) {
    return (
      <div className="w-full bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#CC2B52] border-t-transparent"></div>
            <p className="text-sm">Loading service areas...</p>
          </div>
        </div>
      </div>
    );
  }

  // Simple city formatting
  const getCityDisplay = () => {
    if (cities.length === 1) {
      return cities[0].city;
    }

    if (cities.length === 2) {
      return `${cities[0].city} and ${cities[1].city}`;
    }

    const cityNames = cities.map((c) => c.city);
    const lastCity = cityNames.pop();
    return `${cityNames.join(", ")} and ${lastCity}`;
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
          {/* Simple Location Icon */}
          <div className="flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#CC2B52]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Clean Text Content */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <span className="text-gray-600 text-sm font-medium">
              Now serving in
            </span>
            <span className="text-[#CC2B52] text-sm font-semibold">
              {getCityDisplay()}
            </span>
            <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
              {cities.length} {cities.length === 1 ? "city" : "cities"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceableCitiesBanner;
