import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5078",
});

function extractApiMessage(error: any): string | null {
  const data = error?.response?.data;
  const errors = data?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstMsg = errors?.[firstKey]?.[0];
    if (typeof firstMsg === "string" && firstMsg.trim()) return firstMsg;
  }
  
  if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
  if (typeof data?.title === "string" && data.title.trim()) return data.title;

  return null;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    const msg = extractApiMessage(error);
    if (msg) {
      error.userMessage = msg;
    }

    return Promise.reject(error);
  }
);
