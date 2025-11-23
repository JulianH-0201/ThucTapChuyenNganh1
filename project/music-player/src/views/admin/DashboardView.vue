<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isSongsSection = computed(() => route.path === "/admin/songs");

const songs = ref([]);
const allSongs = ref([]);
const loading = ref(true);
const error = ref(null);
const sortOrder = ref("asc");
const sortColumn = ref("id");
const searchQuery = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);

const fetchSongs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch("http://localhost:3000/api/admin/songs");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Transform tracks to include ID and artist
    allSongs.value = (data.tracks || []).map((track, index) => ({
      id: track.id || index + 1,
      name: track.name,
      path: track.path,
      artist: data.artist || "Unknown Artist",
    }));
    songs.value = [...allSongs.value];
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch songs:", err);
  } finally {
    loading.value = false;
  }
};

const handleSort = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortOrder.value = "asc";
  }
  
  filteredSongs.value.sort((a, b) => {
    if (column === "id") {
      return sortOrder.value === "asc" ? a.id - b.id : b.id - a.id;
    } else if (column === "name") {
      return sortOrder.value === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (column === "artist") {
      return sortOrder.value === "asc"
        ? a.artist.localeCompare(b.artist)
        : b.artist.localeCompare(a.artist);
    } else if (column === "path") {
      return sortOrder.value === "asc"
        ? a.path.localeCompare(b.path)
        : b.path.localeCompare(a.path);
    }
    return 0;
  });
};

const filteredSongs = computed(() => {
  if (!searchQuery.value) {
    return songs.value;
  }
  const query = searchQuery.value.toLowerCase();
  return songs.value.filter(
    (song) =>
      song.name.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.path.toLowerCase().includes(query) ||
      song.id.toString().includes(query)
  );
});

const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value;
  const end = start + entriesPerPage.value;
  return filteredSongs.value.slice(start, end);
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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const changeEntriesPerPage = (value) => {
  entriesPerPage.value = parseInt(value);
  currentPage.value = 1;
};

onMounted(() => {
  fetchSongs();
});
</script>

<template>
  <div>
    <h2 class="mb-4 text-dark">All Songs</h2>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      Error loading songs: {{ error }}
    </div>

    <div v-if="!loading && !error" class="card">
      <!-- Top Controls -->
      <div class="card-body border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
        <!-- Entries per page -->
        <div class="d-flex align-items-center gap-2">
          <label for="entriesPerPage" class="mb-0 text-muted small">Show</label>
          <select
            id="entriesPerPage"
            v-model="entriesPerPage"
            @change="changeEntriesPerPage($event.target.value)"
            class="form-select form-select-sm"
            style="width: auto;"
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
            style="width: 250px;"
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
                  style="cursor: pointer; user-select: none;"
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
                    style="opacity: 0.5; font-size: 0.75rem;"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('name')"
                  style="cursor: pointer; user-select: none;"
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
                    style="opacity: 0.5; font-size: 0.75rem;"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('artist')"
                  style="cursor: pointer; user-select: none;"
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
                    style="opacity: 0.5; font-size: 0.75rem;"
                  ></i>
                </th>
                <th
                  scope="col"
                  @click="handleSort('path')"
                  style="cursor: pointer; user-select: none;"
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
                    style="opacity: 0.5; font-size: 0.75rem;"
                  ></i>
                </th>
                <th v-if="isSongsSection" scope="col" class="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in paginatedSongs" :key="song.id">
                <td class="px-4 py-3">{{ song.id }}</td>
                <td class="px-4 py-3">{{ song.name }}</td>
                <td class="px-4 py-3">{{ song.artist }}</td>
                <td class="px-4 py-3">
                  <code class="text-muted">{{ song.path }}</code>
                </td>
                <td v-if="isSongsSection" class="px-4 py-3">
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <i class="fa fa-edit me-1"></i>
                      Edit
                    </button>
                    <button
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
                <td :colspan="isSongsSection ? 5 : 4" class="text-center py-4 text-muted">
                  No songs found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div class="card-body border-top d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
        <div class="text-muted small">
          Showing {{ startEntry }} to {{ endEntry }} of {{ filteredSongs.length }} entries
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
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
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

