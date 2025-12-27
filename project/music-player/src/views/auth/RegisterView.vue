<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const URL = "http://localhost:3000";
const router = useRouter();

// Dữ liệu Form
const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref(""); // Confirm Password

// Trạng thái submit
const submitting = ref(false);

// Các biến lưu lỗi hiển thị dưới từng ô input
const errorUsername = ref(null);
const errorEmail = ref(null);
const errorPassword = ref(null);
const errorPassword2 = ref(null);
const generalError = ref(null);

async function submit(e) {
  e.preventDefault();

  // 1. Reset toàn bộ lỗi cũ
  errorUsername.value = null;
  errorEmail.value = null;
  errorPassword.value = null;
  errorPassword2.value = null;
  generalError.value = null;

  // --- ĐÃ XÓA PHẦN CHECK THỦ CÔNG TẠI ĐÂY ---
  // Chúng ta tin tưởng hoàn toàn vào Joi Backend

  submitting.value = true;

  try {
    const response = await fetch(`${URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Gửi cả confirmPassword lên để Backend so sánh
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: password2.value, 
      }),
    });

    const result = await response.json();

    // 2. Xử lý lỗi nếu thất bại
    if (!response.ok) {
      // Trường hợp 400: Lỗi Validation từ Joi (Trả về mảng errors)
      if (response.status === 400 && result.errors) {
        // Duyệt qua mảng lỗi để gán vào đúng vị trí
        result.errors.forEach((err) => {
          if (err.field === "username") errorUsername.value = err.message;
          if (err.field === "email") errorEmail.value = err.message;
          if (err.field === "password") errorPassword.value = err.message;
          // Joi trả về lỗi confirmPassword -> Hiển thị nó
          if (err.field === "confirmPassword") errorPassword2.value = err.message;
        });
      }
      // Trường hợp 409: Email đã tồn tại
      else if (response.status === 409) {
        errorEmail.value = result.message;
      }
      // Các lỗi khác (500,...)
      else {
        generalError.value = result.message || "Đăng ký thất bại.";
      }

      submitting.value = false;
      return;
    }

    // 3. Thành công (201)
    if (result.success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/auth/login");
    }
  } catch (error) {
    console.error(error);
    generalError.value = "Lỗi kết nối Server. Vui lòng thử lại sau.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-view">
    <h3 class="text-center mb-3">Register</h3>
    <p class="text-center text-muted mb-4">Create a new account</p>

    <div
      v-if="generalError"
      class="alert alert-danger text-center p-2 mb-3 small"
    >
      <i class="fa fa-exclamation-triangle me-1"></i> {{ generalError }}
    </div>

    <form @submit="submit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errorUsername }"
          @input="errorUsername = null"
          placeholder="Enter username"
        />
        <div v-if="errorUsername" class="invalid-feedback">
          {{ errorUsername }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errorEmail }"
          @input="errorEmail = null"
          placeholder="Enter email address"
        />
        <div v-if="errorEmail" class="invalid-feedback">
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
          placeholder="Enter password"
        />
        <div v-if="errorPassword" class="invalid-feedback">
          {{ errorPassword }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Confirm password</label>
        <input
          v-model="password2"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errorPassword2 }"
          @input="errorPassword2 = null"
          placeholder="Re-enter password"
        />
        <div v-if="errorPassword2" class="invalid-feedback">
          {{ errorPassword2 }}
        </div>
      </div>

      <button
        :disabled="submitting"
        class="btn btn-primary w-100"
        type="submit"
      >
        <span v-if="!submitting">Create account</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-1"></span>
          Creating...
        </span>
      </button>
    </form>

    <p class="text-center mt-3">
      Already have an account?
      <RouterLink to="/auth/login" class="text-decoration-none">
        Login
      </RouterLink>
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
  display: block;
}
</style>