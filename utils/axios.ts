import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/**
 * -----------------------
 * REQUEST INTERCEPTOR
 * -----------------------
 * (optional - kept clean for future use)
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
 * REFRESH HANDLING STATE
 * -----------------------
 */
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(true);
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

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;

    /**
     * Only handle token expiry case
     */
    const isTokenExpired =
      status === 401 && code === "TOKEN_EXPIRED";

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

    /**
     * Prevent infinite retry loop
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * Queue requests while refresh is happening
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
       * Backend should set new cookies here
       */
      await api.post("/auth/refresh-token");

      processQueue(null);

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      /**
       * If refresh fails → force logout
       */
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