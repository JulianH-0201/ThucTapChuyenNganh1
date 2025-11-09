<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref } from "vue";
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  PuzzlePieceIcon,
  DocumentIcon,
  Bars3Icon,
  LinkIcon,
  Cog6ToothIcon,
  TrashIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

const router = useRouter();
const sidebarCollapsed = ref(false);

const handleLogout = () => {
  // Add logout logic here
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Main Content Area -->
    <div :class="['transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Header -->
      <AdminHeader @logout="handleLogout" />

      <!-- Page Content -->
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

