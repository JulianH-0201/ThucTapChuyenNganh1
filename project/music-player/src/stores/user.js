import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUserName: null,
    login: false,
  }),

  actions: {
    /**
     * IMPORTANT: Token-only initialization
     * - We rely on `localStorage.token` (JWT) to extract the username on startup.
     * - We DO NOT persist a separate `user` key in localStorage anymore to avoid
     *   duplication and drift between token and stored username.
     * - If the token is not a JWT or doesn't include username/name/email claim,
     *   the user will not be restored automatically. For robust verification,
     *   call a server `/me` endpoint instead.
     */
    // Initialize user from token only (no local 'user' cached value)
    initializeUser() {
      // Try extracting user info from saved JWT token (quick client-side decode)
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          // pad base64 string
          payload += "=".repeat((4 - (payload.length % 4)) % 4);
          const decoded = JSON.parse(atob(payload));
          const name = decoded.username || decoded.name || decoded.email;
          if (name) {
            this.currentUserName = name;
            this.login = true;
          }
        }
      } catch (err) {
        // ignore decode errors
        // leave user not initialized
      }
    },

    userLogin() {
      if (this.login === false) {
        this.login = true;
      }
    },

    /**
     * Logout helper
     * - Clears the store and removes the auth token only.
     * - We intentionally do NOT remove a separate `user` key because we no longer store it.
     */
    userLogout() {
      this.login = false;
      this.currentUserName = null;
      // Only token is persisted now
      localStorage.removeItem("token");
    },

    /**
     * Set current user in store
     * - NOTE: This no longer writes the username to localStorage; token is the source of truth.
     * - Call this after storing the `token` on successful login.
     */
    setUser(userName) {
      this.currentUserName = userName;
      this.login = true;
    },
  },
});
