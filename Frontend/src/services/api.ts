import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// REQUEST INTERCEPTOR (Attach Token)
api.interceptors.request.use(
  (config) => {
      const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  RESPONSE INTERCEPTOR (Handle Errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout if token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;