<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const URL = "http://localhost:3000";
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const submitting = ref(false);

async function submit(e) {
  e.preventDefault();
  //check passwords match
  if (password.value !== password2.value) {
    alert("Passwords do not match!");
    return;
  }

  submitting.value = true;

  try {
    const response = await fetch(`${URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //add name field
        username: name.value,
        email: email.value,
        password: password.value,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Register successful!");
      //move to login page
      router.push("/auth/login");
    } else {
      alert("Register failed: " + (result.message || "Unknown error"));
    }
  } catch (error) {
    alert("Error: " + error);
  }

  submitting.value = false;
}
</script>

<template>
  <div class="auth-view">
    <h3 class="text-center mb-3">Register</h3>
    <p class="text-center text-muted mb-4">Create a new account</p>

    <form @submit="submit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="name" type="text" class="form-control" required />
      </div>

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

      <div class="mb-3">
        <label class="form-label">Confirm password</label>
        <input
          v-model="password2"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button
        :disabled="submitting"
        class="btn btn-primary w-100"
        type="submit"
      >
        <span v-if="!submitting">Create account</span>
        <span v-else>Creating...</span>
      </button>
    </form>

    <p class="text-center mt-3">
      Already have an account?
      <RouterLink to="/auth/login" class="text-decoration-none"
        >Login</RouterLink
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
