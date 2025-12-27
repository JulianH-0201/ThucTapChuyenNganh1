<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const artistId = route.query.artistId || null;
const albumId = route.query.albumId || null;

const loading = ref(true);
const error = ref(null);
const form = ref({ name: "", path: "" });

const fetchSong = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Try single-track endpoint first (may 404 because backend doesn't implement GET /:id)
    const q = new URLSearchParams();
    if (artistId) q.set("artistId", artistId);
    if (albumId) q.set("albumId", albumId);
    const singleUrl = `http://localhost:3000/api/admin/tracks/${id}${
      q.toString() ? "?" + q.toString() : ""
    }`;

    let res = await fetch(singleUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.ok) {
      const data = await res.json();
      const song = data.track || data || {};
      form.value.name = song.name || "";
      form.value.path = song.path || "";
      return;
    }

    // Fallback: fetch all tracks and find by id
    const listRes = await fetch("http://localhost:3000/api/admin/tracks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
    const list = await listRes.json();
    const found = list.find(
      (t) => t._id === id || t.trackId === id || t.id === id
    );
    if (!found) throw new Error("Song not found");
    form.value.name = found.name || "";
    form.value.path = found.path || "";
  } catch (err) {
    error.value = err.message || "Failed to load song";
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!form.value.name.trim()) {
    alert("Name is required");
    return;
  }

  try {
    const q = new URLSearchParams();
    if (artistId) q.set("artistId", artistId);
    if (albumId) q.set("albumId", albumId);
    const url = `http://localhost:3000/api/admin/tracks/${id}${
      q.toString() ? "?" + q.toString() : ""
    }`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ name: form.value.name, path: form.value.path }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    router.push({ path: "/admin/songs" });
  } catch (err) {
    error.value = err.message || "Failed to save";
  }
};

const cancel = () => router.back();

onMounted(fetchSong);
</script>

<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">Edit Song</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error" class="card p-3">
      <div class="mb-3">
        <label class="form-label">Song name</label>
        <input v-model="form.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">File path</label>
        <input v-model="form.path" class="form-control" />
        <div class="form-text">Example: /songs/AlbumName/track.mp3</div>
      </div>

      <div class="d-flex gap-2 justify-content-end">
        <button class="btn btn-secondary" @click="cancel">Cancel</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem 0;
}
</style>
