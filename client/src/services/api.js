export async function fetchJSON(path, opts = {}) {
  const res = await fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}
import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL;
export const API_URL = (() => {
  if (import.meta.env.PROD && !rawApiUrl) return "/api";
  if (!rawApiUrl) return "http://localhost:5000/api";
  if (rawApiUrl.startsWith(":")) {
    return `http://localhost${rawApiUrl}`;
  }
  if (!/^https?:\/\//i.test(rawApiUrl) && !rawApiUrl.startsWith("/")) {
    return `http://${rawApiUrl}`;
  }
  return rawApiUrl;
})();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser set multipart boundary for FormData uploads
  if (config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete("Content-Type");
    } else if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers.common?.["Content-Type"];
    }
  }

  return config;
});

import { showErrorToast } from "../utils/toastEvent";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      window.dispatchEvent(new Event("auth-expired"));
    }

    // Attempt to extract backend error message
    let message = error.response?.data?.message || error.message || "An unexpected error occurred.";
    
    if (error.response?.status === 429) {
      message = "Server is busy. Please try again in a moment.";
    }

    // Dispatch global toast (suppress spam for 429s)
    if (!window._last429Toast || Date.now() - window._last429Toast > 3000 || error.response?.status !== 429) {
      showErrorToast(message);
      if (error.response?.status === 429) {
        window._last429Toast = Date.now();
      }
    }

    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// --- In-flight Request Deduplicator ---
const pendingRequests = new Map();

const generateRequestKey = (method, url, config, data) => {
  return `${method}:${url}:${JSON.stringify(config?.params || {})}:${JSON.stringify(data || {})}`;
};

['get', 'post', 'put', 'delete'].forEach((method) => {
  const originalMethod = api[method];
  api[method] = function (url, ...args) {
    let data, config;
    if (method === 'get' || method === 'delete') {
      config = args[0];
    } else {
      data = args[0];
      config = args[1];
    }

    // Do not deduplicate FormData requests (file uploads)
    if (data instanceof FormData) {
      return originalMethod.apply(this, [url, ...args]);
    }

    const key = generateRequestKey(method, url, config, data);

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const promise = originalMethod.apply(this, [url, ...args]).finally(() => {
      pendingRequests.delete(key);
    });

    pendingRequests.set(key, promise);
    return promise;
  };
});

export default api;
