import apiClient from "../api/apiClient";

const ACCESS_TOKEN_KEY = "access_token";

export const authService = {
  async register(credentials) {
    const res = await apiClient.post("register", credentials);

    if (res.success && res.data?.success) {
      window.location.href = "/login";
    }

    return res;
  },

  async login(credentials) {
    const res = await apiClient.post("login", credentials);

    if (res.success && res.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
    }

    return res;
  },

  async refresh() {
    const res = await apiClient.post("refresh");

    if (res.success && res.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
    }

    return res;
  },

  async logout() {
    try {
      var res = await apiClient.post("logout");

      if (res.success) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } finally {
      window.location.href = "/login";
    }
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },
};
