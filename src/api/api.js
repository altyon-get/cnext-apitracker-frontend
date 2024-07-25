import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const getToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login?message=Session expired, please login again.";
    }
    return Promise.reject(error);
  }
);

export default api;
