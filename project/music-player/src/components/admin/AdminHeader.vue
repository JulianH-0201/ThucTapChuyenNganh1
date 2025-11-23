<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["logout"]);
</script>

<template>
  <header class="bg-dark text-white py-2 px-4 d-flex align-items-center justify-content-between" style="position: sticky; top: 0; z-index: 999;">
    <div class="d-flex align-items-center gap-3">
      <h5 class="mb-0 fw-bold text-light">Music Admin</h5>
      <button class="btn btn-link text-white p-0" style="text-decoration: none; font-size: 1.2rem;">
        <i class="fa fa-arrow-left"></i>
      </button>
      <span class="text-muted small">localhost:3000/admin</span>
    </div>
    <div class="d-flex align-items-center gap-3">
      <div class="input-group" style="width: 250px;">
        <input
          type="text"
          class="form-control form-control-sm bg-dark text-white border-secondary"
          placeholder="Search for..."
          style="color: white !important;"
        />
        <button class="btn btn-outline-light btn-sm" type="button">
          <i class="fa fa-search"></i>
        </button>
      </div>
      <button @click="emit('logout')" class="btn btn-danger btn-sm px-3">
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

