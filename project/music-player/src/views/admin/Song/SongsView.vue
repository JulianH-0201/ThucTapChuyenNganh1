<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isSongsSection = computed(() => route.path === "/admin/songs");

// ============ STATE ============
const songs = ref([]);
const artistId = ref(null);
const albumId = ref(null);
const loading = ref(true);
const error = ref(null);
const sortOrder = ref("asc");
const sortColumn = ref("id");
const searchQuery = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);

// ============ FETCH DATA ============
const fetchSongs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("http://localhost:3000/api/admin/tracks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Lỗi tải bài hát");

    const data = await res.json();
    artistId.value = data.artistId || null;
    albumId.value = data.albumId || null;
    songs.value = data.map((t, i) => ({
      id: i + 1, // Số thứ tự hiển thị
      trackId: t._id, // ID thật của MongoDB (Dùng để Xóa/Sửa)
      name: t.name,
      path: t.path,
      // Lưu ý: API hiện tại chỉ trả về thông tin Album, không có Artist.
      // Tạm thời hiển thị tên Album vào cột Artist hoặc để trống.
      album: t.album ? t.album.name : "Unknown Album",
      albumId: t.album ? t.album._id : null,
    }));
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ============ SORT ============
const handleSort = (col) => {
  if (sortColumn.value === col) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = col;
    sortOrder.value = "asc";
  }

  filteredSongs.value.sort((a, b) => {
    const aVal = a[col];
    const bVal = b[col];

    if (typeof aVal === "string") {
      return sortOrder.value === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
  });
};

// ============ FILTER ============
const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs.value;

  const q = searchQuery.value.toLowerCase();
  return songs.value.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.path.toLowerCase().includes(q) ||
      s.id.toString().includes(q)
  );
});

// ============ PAGINATION ============
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filteredSongs.value.slice(start, start + entriesPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredSongs.value.length / entriesPerPage.value);
});

const startEntry = computed(() => {
  return filteredSongs.value.length === 0
    ? 0
    : (currentPage.value - 1) * entriesPerPage.value + 1;
});

const endEntry = computed(() => {
  const end = currentPage.value * entriesPerPage.value;
  return end > filteredSongs.value.length ? filteredSongs.value.length : end;
});

// ============ ACTIONS ============
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const changeEntriesPerPage = (val) => {
  entriesPerPage.value = parseInt(val);
  currentPage.value = 1;
};

// ============ ACTIONS ============
const handleDeleteSong = async (trackId) => {
  if (!confirm("Delete this song?")) return;
  try {
    const q = new URLSearchParams();
    if (artistId.value) q.set("artistId", artistId.value);
    if (albumId.value) q.set("albumId", albumId.value);
    const url = `http://localhost:3000/api/admin/tracks/${trackId}${
      q.toString() ? "?" + q.toString() : ""
    }`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    await fetchSongs();
  } catch (err) {
    error.value = err.message;
    console.error(err);
  }
};

// ============ LIFECYCLE ============
onMounted(() => {
  fetchSongs();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">All Songs</h2>
      <button
        v-if="isSongsSection"
        @click="router.push('/admin/songs/add')"
        class="btn btn-primary"
      >
        <i class="fa fa-plus me-2"></i>
        Add Song
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="fa fa-exclamation-circle me-2"></i>
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="card">
      <!-- Top Controls -->
      <div
        class="card-body border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
      >
        <!-- Entries per page -->
        <div class="d-flex align-items-center gap-2">
          <label for="entriesPerPage" class="mb-0 text-muted small">Show</label>
          <select
            id="entriesPerPage"
            v-model="entriesPerPage"
            @change="changeEntriesPerPage($event.target.value)"
            class="form-select form-select-sm"
            style="width: auto"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-muted small">entries per page</span>
        </div>

        <!-- Search -->
        <div class="d-flex align-items-center">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-sm"
            placeholder="Search..."
            style="width: 250px"
            @input="currentPage = 1"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th
                  scope="col"
                  @click="handleSort('id')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  ID
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'id'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('name')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  SONG NAME
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'name'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('artist')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  ALBUM
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'artist'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('path')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  FILE PATH
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'path'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th v-if="isSongsSection" scope="col" class="px-4 py-3">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in paginatedSongs" :key="song.trackId || song.id">
                <td class="px-4 py-3">{{ song.id }}</td>
                <td class="px-4 py-3">{{ song.name }}</td>
                <td class="px-4 py-3">{{ song.album }}</td>
                <td class="px-4 py-3">
                  <code class="text-muted">{{ song.path }}</code>
                </td>
                <td v-if="isSongsSection" class="px-4 py-3">
                  <div class="d-flex gap-2">
                    <button
                      @click="router.push(`/admin/songs/${song.trackId}/edit`)"
                      class="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i class="fa fa-edit me-1"></i>
                      Edit
                    </button>
                    <button
                      @click="() => handleDeleteSong(song.trackId)"
                      class="btn btn-sm btn-outline-danger"
                      title="Delete"
                    >
                      <i class="fa fa-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedSongs.length === 0">
                <td
                  :colspan="isSongsSection ? 5 : 4"
                  class="text-center py-4 text-muted"
                >
                  No songs found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div
        class="card-body border-top d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
      >
        <div class="text-muted small">
          Showing {{ startEntry }} to {{ endEntry }} of
          {{ filteredSongs.length }} entries
        </div>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                Previous
              </button>
            </li>
            <li
              v-for="page in Math.min(6, totalPages)"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button
                class="page-link"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid #dee2e6;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

code {
  font-size: 0.875rem;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
}

.page-link {
  color: #6c757d;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #6c757d;
  border-color: #6c757d;
}

.page-link:hover {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.form-select-sm {
  padding: 0.25rem 1.75rem 0.25rem 0.5rem;
}

.btn-sm {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
</style>
