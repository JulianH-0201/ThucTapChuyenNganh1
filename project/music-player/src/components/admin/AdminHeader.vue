<script setup>
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode"; // Sửa lại cách import

const adminName = ref("");
const emit = defineEmits(["logout"]);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      // Nếu token có dạng "Bearer <token>", hãy loại bỏ chữ Bearer
      const pureToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;

      const decoded = jwtDecode(pureToken);

      // Gán giá trị, ưu tiên username, sau đó đến name
      adminName.value = decoded.username || decoded.name || "Administrator";
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      adminName.value = "Guest";
    }
  }
});
</script>

<template>
  <header
    class="bg-dark text-white py-2 px-4 d-flex align-items-center justify-content-between"
    style="position: sticky; top: 0; z-index: 999"
  >
    <div class="d-flex align-items-center gap-3">
      <h5 class="mb-0 fw-bold text-light">Music Admin</h5>
      <button
        class="btn btn-link text-white p-0"
        style="text-decoration: none; font-size: 1.2rem"
      >
        <i class="fa fa-arrow-left"></i>
      </button>
      <span class="text-muted small">localhost:3000/admin</span>
    </div>
    <div class="d-flex align-items-center gap-3">
      <div v-if="adminName != ''" class="text-light small">
        Welcome, <strong>{{ adminName }}</strong>
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
