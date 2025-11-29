<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const loading = ref(false);
const error = ref(null);
const success = ref(false);

const handleSubmit = async () => {
  if (!name.value) {
    error.value = "Tên nghệ sĩ bắt buộc";
    return;
  }
  loading.value = true;
  error.value = null;
  success.value = false;
  try {
    const res = await fetch("http://localhost:3000/api/admin/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistName: name.value }),
    });
    if (!res.ok) throw new Error("Lỗi tạo nghệ sĩ");
    const data = await res.json();
    if (data.success) {
      success.value = true;
      name.value = "";
      setTimeout(() => router.push("/admin/artists"), 800);
    } else {
      error.value = data.error || "Không thể tạo";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4">Add Artist</h2>
        <div v-if="success" class="alert alert-success">Artist created.</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="handleSubmit" class="card p-3">
          <div class="mb-3">
            <label class="form-label">Artist Name</label>
            <input
              v-model="name"
              class="form-control"
              placeholder="Artist name"
            />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button
              type="button"
              @click="() => $router.back()"
              class="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
}
</style>
