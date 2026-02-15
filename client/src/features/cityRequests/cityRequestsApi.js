import axios from "axios";
const backendurl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendurl}/api/city-requests`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Submit a city request (public).
 * @param {{ requestedCity: string, requestedState?: string, name: string, email: string, phone: string, message?: string }} payload
 * @returns {Promise<{ data: { success, message, data: { requestId, requestNumber, status } } }>}
 */
export const submitCityRequest = (payload) => api.post("/", payload);

/**
 * Get suggested city/state from IP (for form pre-fill).
 * @returns {Promise<{ data: { success, data: { city?: string, state?: string } } }>}
 */
export const getSuggestedCity = () => api.get("/suggest-city");

export default { submitCityRequest, getSuggestedCity };
