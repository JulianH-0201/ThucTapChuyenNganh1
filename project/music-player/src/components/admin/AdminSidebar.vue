<script setup>
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: "fa-home" },
  { name: "Songs", path: "/admin/songs", icon: "fa-music" },
  { name: "Artists", path: "/admin/artists", icon: "fa-users" },
  { name: "Analytics", path: "/admin/analytics", icon: "fa-chart-bar" },
  { name: "Settings", path: "/admin/settings", icon: "fa-cog" },
];
</script>

<template>
  <aside
    class="bg-dark text-white"
    style="min-height: 100vh; width: 250px; transition: width 0.3s; position: fixed; left: 0; top: 0; z-index: 1000;"
  >
    <nav class="p-3" style="padding-top: 60px;">
      <ul class="list-unstyled mb-0">
        <li v-for="item in menuItems" :key="item.path" class="mb-1">
          <RouterLink
            :to="item.path"
            :class="[
              'd-flex align-items-center text-white text-decoration-none p-3 rounded',
              (route.path === item.path || (item.path === '/admin' && route.path === '/admin')) ? 'bg-secondary' : ''
            ]"
            style="transition: background-color 0.2s;"
          >
            <i :class="['fa', item.icon, 'me-3']" style="width: 20px; text-align: center;"></i>
            <span>{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="px-3 pb-3 d-flex gap-2" style="position: absolute; bottom: 0; width: 100%;">
      <button
        class="btn btn-sm btn-outline-light"
        title="Toggle Sidebar"
        style="flex: 1;"
      >
        <i class="fa fa-arrow-left"></i>
      </button>
      <button class="btn btn-sm btn-outline-light" title="Settings">
        <i class="fa fa-cog"></i>
      </button>
      <button class="btn btn-sm btn-outline-light" title="Delete">
        <i class="fa fa-trash"></i>
      </button>
    </div>
  </aside>
</template>

<style scoped>
a:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>

