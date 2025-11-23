<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const submitting = ref(false);

function submit(e) {
  e.preventDefault();
  submitting.value = true;
  // simulate auth delay
  setTimeout(() => {
    submitting.value = false;
    router.push("/");
  }, 700);
}
</script>

<template>
  <div class="auth-view">
    <h3 class="text-center mb-3">Login</h3>
    <p class="text-center text-muted mb-4">Sign in to access your account</p>

    <form @submit="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
        />
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
