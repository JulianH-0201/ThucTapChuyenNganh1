import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/user/HomeView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import ContactView from "@/views/user/ContactView.vue";
import DiscographyView from "@/views/user/DiscographyView.vue";
import AboutView from "@/views/user/AboutView.vue";
import BlogView from "@/views/user/BlogView.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import AddSongView from "@/views/admin/Song/AddSongView.vue";
import EditSongView from "@/views/admin/Song/EditSongView.vue";
import AddAlbumView from "@/views/admin/Album/AddAlbumView.vue";
import EditAlbumView from "@/views/admin/Album/EditAlbumView.vue";
import AlbumsView from "@/views/admin/Album/AlbumsView.vue";
import ArtistsView from "@/views/admin/Artist/ArtistsView.vue";
import EditArtistView from "@/views/admin/Artist/EditArtistView.vue";
import AddArtistView from "@/views/admin/Artist/AddArtistView.vue";
import AlbumDetailView from "../views/user/AlbumDetailView.vue";
import SongsView from "../views/admin/Song/SongsView.vue";
import UserView from "../views/admin/User/UsersView.vue";
import ChangeRoleUserView from "../views/admin/User/ChangeRoleUserView.vue";
import AdminLogin from "../views/admin/AdminLogin.vue";

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
          path: "discography/:artistSlug/:albumSlug",
          name: "album-detail",
          component: AlbumDetailView,
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
          name: "admin-login",
          component: AdminLogin,
        },
        {
          path: "songs",
          name: "admin-songs",
          component: SongsView,
        },
        {
          path: "songs/add",
          name: "admin-add-song",
          component: AddSongView,
        },
        {
          path: "songs/:id/edit",
          name: "admin-edit-song",
          component: EditSongView,
        },
        {
          path: "albums",
          name: "admin-albums",
          component: AlbumsView,
        },
        {
          path: "artists",
          name: "admin-artists",
          component: ArtistsView,
        },
        {
          path: "artists/add",
          name: "admin-add-artist",
          component: AddArtistView,
        },
        {
          path: "artists/:id/albums",
          name: "admin-artist-albums",
          component: AlbumsView,
        },
        {
          path: "albums/add",
          name: "admin-add-album",
          component: AddAlbumView,
        },
        {
          path: "albums/:id/edit",
          name: "admin-edit-album",
          component: EditAlbumView,
        },
        {
          path: "artists/:id/edit",
          name: "admin-edit-artist",
          component: EditArtistView,
        },
        {
          path: "users",
          name: "admin-users",
          component: UserView,
        },
        {
          path: "users/:id/change-role",
          name: "admin-users-changeRoleUser",
          component: ChangeRoleUserView,
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
