<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// form and state
const formData = ref({
  name: "",
  releaseYear: new Date().getFullYear().toString(),
  albumCover: "",
  price: 0,
  description: "",
  artistId: null,
});
const artists = ref([]);
const loading = ref(false);
const error = ref(null);
const success = ref(false);

// fetch artists for selection
const fetchArtists = async () => {
  try {
    const token = localStorage.getItem("token"); // Lấy token

    const res = await fetch("http://localhost:3000/api/admin/artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Gửi token lên server
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.error("Phiên đăng nhập hết hạn hoặc không có quyền.");
      return;
    }

    if (res.ok) {
      artists.value = await res.json();
    }
  } catch (err) {
    console.error("Failed to load artists", err);
  }
};

const handleSubmit = async () => {
  if (!formData.value.name) {
    error.value = "Please fill in album name";
    return;
  }

  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const token = localStorage.getItem("token");
    const payload = { ...formData.value };
    // if no artist selected, backend will use first artist
    if (!payload.artistId) delete payload.artistId;

    const response = await fetch("http://localhost:3000/api/admin/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      success.value = true;
      formData.value = {
        name: "",
        releaseYear: new Date().getFullYear().toString(),
        albumCover: "",
        price: 0,
        description: "",
        artistId: null,
      };
      setTimeout(() => {
        router.push("/admin/albums");
      }, 800);
    } else {
      error.value = data.error || "Failed to add album";
    }
  } catch (err) {
    error.value = err.message;
    console.error("Failed to add album:", err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => router.push("/admin/albums");

onMounted(fetchArtists);
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="mb-4 text-dark">Add New Album</h2>

        <div
          v-if="success"
          class="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i class="fa fa-check-circle me-2"></i>
          Album added successfully! Redirecting...
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
            <!-- Album Name -->
            <div class="mb-3">
              <label for="albumName" class="form-label fw-bold">
                Album Name <span class="text-danger">*</span>
              </label>
              <input
                id="albumName"
                v-model="formData.name"
                type="text"
                class="form-control"
                placeholder="Enter album name"
                required
              />
              <small class="text-muted">The title of the album</small>
            </div>

            <!-- Artist Select -->
            <div class="mb-3">
              <label for="artistSelect" class="form-label fw-bold"
                >Artist</label
              >
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
              <small class="text-muted"
                >Associate this album with an existing artist (optional)</small
              >
            </div>

            <!-- Release Year -->
            <div class="mb-3">
              <label for="releaseYear" class="form-label fw-bold"
                >Release Year</label
              >
              <input
                id="releaseYear"
                v-model="formData.releaseYear"
                type="text"
                class="form-control"
                placeholder="e.g., 2024"
              />
              <small class="text-muted">Year the album was released</small>
            </div>

            <!-- Album Cover -->
            <div class="mb-3">
              <label for="albumCover" class="form-label fw-bold"
                >Album Cover URL</label
              >
              <input
                id="albumCover"
                v-model="formData.albumCover"
                type="text"
                class="form-control"
                placeholder="e.g., /albumCovers/album-name.png"
              />
              <small class="text-muted">URL to the album cover image</small>
            </div>

            <!-- Price -->
            <div class="mb-3">
              <label for="price" class="form-label fw-bold">Price</label>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                class="form-control"
                placeholder="e.g., 20"
                min="0"
                step="0.01"
              />
              <small class="text-muted">Album price</small>
            </div>

            <!-- Description -->
            <!-- <div class="mb-4">
              <label for="description" class="form-label fw-bold"
                >Description</label
              >
               <textarea
                id="description"
                v-model="formData.description"
                class="form-control"
                placeholder="Enter album description"
                rows="4"
              ></textarea>
              <small class="text-muted"
                >Brief description about the album</small
              >
            </div> -->

            <!-- Buttons -->
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
                {{ loading ? "Adding..." : "Add Album" }}
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

.form-control,
.form-control:focus,
textarea {
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  padding: 0.625rem 0.875rem;
}

.form-control:focus,
textarea:focus {
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
