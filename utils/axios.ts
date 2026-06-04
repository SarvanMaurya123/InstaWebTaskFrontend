import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * -----------------------
 * REQUEST INTERCEPTOR
 * -----------------------
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {} as any;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -----------------------
 * REFRESH STATE
 * -----------------------
 */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });

  failedQueue = [];
};

/**
 * -----------------------
 * RESPONSE INTERCEPTOR
 * -----------------------
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const code = error.response?.data?.code;

    /**
     * ❌ Only handle TOKEN_EXPIRED
     * DO NOT refresh on every 401
     */
    if (!(status === 401 && code === "TOKEN_EXPIRED")) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * If refresh already running → queue request
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      /**
       * Refresh token (cookie-based)
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