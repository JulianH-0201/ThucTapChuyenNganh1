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

// Tách riêng biến lỗi cho từng trường (Đã apply từ LoginView)
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

    // 2. Xử lý các trường hợp lỗi dựa trên Status Code (Apply logic từ LoginView)
    if (!response.ok) {
      if (response.status === 400) {
        // Lỗi dữ liệu đầu vào (ví dụ: email không đúng định dạng, thiếu trường...)
        if (result.errors) {
          errorEmail.value = result.errors.email;
          errorPassword.value = result.errors.password;
        } else {
          generalError.value =
            result.message || "Thông tin đăng nhập không hợp lệ.";
        }
      } else if (response.status === 401) {
        // Sai email hoặc mật khẩu
        generalError.value = "Email hoặc mật khẩu không chính xác.";
      } else {
        // Các lỗi server khác
        generalError.value = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
      }
      return;
    }

    // 3. Đăng nhập thành công
    // Lưu token (đã có tiền tố "Bearer <token>" từ server)
    localStorage.setItem("token", result.token);
    const username =
      result.user?.username || result.user?.name || result.user?.email || "";
    if (username) userStore.setUser(username);
    // Chuyển hướng về trang quản trị (sử dụng route tồn tại)
    router.push("/admin/songs");
  } catch (err) {
    generalError.value = "Không thể kết nối đến máy chủ.";
    console.error("Login Error:", err);
  } finally {
    submitting.value = false;
  }
}

function handleLogout() {
  // Clear store and token, then show login form
  try {
    userStore.userLogout();
    email.value = "";
    password.value = "";
    generalError.value = null;
    // stay on the same page (admin login) to allow login again
    router.push("/admin");
  } catch (err) {
    console.error("Logout Error:", err);
  }
}
</script>

<template>
  <div class="auth-view container mt-5" style="max-width: 400px">
    <h3 class="text-center mb-4">Admin Login</h3>

    <div v-if="generalError" class="alert alert-danger" role="alert">
      {{ generalError }}
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
          type="email"
          :class="['form-control', { 'is-invalid': errorEmail }]"
          placeholder="admin@example.com"
          required
        />
        <div v-if="errorEmail" class="invalid-feedback">{{ errorEmail }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          :class="['form-control', { 'is-invalid': errorPassword }]"
          placeholder="••••••"
          required
        />
        <div v-if="errorPassword" class="invalid-feedback">
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
.is-invalid {
  border-color: #dc3545;
}
</style>
