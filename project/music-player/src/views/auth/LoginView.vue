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
const errorEmail = ref(null);
const errorPassword = ref(null);
async function submit(e) {
  e.preventDefault();
  submitting.value = true;

  try {
    const response = await fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const result = await response.json();

    if (result.success && result.message === "Login successful") {
      currentUserName.value = result.user.username;
      login.value = true;
      localStorage.setItem("user", JSON.stringify(result.user));
      alert("Login successful!");
      router.push("/");
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (error) {
    alert("Error: " + error);
  }

  submitting.value = false;
}

function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    errorEmail.value = "Please enter a valid email address.";
  } else {
    errorEmail.value = null;
  }
}

function validatePassword() {
  if (password.value.length < 6) {
    errorPassword.value = "Password must be at least 6 characters long.";
  } else {
    errorPassword.value = null;
  }
}
</script>

<template>
  <div class="auth-view">
    <h3 class="text-center mb-3">Login</h3>
    <p class="text-center text-muted mb-4">Sign in to access your account</p>

    <form @submit="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          @blur="validateEmail"
          required
        />
        <p v-if="errorEmail" class="text-danger">{{ errorEmail }}</p>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          @blur="validatePassword"
          required
        />
        <p v-if="errorPassword" class="text-danger">{{ errorPassword }}</p>
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
        <span v-else>Signing in...</span>
      </button>
    </form>

    <p class="text-center mt-3">
      Don't have an account?
      <RouterLink to="/auth/register" class="text-decoration-none"
        >Register</RouterLink
      >
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
</style>
