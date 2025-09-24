import axios from "axios";
// import { config } from "./envConfig";
import { AxiosErrorResponse } from "../interfaces/axios.interface";
import { toast } from "react-toastify";

// const { baseURL } = config.server;

export const authAxios = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const unauthAxios = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Unauthorized");
    }
    if (error.response && error.response.status === 403) {
      toast.error("Forbidden");
    }
    return Promise.reject(error);
  }
);

unauthAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosErrorResponse) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
