import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

console.log(import.meta.env.VITE_API_URL);

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ensure compatibility with iOS/macOS Safari
  if (config.url && config.url.includes("/user/getwallet")) {
    config.timeout = 30000; // Extended timeout for wallet operations
  }

  return config;
});

// Add response interceptor to handle platform-specific issues
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Specific handling for Safari/iOS connection issues
    if (
      error.message === "Network Error" ||
      (error.response && error.response.status === 0)
    ) {
      console.error("Connection error - possible Safari/iOS issue");
      // Try to recover by retrying the request
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
