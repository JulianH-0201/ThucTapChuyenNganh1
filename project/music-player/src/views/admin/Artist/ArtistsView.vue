<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const artists = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);
const sortColumn = ref("artistName");
const sortOrder = ref("asc");

const API_URL = "http://localhost:3000/api/admin/artists";

const fetchArtists = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập");
    artists.value = await res.json();
  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const filtered = computed(() => {
  if (!searchQuery.value) return artists.value;
  const q = searchQuery.value.toLowerCase();
  return artists.value.filter(
    (a) =>
      (a.artistName || "").toLowerCase().includes(q) ||
      (a.artistBio || "").toLowerCase().includes(q) ||
      (a._id || "").toString().includes(q)
  );
});

const paginated = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filtered.value.slice(start, start + entriesPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filtered.value.length / entriesPerPage.value)
);
const startEntry = computed(() =>
  filtered.value.length === 0
    ? 0
    : (currentPage.value - 1) * entriesPerPage.value + 1
);
const endEntry = computed(() =>
  Math.min(currentPage.value * entriesPerPage.value, filtered.value.length)
);

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p;
};
const changeEntries = (val) => {
  entriesPerPage.value = parseInt(val);
  currentPage.value = 1;
};

const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa nghệ sĩ này và toàn bộ Album liên quan?"))
    return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    if (!res.ok) throw new Error("Lỗi khi xóa");
    await fetchArtists();
  } catch (err) {
    alert(err.message);
  }
};

const handleSort = (col) => {
  if (sortColumn.value === col) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = col;
    sortOrder.value = "asc";
  }
  filtered.value.sort((a, b) => {
    const aVal = a[col] || "";
    const bVal = b[col] || "";
    return sortOrder.value === "asc"
      ? aVal.toString().localeCompare(bVal.toString())
      : bVal.toString().localeCompare(aVal.toString());
  });
};

onMounted(fetchArtists);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">Artists</h2>
      <div>
        <button
          @click="router.push('/admin/artists/add')"
          class="btn btn-primary"
        >
          <i class="fa fa-plus me-2"></i> Add Artist
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      <i class="fa fa-exclamation-circle me-2"></i>
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="card">
      <div
        class="card-body border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
      >
        <div class="d-flex align-items-center gap-2">
          <label for="entriesPerPage" class="mb-0 text-muted small">Show</label>
          <select
            id="entriesPerPage"
            v-model="entriesPerPage"
            @change="changeEntries($event.target.value)"
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

        <div class="d-flex align-items-center">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-sm"
            placeholder="Search artists..."
            style="width: 250px"
            @input="currentPage = 1"
          />
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th
                  scope="col"
                  @click="handleSort('artistName')"
                  class="px-4 py-3"
                  style="cursor: pointer; user-select: none"
                >
                  NAME
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'artistName'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th scope="col" class="px-4 py-3">BIO</th>
                <th
                  scope="col"
                  @click="handleSort('albums')"
                  class="px-4 py-3"
                  style="cursor: pointer; user-select: none"
                >
                  ALBUMS
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'albums'
                        ? sortOrder === 'asc'
                          ? 'fa-arrow-up'
                          : 'fa-arrow-down'
                        : 'fa-arrows-alt-v',
                    ]"
                    style="opacity: 0.5; font-size: 0.75rem"
                  ></i>
                </th>
                <th scope="col" class="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in paginated" :key="a._id">
                <td class="px-4 py-3 align-middle">{{ a.artistName }}</td>
                <td
                  class="px-4 py-3 small text-muted"
                  style="max-width: 360px; white-space: pre-wrap"
                >
                  {{ a.artistBio || "—" }}
                </td>
                <td class="px-4 py-3 align-middle">
                  <span class="badge bg-info text-dark">{{
                    a.albums ? a.albums.length : 0
                  }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="d-flex gap-2">
                    <button
                      @click="router.push(`/admin/artists/${a._id}/albums`)"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      View Albums
                    </button>
                    <button
                      @click="router.push(`/admin/artists/${a._id}/edit`)"
                      class="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(a._id)"
                      class="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">
                  No artists found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="card-body border-top d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
      >
        <div class="text-muted small">
          Showing {{ startEntry }} to {{ endEntry }} of
          {{ filtered.length }} entries
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

.badge {
  font-weight: 600;
  font-size: 0.8rem;
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
</style>
