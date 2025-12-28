<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";

const URL = "http://localhost:3000";
const userStore = useUserStore();
const { currentUserName, currentUserRole, login } = storeToRefs(userStore);
const router = useRouter();

const email = ref("");
const password = ref("");
const submitting = ref(false);

// Tách riêng biến lỗi cho từng trường
const errorEmail = ref(null);
const errorPassword = ref(null);
const generalError = ref(null);

async function submit(e) {
  e.preventDefault();

  // 1. Reset toàn bộ lỗi trước khi gửi request mới
  errorEmail.value = null;
  errorPassword.value = null;
  generalError.value = null;
  submitting.value = true;

  try {
    const response = await fetch(`${URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const result = await response.json();

    // 2. Xử lý các trường hợp lỗi dựa trên Status Code (Logic từ LoginView)
    if (!response.ok) {
      const msg = result.message || "Something went wrong";

      // Trường hợp 404: Email không tồn tại
      if (response.status === 404) {
        errorEmail.value = msg;
      }
      // Trường hợp 401: Sai mật khẩu
      else if (response.status === 401) {
        errorPassword.value = msg;
      }
      // Trường hợp 400: Lỗi Joi Validation (Thiếu trường, sai định dạng...)
      else if (response.status === 400) {
        // Kiểm tra xem nội dung lỗi nhắc đến Email hay Password
        if (msg.toLowerCase().includes("email")) {
          errorEmail.value = msg;
        } else if (msg.toLowerCase().includes("password")) {
          errorPassword.value = msg;
        } else {
          generalError.value = msg; // Lỗi khác
        }
      }
      // Các lỗi 500 hoặc khác
      else {
        generalError.value = msg;
      }

      submitting.value = false;
      return;
    }

    // 3. Đăng nhập thành công
    if (result.success) {
      // Lưu token
      localStorage.setItem("token", result.token);
      
      const username =
        result.user?.username || result.user?.name || result.user?.email || "";
      if (username) userStore.setUser(username);

      // Điều hướng dành riêng cho Admin
      // Có thể thêm logic kiểm tra result.user.role === 'ADMIN' tại đây nếu cần chặt chẽ hơn
      router.push("/admin/songs");
    }
  } catch (err) {
    generalError.value = "Không thể kết nối đến máy chủ.";
    console.error("Login Error:", err);
  } finally {
    submitting.value = false;
  }
}

function handleLogout() {
  try {
    userStore.userLogout();
    email.value = "";
    password.value = "";
    generalError.value = null;
    router.push("/admin");
  } catch (err) {
    console.error("Logout Error:", err);
  }
}
</script>

<template>
  <div class="auth-view container mt-5" style="max-width: 400px">
    <h3 class="text-center mb-4">Admin Login</h3>

    <div
      v-if="generalError"
      class="alert alert-danger text-center p-2 mb-3 small"
    >
      <i class="fa fa-exclamation-triangle me-1"></i> {{ generalError }}
    </div>

    <div v-if="login" class="text-center mb-4">
      <div class="card p-4">
        <h4 class="mb-2">Welcome {{ currentUserName }} to Music Admin</h4>
        <p class="text-muted">
          Role: <strong>{{ currentUserRole || "USER" }}</strong>
        </p>
        <button class="btn btn-outline-danger mt-3" @click="handleLogout">
          Logout
        </button>
      </div>
    </div>

    <form v-if="!login" @submit="submit">
      <div class="mb-3">
        <label class="form-label">Email Address</label>
        <input
          v-model="email"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errorEmail }"
          @input="errorEmail = null"
          placeholder="admin@example.com"
        />
        <div v-if="errorEmail" class="invalid-feedback d-block text-start">
          {{ errorEmail }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errorPassword }"
          @input="errorPassword = null"
          placeholder="••••••"
        />
        <div v-if="errorPassword" class="invalid-feedback d-block text-start">
          {{ errorPassword }}
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="remember" />
          <label class="form-check-label" for="remember">Remember me</label>
        </div>
        <a href="#" class="text-decoration-none">Forgot?</a>
      </div>

      <button
        :disabled="submitting"
        class="btn btn-primary w-100"
        type="submit"
      >
        <span v-if="!submitting">Login as Admin</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-1"></span> Signing
          in...
        </span>
      </button>
    </form>

    <p class="text-center mt-3">
      <RouterLink to="/auth/login" class="text-decoration-none"
        >Back to User Login</RouterLink
      >
      <br />
      <RouterLink to="/admin/register" class="text-decoration-none"
        >Register</RouterLink
      >
    </p>
  </div>
</template>

<style scoped>
.auth-view h3 {
  font-weight: 700;
  color: #2c3e50;
}
.auth-view .form-label {
  font-size: 0.95rem;
}

/* --- Logic CSS hiển thị lỗi giống LoginView --- */
.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5zM6 8.2a.3.3 0 000 .6.3.3 0 000-.6z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  font-size: 0.875em;
  color: #dc3545;
  margin-top: 0.25rem;
}
</style>