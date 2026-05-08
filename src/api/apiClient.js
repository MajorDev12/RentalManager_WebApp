import { authService } from "../auth/authService";
import { navigateTo } from "../helpers/navigation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}, retry = true) {
  const token = authService.getAccessToken();
  const isRefreshEndpoint = endpoint.includes("refresh");

  // ✅ HANDLE QUERY PARAMS
  let url = `${API_BASE_URL}/${endpoint}`;

  if (options.params) {
    const queryString = new URLSearchParams(
      Object.entries(options.params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }

        return acc;
      }, {}),
    ).toString();

    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    if (isRefreshEndpoint) {
      authService.logout();
      throw new Error("Unauthorized");
    }

    if (retry) {
      const refresh = await authService.refresh();

      if (refresh?.success) {
        return request(endpoint, options, false);
      }
    }

    authService.logout();
    throw new Error("Session expired");
  }

  if (response.status === 402) {
    navigateTo("/402");
    throw new Error("Subscription required");
  }

  const data = await response.json();

  return data;
}

export default {
  get: (url, params = {}) =>
    request(url, {
      method: "GET",
      params,
    }),

  post: (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};
