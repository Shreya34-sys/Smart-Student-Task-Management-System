import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("Missing required frontend environment variable: VITE_API_URL");
}

export const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart-task-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("smart-task-token");
      localStorage.removeItem("smart-task-user");
    }
    return Promise.reject(error);
  }
);
