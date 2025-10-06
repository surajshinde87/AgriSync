import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Single, unified request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(" No token found in localStorage for request:", config.url);
    }

    // Let Axios handle Content-Type automatically for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message || "";

    // Only logout if backend confirms invalid/expired token
    if (
      (status === 401 || status === 403) &&
      (backendMessage.includes("Invalid token") ||
        backendMessage.includes("expired") ||
        backendMessage.includes("Unauthorized"))
    ) {
      toast.error("Session expired, please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } 
    // Other 403 or 500 errors — just show toast, no redirect
    else if (status === 403) {
      toast.error(backendMessage || "Access denied.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject({
      ...error,
      payload: error.response?.data || { message: "Network error" },
      status,
    });
  }
);


export default axiosInstance;
