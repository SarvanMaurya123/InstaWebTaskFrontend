import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🔥 REQUIRED for cookie auth
});

/**
 * -----------------------
 * REQUEST INTERCEPTOR
 * -----------------------
 * Keep minimal (avoid breaking cookies)
 */
api.interceptors.request.use(
  (config) => {
    // DO NOT overwrite headers
    if (!config.headers) {
      config.headers = {} as any;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -----------------------
 * REFRESH STATE CONTROL
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

    // 🔥 IMPORTANT: handle ALL 401 errors
    const isAuthError = status === 401;

    if (!isAuthError) {
      return Promise.reject(error);
    }

    // prevent infinite retry loop
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
       * 🔥 Refresh token request (bypass interceptor risk)
       */
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      processQueue(null);

      // retry original request
      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      // logout fallback
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