<script setup>
import { ref, onMounted } from "vue";
import DataTable from "@/components/admin/DataTable.vue";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/vue/24/outline";

const API_BASE_URL = "http://localhost:3000/api/admin";

const songs = ref([]);
const loading = ref(true);
const error = ref(null);
const showAddModal = ref(false);
const editingSong = ref(null);
const formData = ref({ name: "", path: "" });

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "name", label: "Song Name" },
  { key: "path", label: "File Path" },
];

const fetchSongs = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${API_BASE_URL}/songs`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to fetch songs`);
    }
    const data = await response.json();
    songs.value = data.tracks || [];
    error.value = null;
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching songs:", err);
    console.error("Full error:", err);
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingSong.value = null;
  formData.value = { name: "", path: "" };
  showAddModal.value = true;
};

const handleEdit = (song) => {
  editingSong.value = song;
  formData.value = { name: song.name, path: song.path };
  showAddModal.value = true;
};

const handleDelete = async (songId) => {
  if (!confirm("Are you sure you want to delete this song?")) return;

  try {
    const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete song");
    await fetchSongs();
  } catch (err) {
    alert("Error deleting song: " + err.message);
  }
};

const handleSubmit = async () => {
  try {
    const url = editingSong.value
      ? `${API_BASE_URL}/songs/${editingSong.value.id}`
      : `${API_BASE_URL}/songs`;
    const method = editingSong.value ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) throw new Error("Failed to save song");
    showAddModal.value = false;
    await fetchSongs();
  } catch (err) {
    alert("Error saving song: " + err.message);
  }
};

onMounted(fetchSongs);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Songs Management</h1>
      <button
        @click="handleAdd"
        class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        <span>Add Song</span>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-semibold">Error: {{ error }}</p>
      <p class="text-sm mt-2">Troubleshooting steps:</p>
      <ul class="text-sm mt-1 list-disc list-inside">
        <li>Make sure your backend server is running: <code class="bg-red-200 px-1 rounded">cd backend && npm run dev</code></li>
        <li>Check if the server is accessible at <code class="bg-red-200 px-1 rounded">http://localhost:3000</code></li>
        <li>Verify the artist.json file exists at <code class="bg-red-200 px-1 rounded">music-player/src/artist.json</code></li>
        <li>Check the browser console for more details</li>
      </ul>
    </div>

    <!-- Songs Table -->
    <div v-if="!loading">
      <DataTable
        title="All Songs"
        :headers="tableHeaders"
        :data="songs"
      >
        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <button
              @click="handleEdit(row)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit"
            >
              <PencilIcon class="w-5 h-5" />
            </button>
            <button
              @click="handleDelete(row.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingSong ? "Edit Song" : "Add New Song" }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Song Name
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              File Path
            </label>
            <input
              v-model="formData.path"
              type="text"
              required
              placeholder="/songs/song.mp3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ editingSong ? "Update" : "Add" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

