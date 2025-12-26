<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formData = ref({
  name: "",
  path: "",
  artistId: null,
  albumId: null,
});

const artists = ref([]);
const albums = ref([]);

const loading = ref(false);
const error = ref(null);
const success = ref(false);

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.path) {
    error.value = "Please fill in all required fields";
    return;
  }

  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const payload = { ...formData.value };
    // if artist/album not selected, backend may use defaults
    if (!payload.artistId) delete payload.artistId;
    if (!payload.albumId) delete payload.albumId;

    const response = await fetch("http://localhost:3000/api/admin/tracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      success.value = true;
      formData.value = { name: "", path: "", artistId: null, albumId: null };
      setTimeout(() => {
        router.push("/admin/songs");
      }, 1500);
    } else {
      error.value = data.error || "Failed to add song";
    }
  } catch (err) {
    error.value = err.message;
    console.error("Failed to add song:", err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/admin/songs");
};

const fetchArtists = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/artists");
    if (res.ok) artists.value = await res.json();
  } catch (err) {
    console.error("Failed to load artists", err);
  }
};

const fetchAlbumsForArtist = async (artistId) => {
  albums.value = [];
  if (!artistId) return;
  try {
    const res = await fetch(
      `http://localhost:3000/api/admin/albums/artists/${artistId}/albums`
    );
    if (res.ok) albums.value = await res.json();
  } catch (err) {
    console.error("Failed to load albums for artist", err);
  }
};

onMounted(fetchArtists);
watch(
  () => formData.value.artistId,
  (newVal) => {
    fetchAlbumsForArtist(newVal);
    formData.value.albumId = null;
  }
);
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="mb-4 text-dark">Add New Song</h2>

        <div
          v-if="success"
          class="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i class="fa fa-check-circle me-2"></i>
          Song added successfully! Redirecting...
        </div>

        <div
          v-if="error"
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <i class="fa fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="card">
          <div class="card-body">
            <!-- Song Name -->
            <div class="mb-3">
              <label for="songName" class="form-label fw-bold">
                Song Name <span class="text-danger">*</span>
              </label>
              <input
                id="songName"
                v-model="formData.name"
                type="text"
                class="form-control"
                placeholder="Enter song name"
                required
              />
              <small class="text-muted">The title of the song</small>
            </div>

            <!-- File Path -->
            <div class="mb-3">
              <label for="filePath" class="form-label fw-bold">
                File Path <span class="text-danger">*</span>
              </label>
              <input
                id="filePath"
                v-model="formData.path"
                type="text"
                class="form-control"
                placeholder="e.g., /songs/song-name.mp3"
                required
              />
              <small class="text-muted"
                >Path to the audio file (e.g., /songs/Intro.mp3)</small
              >
            </div>

            <!-- Artist Select -->
            <div class="mb-3">
              <label for="artistSelect" class="form-label fw-bold">
                Artist
              </label>
              <select
                id="artistSelect"
                v-model="formData.artistId"
                class="form-select"
              >
                <option :value="null">-- Select artist (optional) --</option>
                <option v-for="a in artists" :key="a._id" :value="a._id">
                  {{ a.artistName }}
                </option>
              </select>
              <small class="text-muted">Choose an artist for this song</small>
            </div>

            <!-- Album Select (depends on artist) -->
            <div class="mb-4">
              <label for="albumSelect" class="form-label fw-bold">Album</label>
              <select
                id="albumSelect"
                v-model="formData.albumId"
                class="form-select"
                :disabled="!albums.length"
              >
                <option :value="null">-- Select album (optional) --</option>
                <option
                  v-for="al in albums"
                  :key="al._id || al.id"
                  :value="al._id || al.id"
                >
                  {{ al.name }}
                </option>
              </select>
              <small class="text-muted">Choose an album (optional)</small>
            </div>
            <div class="d-flex gap-2 justify-content-end">
              <button
                type="button"
                @click="handleCancel"
                class="btn btn-outline-secondary"
                :disabled="loading"
              >
                <i class="fa fa-times me-2"></i>
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i v-if="!loading" class="fa fa-save me-2"></i>
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ loading ? "Adding..." : "Add Song" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid #dee2e6;
}

.card-body {
  padding: 2rem;
}

.form-label {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  padding: 0.625rem 0.875rem;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn {
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
}

.alert {
  border-radius: 0.375rem;
}

.text-danger {
  color: #dc3545;
}
</style>
