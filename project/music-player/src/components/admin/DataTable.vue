<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Data Table",
  },
  headers: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortColumn = ref("");
const sortDirection = ref("asc");

const filteredData = computed(() => {
  let result = props.data;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query)
      )
    );
  }

  // Sort
  if (sortColumn.value) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortColumn.value];
      const bVal = b[sortColumn.value];
      if (sortDirection.value === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  return result;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const handleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <div class="flex items-center space-x-4">
          <label class="text-sm text-gray-600">
            Show
            <select
              v-model="itemsPerPage"
              class="mx-2 border border-gray-300 rounded px-2 py-1"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            entries
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search:"
            class="border border-gray-300 rounded px-3 py-1 text-sm"
          />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="header.key !== 'actions' && handleSort(header.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ header.label }}</span>
                <span v-if="sortColumn === header.key && header.key !== 'actions'">
                  {{ sortDirection === "asc" ? "↑" : "↓" }}
                </span>
              </div>
            </th>
            <th
              v-if="$slots.actions"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in paginatedData"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <template v-if="header.format === 'currency'">
                {{ formatCurrency(row[header.key]) }}
              </template>
              <template v-else>
                {{ row[header.key] }}
              </template>
            </td>
            <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-sm">
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="headers.length + ($slots.actions ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of
        {{ filteredData.length }} entries
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded text-sm',
            currentPage === page
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>

    <div class="px-6 py-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">Updated yesterday at 11:59 PM</p>
    </div>
  </div>
</template>

