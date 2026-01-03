import apiClient from "../api/apiClient";

const ACCESS_TOKEN_KEY = "access_token";

export const authService = {
  async login(credentials) {
    const res = await apiClient.post("login", credentials);

    if (res.success && res.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
      window.location.href = "/";
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

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },
};
