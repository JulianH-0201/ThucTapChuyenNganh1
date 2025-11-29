<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const artists = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchArtists = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("http://localhost:3000/api/admin/artists");
    if (!res.ok) throw new Error("Lỗi tải nghệ sĩ");
    artists.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm("Xóa nghệ sĩ này?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/admin/artists/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Lỗi xóa");
    await fetchArtists();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchArtists);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Artists</h2>
      <div>
        <button
          @click="router.push('/admin/artists/add')"
          class="btn btn-primary me-2"
        >
          <i class="fa fa-plus me-1"></i>Add
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error">
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="a in artists"
          :key="a._id"
        >
          <div>
            <strong>{{ a.artistName }}</strong>
            <div class="text-muted small">Albums: {{ a.albumCount }}</div>
          </div>
          <div>
            <button
              @click="() => router.push(`/admin/artists/${a._id}/albums`)"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              Albums
            </button>
            <button
              @click="() => handleDelete(a._id)"
              class="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
