import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach JWT token automatically to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("novastore_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
