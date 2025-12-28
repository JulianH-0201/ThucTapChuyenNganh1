<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const URL = "http://localhost:3000";
const router = useRouter();

// Form data
const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const role = ref("ADMIN");
const submitting = ref(false);

const errorUsername = ref(null);
const errorEmail = ref(null);
const errorPassword = ref(null);
const errorPassword2 = ref(null);
const generalError = ref(null);

async function submit(e) {
  e.preventDefault();

  // Reset errors
  errorUsername.value = null;
  errorEmail.value = null;
  errorPassword.value = null;
  errorPassword2.value = null;
  generalError.value = null;

  submitting.value = true;

  try {
    const response = await fetch(`${URL}/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: password2.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400 && result.errors) {
        result.errors.forEach((err) => {
          if (err.field === "username") errorUsername.value = err.message;
          if (err.field === "email") errorEmail.value = err.message;
          if (err.field === "password") errorPassword.value = err.message;
          if (err.field === "confirmPassword")
            errorPassword2.value = err.message;
        });
      } else if (response.status === 409) {
        errorEmail.value = result.message;
      } else {
        generalError.value = result.message || "Registration failed.";
      }
      submitting.value = false;
      return;
    }

    if (result.success) {
      // After registering, send user to admin login page
      alert("Đăng ký thành công! Vui lòng đăng nhập (Admin).");
      router.push("/admin");
    }
  } catch (err) {
    console.error(err);
    generalError.value = "Lỗi kết nối Server. Vui lòng thử lại sau.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-view" style="max-width: 420px; margin: 40px auto">
    <h3 class="text-center mb-3">Admin Register</h3>
    <p class="text-center text-muted mb-4">Create a new admin account</p>

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
        <div v-if="errorEmail" class="invalid-feedback">{{ errorEmail }}</div>
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
        <span v-if="!submitting">Create admin account</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-1"></span>
          Creating...
        </span>
      </button>
    </form>

    <p class="text-center mt-3">
      Already have an admin account?
      <RouterLink to="/admin" class="text-decoration-none">Login</RouterLink>
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
}
.invalid-feedback {
  display: block;
}
</style>
