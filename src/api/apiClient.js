import { authService } from "../auth/authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
  const token = authService.getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // 🔥 REQUIRED for refresh cookie
  });

  // 🔁 Try refresh once
  if (response.status === 401) {
    const refresh = await authService.refresh();

    if (refresh.success) {
      return request(endpoint, options);
    }

    authService.logout();
    window.location.href = "/login";
    return;
  }

  return response.json();
}

export default {
  get: (url) => request(url, { method: "GET" }),
  post: (url, body) =>
    request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url, body) =>
    request(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: "DELETE" }),
};
