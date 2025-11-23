<script setup>
import { RouterView, useRouter } from "vue-router";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";

const router = useRouter();

const handleLogout = () => {
  router.push("/auth/login");
};
</script>

<template>
  <div class="min-vh-100 bg-light d-flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div
      class="flex-grow-1 d-flex flex-column"
      style="margin-left: 250px; transition: margin-left 0.3s;"
    >
      <AdminHeader @logout="handleLogout" />

      <main class="flex-grow-1 bg-white p-4" style="overflow-y: auto;">
        <RouterView />
      </main>
    </div>
  </div>
</template>
