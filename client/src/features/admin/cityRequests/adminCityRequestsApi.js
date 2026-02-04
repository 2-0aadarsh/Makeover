import axios from "axios";
const backendurl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendurl}/api/admin/city-requests`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r.data,
  (err) => {
    if (err.response?.status === 401) window.location.href = "/auth/login";
    if (err.response?.status === 403) window.location.href = "/";
    return Promise.reject(err.response?.data?.message || err.message);
  }
);

export const adminCityRequestsApi = {
  getAll: (params) => api.get("/", { params }),
  getAnalytics: () => api.get("/analytics"),
  updateStatus: (id, payload) => api.patch(`/${id}/status`, payload),
  /** Add the requested city to serviceable cities. Body: { coveragePincodes: string[] } (required) */
  addToServiceable: (id, body) => api.post(`/${id}/add-to-serviceable`, body),
};
