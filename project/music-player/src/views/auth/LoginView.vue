<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";

const URL = "http://localhost:3000";
const userStore = useUserStore();
const { currentUserName, login } = storeToRefs(userStore);
const router = useRouter();

const email = ref("");
const password = ref("");
const submitting = ref(false);

// Tách riêng biến lỗi cho từng trường
const errorEmail = ref(null);
const errorPassword = ref(null);
const generalError = ref(null); // Lỗi hệ thống hoặc lỗi không xác định

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

    // 2. Xử lý các trường hợp lỗi dựa trên Status Code
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
          generalError.value = msg; // Lỗi lạ khác
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
      if (userStore.setCurrentUser) {
        userStore.setCurrentUser(result.user);
      } else {
        currentUserName.value = result.user.username;
        login.value = true;
      }
      localStorage.setItem("token", result.token);
      router.push("/");
    }
  } catch (error) {
    console.error(error);
    generalError.value = "Không thể kết nối đến Server.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-view">
    <h3 class="text-center mb-3">Login</h3>
    <p class="text-center text-muted mb-4">Sign in to access your account</p>

    <div v-if="generalError" class="alert alert-danger text-center p-2 mb-3 small">
      <i class="fa fa-exclamation-triangle me-1"></i> {{ generalError }}
    </div>

    <form @submit="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errorEmail }"
          @input="errorEmail = null"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
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
        <span v-if="!submitting">Login</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-1"></span> Signing in...
        </span>
      </button>
    </form>

    <p class="text-center mt-3">
      Don't have an account?
      <RouterLink to="/auth/register" class="text-decoration-none">Register</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-view h3 {
  font-weight: 700;
}
.auth-view .form-label {
  font-size: 0.95rem;
}

/* Tùy chỉnh hiển thị input khi lỗi */
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