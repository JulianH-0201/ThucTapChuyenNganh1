import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUserName: null,
    currentUserRole: null,
    login: false,
  }),

  actions: {
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
          const role = decoded.role || null;
          if (name) {
            this.currentUserName = name;
            this.login = true;
            if (role) this.currentUserRole = role;
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
    userLogout() {
      this.login = false;
      this.currentUserName = null;
      this.currentUserRole = null;
      // Only token is persisted now
      localStorage.removeItem("token");
    },
    // set curent user in store
    setUser(userName) {
      this.currentUserName = userName;
      this.login = true;
    },

    /**
     * Set current user's role in store
     */
    setRole(roleName) {
      this.currentUserRole = roleName;
    },
  },
});
