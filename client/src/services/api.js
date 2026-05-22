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
const API_URL = (() => {
  if (!rawApiUrl) return "http://localhost:5000/api";
  if (rawApiUrl.startsWith(":")) {
    return `http://localhost${rawApiUrl}`;
  }
  if (!/^https?:\/\//i.test(rawApiUrl)) {
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

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
