<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["updated"]);

const selectedUser = ref(null);
const newRole = ref("");
const isProcessing = ref(false);
const loading = ref(true);
const error = ref(null);

// Lấy user dựa trên :id trong route bằng cách gọi API danh sách người dùng
const fetchUser = async () => {
  loading.value = true;
  error.value = null;
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Bạn chưa đăng nhập.");

    const res = await fetch("http://localhost:3000/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) throw new Error("Không thể tải danh sách người dùng");

    const users = await res.json();
    const id = route.params.id;
    const user = users.find((u) => u._id === id);

    if (!user) throw new Error("Người dùng không tồn tại");

    selectedUser.value = { ...user };
    newRole.value = user.role;
  } catch (err) {
    error.value = err.message || "Lỗi khi tải người dùng";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id;
  if (id) fetchUser();
});

// Đóng modal và quay về danh sách user
const closeModal = () => {
  selectedUser.value = null;
  router.push("/admin/users");
};

// Hàm lưu thay đổi Role
const saveRole = async () => {
  if (!selectedUser.value) return;

  isProcessing.value = true;
  try {
    const res = await fetch(
      `http://localhost:3000/api/admin/users/${selectedUser.value._id}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ role: newRole.value }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Không thể đổi quyền");

    alert(
      `Đã cập nhật quyền cho ${selectedUser.value.username} thành ${newRole.value}`
    );

    // Phát sự kiện để component cha cập nhật lại giao diện (User.role = newRole.value)
    emit("updated", { id: selectedUser.value._id, role: newRole.value });

    closeModal();
  } catch (err) {
    alert(err.message);
  } finally {
    isProcessing.value = false;
  }
};
</script>
<template>
  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="error" class="alert alert-danger">
    {{ error }}
    <button
      class="btn btn-sm btn-secondary ms-3"
      @click="router.push('/admin/users')"
    >
      Back
    </button>
  </div>

  <div v-else-if="selectedUser">
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg border-0">
          <div class="modal-header bg-warning text-white">
            <h5 class="modal-title">
              <i class="fa fa-user-shield me-2"></i>Change User Role
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body py-4">
            <div class="mb-3">
              <label class="form-label text-muted small fw-bold"
                >User Information</label
              >
              <div class="p-3 bg-light rounded border">
                <p class="mb-1">
                  <strong>Name:</strong> {{ selectedUser.username }}
                </p>
                <p class="mb-0">
                  <strong>Email:</strong> {{ selectedUser.email }}
                </p>
              </div>
            </div>

            <div class="mb-3">
              <label
                for="roleSelect"
                class="form-label text-muted small fw-bold"
                >Select New Role</label
              >
              <select
                id="roleSelect"
                v-model="newRole"
                class="form-select form-select-lg border-warning"
              >
                <option value="USER">USER (Standard Access)</option>
                <option value="ADMIN">ADMIN (Full Access)</option>
              </select>
            </div>
          </div>

          <div class="modal-footer bg-light">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="isProcessing"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-warning px-4"
              @click="saveRole"
              :disabled="isProcessing"
            >
              <span
                v-if="isProcessing"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
