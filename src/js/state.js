export const state = {
  user: null,
  token: sessionStorage.getItem("auth_token") || null,

  setUser(userData) {
    this.user = userData;
  },

  setToken(token) {
    this.token = token;
    // localStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_token", token);
  },

  clearAuth() {
    this.user = null;
    this.token = null;
    sessionStorage.removeItem("auth_token");
  },

  isAuthenticated() {
    return !!this.token;
  },
};
