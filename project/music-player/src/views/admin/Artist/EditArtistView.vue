<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const loading = ref(true);
const error = ref(null);
const form = ref({ artistName: "", artistBio: "" });

const fetchArtist = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Try GET /:id first (backend may not implement it)
    const res = await fetch(`http://localhost:3000/api/admin/artists/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.ok) {
      const data = await res.json();
      const artist = data.artist || data || {};
      form.value.artistName = artist.artistName || "";
      form.value.artistBio = artist.artistBio || "";
      return;
    }

    // Fallback to list
    const listRes = await fetch("http://localhost:3000/api/admin/artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
    const list = await listRes.json();
    const found = list.find((a) => a._id === id || a.id === id);
    if (!found) throw new Error("Artist not found");
    form.value.artistName = found.artistName || "";
    form.value.artistBio = found.artistBio || "";
  } catch (err) {
    error.value = err.message || "Failed to load artist";
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!form.value.artistName.trim()) return alert("Name required");
  try {
    const res = await fetch(`http://localhost:3000/api/admin/artists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        artistName: form.value.artistName,
        artistBio: form.value.artistBio,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    router.push({ path: "/admin/artists" });
  } catch (err) {
    error.value = err.message || "Failed to save";
  }
};

const cancel = () => router.back();

onMounted(fetchArtist);
</script>

<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">Edit Artist</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error" class="card p-3">
      <div class="mb-3">
        <label class="form-label">Artist name</label>
        <input v-model="form.artistName" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Artist bio</label>
        <input v-model="form.artistBio" class="form-control" />
      </div>

      <div class="d-flex gap-2 justify-content-end">
        <button class="btn btn-secondary" @click="cancel">Cancel</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
}
</style>
