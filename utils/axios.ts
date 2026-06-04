import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(true);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * ONLY refresh on specific endpoints failure
     * NOT every 401 in system
     */
    const shouldRefresh =
      status === 401 &&
      !url?.includes("/auth/login") &&
      !url?.includes("/auth/signup") &&
      !url?.includes("/auth/refresh-token");

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      /**
       * Refresh WITHOUT relying on refresh cookie
       * Backend should use DB session or access token decode
       */
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      processQueue(null);

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      // HARD LOGOUT
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;