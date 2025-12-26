<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const artists = ref([]);
const loading = ref(true);
const error = ref(null);

// Cấu hình URL gốc của API (dựa trên việc tách route đã làm)
const API_URL = "http://localhost:3000/api/admin/artists";

// 1. Lấy danh sách Artist
const fetchArtists = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Lỗi tải danh sách nghệ sĩ");

    // Backend trả về: [{ ...artistData, albums: [...] }, ...]
    artists.value = await res.json();
  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 2. Xóa Artist
const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa nghệ sĩ này và toàn bộ Album liên quan?"))
    return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Lỗi khi xóa");

    // Refresh lại list sau khi xóa thành công
    await fetchArtists();
  } catch (err) {
    alert(err.message);
  }
};

// 3. Sửa tên Artist
const handleEdit = async (artist) => {
  const newName = prompt("Nhập tên mới:", artist.artistName);

  // Nếu user ấn Cancel hoặc để trống thì thôi
  if (newName === null || newName.trim() === "") return;

  try {
    const res = await fetch(`${API_URL}/${artist._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistName: newName }),
    });

    if (!res.ok) throw new Error("Lỗi cập nhật");

    await fetchArtists();
  } catch (err) {
    alert(err.message);
  }
};

// Gọi API khi component được mount
onMounted(fetchArtists);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Artists</h2>
      <div>
        <button
          @click="router.push('/admin/artists/add')"
          class="btn btn-primary"
        >
          <i class="fa fa-plus me-1"></i> Add new artist
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-4 text-center">Đang tải dữ liệu...</div>
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
            <div class="text-muted small">
              Albums: {{ a.albums ? a.albums.length : 0 }}
            </div>
          </div>

          <div>
            <button
              @click="router.push(`/admin/artists/${a._id}/albums`)"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              View Albums
            </button>

            <button
              @click="handleEdit(a)"
              class="btn btn-sm btn-outline-primary me-2"
            >
              Edit
            </button>

            <button @click="handleDelete(a._id)" class="btn btn-sm btn-danger">
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div v-if="artists.length === 0" class="text-center mt-3 text-muted">
        Chưa có nghệ sĩ nào.
      </div>
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
