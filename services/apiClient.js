import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Axios instance
const userApi = axios.create();

// Set base URL and authorization headers before each request
userApi.interceptors.request.use(async (config) => {
  config.baseURL = await AsyncStorage.getItem("baseUrl");

  if (config.url !== "method/frappe.integrations.oauth2.get_token") {
    const access_token = await AsyncStorage.getItem("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }

  return config;
}, Promise.reject);

// Handle API errors, including token refresh logic
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);

    const { status } = error.response;
    const originalRequest = error.config;

    if ([400, 403, 401].includes(status) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return userApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;
