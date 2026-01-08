import { authService } from "../auth/authService";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}, retry = true) {
  const token = authService.getAccessToken();
  const isRefreshEndpoint = endpoint.includes("refresh");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {

    if (isRefreshEndpoint) {
      authService.logout();
      // window.location.href = "/login";
      return;
    }

    // Try refresh once
    if (retry) {
      const refresh = await authService.refresh();

      if (refresh?.success) {
        return request(endpoint, options, false);
      }
    }

    authService.logout();
    // window.location.href = "/login";
    return;
  }

  if (response.status === 500) {
    console.error("Server error");
    toast.error("Server Error!!!");
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
