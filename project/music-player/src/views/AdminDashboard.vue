<script setup>
import { ref, onMounted } from "vue";
import BarChart from "@/components/admin/BarChart.vue";
import PieChart from "@/components/admin/PieChart.vue";
import DataTable from "@/components/admin/DataTable.vue";

const API_BASE_URL = "http://localhost:3000/api/admin";

const stats = ref(null);
const songs = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch dashboard statistics
const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    stats.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching stats:", err);
  }
};

// Fetch songs
const fetchSongs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/songs`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to fetch songs`);
    }
    const data = await response.json();
    songs.value = data.tracks || [];
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching songs:", err);
    console.error("Full error:", err);
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchStats(), fetchSongs()]);
  loading.value = false;
});

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "name", label: "Song Name" },
  { key: "path", label: "File Path" },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p class="font-semibold">Error: {{ error }}</p>
      <p class="text-sm mt-2">Troubleshooting steps:</p>
      <ul class="text-sm mt-1 list-disc list-inside">
        <li>Make sure your backend server is running: <code class="bg-red-200 px-1 rounded">cd backend && npm run dev</code></li>
        <li>Check if the server is accessible at <code class="bg-red-200 px-1 rounded">http://localhost:3000</code></li>
        <li>Verify the artist.json file exists at <code class="bg-red-200 px-1 rounded">music-player/src/artist.json</code></li>
        <li>Check the browser console for more details</li>
      </ul>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="stats">
      <!-- Top Section: Charts and Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Bar Chart -->
        <div class="lg:col-span-2">
          <BarChart :data="stats.monthlyPlays?.map(m => m.plays) || []" />
        </div>

        <!-- Stats Cards -->
        <div class="space-y-6">
          <!-- Statistics -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="space-y-4">
              <div>
                <p class="text-2xl font-bold text-blue-600">{{ stats.totalSongs }}</p>
                <p class="text-sm text-gray-600">Total Songs</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600">{{ stats.totalAlbums }}</p>
                <p class="text-sm text-gray-600">Total Albums</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600">{{ stats.releaseYear }}</p>
                <p class="text-sm text-gray-600">Release Year</p>
              </div>
            </div>
          </div>

          <!-- Pie Chart -->
          <PieChart />
        </div>
      </div>

      <!-- Album Info Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-6">
          <img
            :src="stats.albumCover || '/images/albumCovers/DiariesOfAHero.png'"
            :alt="stats.albumName"
            class="w-32 h-32 object-cover rounded-lg"
          />
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ stats.albumName }}</h2>
            <p class="text-gray-600 mt-2">Release Year: {{ stats.releaseYear }}</p>
            <p class="text-gray-600">Total Tracks: {{ stats.totalSongs }}</p>
          </div>
        </div>
      </div>

      <!-- Songs Table -->
      <DataTable
        title="All Songs"
        :headers="tableHeaders"
        :data="songs"
      />

      <!-- Footer -->
      <div class="text-center text-gray-500 text-sm py-4">
        Copyright © Music Player Admin 2024
      </div>
    </template>
  </div>
</template>
