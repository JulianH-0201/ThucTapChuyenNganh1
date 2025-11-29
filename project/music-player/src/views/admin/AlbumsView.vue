<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ============ STATE ============
const albums = ref([]);
const loading = ref(true);
const error = ref(null);
const sortOrder = ref("asc");
const sortColumn = ref("name");
const searchQuery = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);

// ============ FETCH DATA ============
const fetchAlbums = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("http://localhost:3000/api/admin/albums");
    if (!res.ok) throw new Error("Lỗi tải album");
    albums.value = await res.json();
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

  filteredAlbums.value.sort((a, b) => {
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
const filteredAlbums = computed(() => {
  if (!searchQuery.value) return albums.value;

  const q = searchQuery.value.toLowerCase();
  return albums.value.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.releaseYear.includes(q)
  );
});

// ============ PAGINATION ============

const paginatedAlbums = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  return filteredAlbums.value.slice(start, start + entriesPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAlbums.value.length / entriesPerPage.value);
});

const startEntry = computed(() => {
  return filteredAlbums.value.length === 0
    ? 0
    : (currentPage.value - 1) * entriesPerPage.value + 1;
});

const endEntry = computed(() => {
  const end = currentPage.value * entriesPerPage.value;
  return end > filteredAlbums.value.length ? filteredAlbums.value.length : end;
});

// ============ ACTIONS ============
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const changeEntriesPerPage = (val) => {
  entriesPerPage.value = parseInt(val);
  currentPage.value = 1;
};

// const handleDelete = async (id, name) => {
//   if (!confirm(`Xóa album "${name}"?`)) return;

//   try {
//     const res = await fetch(`http://localhost:3000/api/admin/albums/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error("Lỗi xóa");
//     await fetchAlbums();
//   } catch (err) {
//     error.value = err.message;
//   }
// };

// ============ LIFECYCLE ============
onMounted(() => {
  fetchAlbums();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">Albums</h2>
      <button @click="router.push('/admin/albums/add')" class="btn btn-primary">
        <i class="fa fa-plus me-2"></i>
        Add Album
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
                  @click="handleSort('name')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  ALBUM NAME
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
                  ARTIST
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
                  @click="handleSort('releaseYear')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  YEAR
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'releaseYear'
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
                  @click="handleSort('price')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  PRICE
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'price'
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
                  @click="handleSort('trackCount')"
                  style="cursor: pointer; user-select: none"
                  class="px-4 py-3"
                >
                  TRACKS
                  <i
                    :class="[
                      'fa ms-1',
                      sortColumn === 'trackCount'
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
              <tr v-for="album in paginatedAlbums" :key="album._id">
                <td class="px-4 py-3">
                  <div class="d-flex align-items-center gap-2">
                    <span>{{ album.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">{{ album.artist }}</td>
                <td class="px-4 py-3">{{ album.releaseYear }}</td>
                <td class="px-4 py-3">${{ album.price }}</td>
                <td class="px-4 py-3">
                  <span class="badge bg-info text-dark">{{
                    album.trackCount
                  }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" title="Edit">
                      <i class="fa fa-edit me-1"></i>
                      Edit
                    </button>
                    <button
                      @click="handleDelete(album._id, album.name)"
                      class="btn btn-sm btn-outline-danger"
                      title="Delete"
                    >
                      <i class="fa fa-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedAlbums.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  No albums found
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
          {{ filteredAlbums.length }} entries
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
