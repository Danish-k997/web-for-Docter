import axios, { AxiosError } from "axios";

const rawURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const baseURL = `${rawURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// ✅ REQUEST interceptor — har request se pehle token attach karta hai
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ RESPONSE interceptor — 401 aane par refresh karta hai
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url === "/auth/refresh-token";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      accessToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .get("/auth/refresh-token")
          .then((res) => {
            const newAccessToken = res.data?.accessToken;
            setAccessToken(newAccessToken);
            processQueue(null, newAccessToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            handleGlobalLogout();
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

const handleGlobalLogout = () => {
  window.location.href = "/login";
};

export default api;