import axios from "axios";
import { backendurl } from "../../../constants";

const api = axios.create({
  baseURL: `${backendurl}/api/admin/serviceable-cities`,
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

export const adminServiceableCitiesApi = {
  getAll: (params) => api.get("/", { params }),
  getStats: () => api.get("/stats"),
  /** Create a new serviceable city. Body: { city, state, displayName? } */
  create: (body) => api.post("/", body),
  /** Toggle active/inactive status of a serviceable city */
  toggle: (id) => api.patch(`/${id}/toggle`),
};
