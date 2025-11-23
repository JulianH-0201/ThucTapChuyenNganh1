import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import ContactView from "@/views/ContactView.vue";
import DiscographyView from "@/views/DiscographyView.vue";
import AboutView from "@/views/AboutView.vue";
import BlogView from "@/views/BlogView.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/admin/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: UserLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "about",
          name: "about",
          component: AboutView,
        },
        {
          path: "discography",
          name: "discography",
          component: DiscographyView,
        },
        {
          path: "contact",
          name: "contact",
          component: ContactView,
        },
        {
          path: "blog",
          name: "blog",
          component: BlogView,
        },
      ],
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "admin-dashboard",
          component: DashboardView,
        },
        {
          path: "songs",
          name: "admin-songs",
          component: DashboardView,
        },
        { path: "login", name: "admin-login", component: LoginView },
        { path: "register", name: "admin-register", component: RegisterView },
      ],
    },
    {
      path: "/auth",
      component: AuthLayout,
      children: [
        { path: "login", name: "login", component: LoginView },
        { path: "register", name: "register", component: RegisterView },
      ],
    },
    // Fallback routes for old paths
    { path: "/login", redirect: "/auth/login" },
    { path: "/register", redirect: "/auth/register" },
  ],
});

export default router;
