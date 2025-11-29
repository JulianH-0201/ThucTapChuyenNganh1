import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUserName: null,
    login: false,
  }),

  actions: {
    //save user data when reload pages
    initializeUser() {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        this.currentUserName = savedUser;
        this.login = true;
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
      localStorage.removeItem("user");
    },

    setUser(userName) {
      this.currentUserName = userName;
      this.login = true;
      localStorage.setItem("user", userName);
    },
  },
});
