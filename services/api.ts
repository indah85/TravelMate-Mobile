import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL =
  "http://172.20.10.8:5000";
export const WEB_BASE_URL =
  "http://172.20.10.8:5173";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token =
      await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;