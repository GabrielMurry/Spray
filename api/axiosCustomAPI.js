import axios from "axios";
import { BASE_URL } from "@env";
import refreshTokenService from "./refreshTokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosCustomAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    patch: {
      "Content-Type": "application/json",
    },
    post: {
      "Content-Type": "application/json",
    },
    put: {
      "Content-Type": "application/json",
    },
  },
});

// INTERCEPTOR - for expired access token
// Setting up the interceptor in the same file ensures it's applied to every instance of axiosCustomAPI imported
axiosCustomAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for expiration condition (401 status code)
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log(
        "401 error! Access token expired. Retrieving new access token..."
      );
      originalRequest._retry = true; // mark the request that is a retry
      try {
        const { accessToken, refreshToken } = await refreshTokenService(); // This service handles the token refresh logic
        if (accessToken && refreshToken) {
          // Store tokens in AsyncStorage (access token is new. Refresh token stays the same as previous)
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("refreshToken", refreshToken);

          // Update the token on the original request and resend it
          axiosCustomAPI.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosCustomAPI(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh access token", refreshError);
        // Redirect to login
      }
    }
    // Return error if retry fails
    return Promise.reject(error);
  }
);

export default axiosCustomAPI;
