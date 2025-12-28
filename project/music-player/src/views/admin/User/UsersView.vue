<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const currentPage = ref(1);
const entriesPerPage = ref(10);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 1. Lấy token đã lưu từ localStorage
    const token = localStorage.getItem("token");

    // 2. Kiểm tra nếu không có token thì báo lỗi ngay lập tức
    if (!token) {
      throw new Error(
        "Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập"
      );
    }

    const res = await fetch("http://localhost:3000/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 3. Gửi token lên Server để xác thực và phân quyền
        Authorization: token,
      },
    });

    // 4. Kiểm tra mã phản hồi từ server
    if (res.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn.");
    }
    if (res.status === 403) {
      throw new Error("Bạn không có quyền truy cập vào danh sách người dùng.");
    }
    if (!res.ok) throw new Error("Failed to load users");

    users.value = await res.json();
  } catch (err) {
    error.value = err.message || "Failed to load users";
    console.error("Fetch Users Error:", err);
  } finally {
    loading.value = false;
  }
};

const filtered = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u._id || "").toString().includes(q)
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

onMounted(fetchUsers);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">All Users</h2>
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
            placeholder="Search users..."
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
                <th class="px-4 py-3">ID</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in paginated" :key="u._id">
                <td class="px-4 py-3">{{ u._id }}</td>
                <td class="px-4 py-3">{{ u.username || "—" }}</td>
                <td class="px-4 py-3">
                  <code class="text-muted">{{ u.email }}</code>
                </td>
                <td class="px-4 py-3">{{ u.role }}</td>
                <td class="px-4 py-3">
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-warning"
                      title="Change Role"
                      @click="router.push(`/admin/users/${u._id}/change-role`)"
                    >
                      <i class="fa fa-user-shield me-1"></i>Change Role
                    </button>
                    <!-- <button
                      class="btn btn-sm btn-outline-danger"
                      title="Delete"
                    >
                      <i class="fa fa-trash me-1"></i>Delete
                    </button> -->
                  </div>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">
                  No users found
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
