import axios from "axios";
import { jwtDecode } from "jwt-decode";
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");

    if (token) {
      const payload = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      console.log(now);
      if (
        payload?.exp &&
        payload.exp - now < 60 &&
        localStorage.getItem("refresh_token")
      ) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("refresh_token");
            const res = await axios.post(
              import.meta.env.VITE_APP_BACKEND_URL +
                "/auth/refresh-token?refreshToken=" +
                refreshToken
            );
            console.log(res);

            const newAccessToken = res.data.access_token;
            localStorage.setItem("access_token", newAccessToken);
            token = newAccessToken;
            config.headers.Authorization = "Bearer " + newAccessToken;
            processQueue(null, newAccessToken);
          } catch (err) {
            processQueue(err, null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/";
            throw err;
          } finally {
            isRefreshing = false;
          }
        } else {
          // Nếu đang refresh => đợi
          await new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                config.headers.Authorization = "Bearer " + token;
                resolve();
              },
              reject: (err) => reject(err),
            });
          });
        }
      }

      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await api.post(
          `/auth/refresh-token?refreshToken=${refreshToken}`
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);
        api.defaults.headers.Authorization = "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
