<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const loading = ref(true);
const error = ref(null);
const artists = ref([]);
const form = ref({
  name: "",
  releaseYear: new Date().getFullYear().toString(),
  albumCover: "",
  price: 0,
  description: "",
  artistId: null,
});

const fetchArtists = async () => {
  try {
    const token = localStorage.getItem("token"); // Lấy token
    const res = await fetch("http://localhost:3000/api/admin/artists", {
      headers: {
        Authorization: token, // Gửi token
      },
    });
    if (res.ok) artists.value = await res.json();
  } catch (err) {
    console.error("Failed to load artists", err);
  }
};

const fetchAlbum = async () => {
  loading.value = true;
  error.value = null;
  const token = localStorage.getItem("token");
  try {
    // Try single album endpoint first
    const res = await fetch(`http://localhost:3000/api/admin/albums/${id}`, {
      headers: { Authorization: token },
    });
    if (res.ok) {
      const data = await res.json();
      const album = data.album || data || {};
      form.value.name = album.name || "";
      form.value.releaseYear =
        album.releaseYear || new Date().getFullYear().toString();
      form.value.albumCover = album.albumCover || "";
      form.value.price = album.price != null ? album.price : 0;
      form.value.description = album.description || "";
      form.value.artistId = album.artist?._id || album.artist || null;
      return;
    }

    // Fallback to list
    const listRes = await fetch("http://localhost:3000/api/admin/albums", {
      headers: { Authorization: token },
    });
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
    const list = await listRes.json();
    const found = list.find((a) => a._id === id || a.id === id);
    if (!found) throw new Error("Album not found");
    form.value.name = found.name || "";
    form.value.releaseYear =
      found.releaseYear || new Date().getFullYear().toString();
    form.value.albumCover = found.albumCover || "";
    form.value.price = found.price != null ? found.price : 0;
    form.value.description = found.description || "";
    form.value.artistId =
      found.artist?._id || (found.artist && found.artist._id) || null;
  } catch (err) {
    error.value = err.message || "Failed to load album";
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!form.value.name.trim()) return alert("Name required");
  try {
    const payload = { ...form.value };
    if (!payload.artistId) delete payload.artistId;

    const res = await fetch(`http://localhost:3000/api/admin/albums/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    router.push({ path: "/admin/albums" });
  } catch (err) {
    error.value = err.message || "Failed to save";
  }
};

const cancel = () => router.back();

onMounted(async () => {
  await fetchArtists();
  await fetchAlbum();
});
</script>

<template>
  <div class="container py-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">Edit Album</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error" class="card p-3">
      <div class="mb-3">
        <label class="form-label">Album name</label>
        <input v-model="form.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Artist</label>
        <select v-model="form.artistId" class="form-select">
          <option :value="null">-- Select artist (optional) --</option>
          <option v-for="a in artists" :key="a._id" :value="a._id">
            {{ a.artistName }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Release year</label>
        <input v-model="form.releaseYear" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Album cover URL</label>
        <input v-model="form.albumCover" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Price</label>
        <input v-model.number="form.price" type="number" class="form-control" />
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
