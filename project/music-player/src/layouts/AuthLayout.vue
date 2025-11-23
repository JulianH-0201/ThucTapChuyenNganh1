<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <div class="navbar-wrapper">
      <Navbar />
    </div>
    <main class="auth-main">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6">
            <div class="auth-card">
              <RouterView />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.navbar-wrapper {
  background: #001d38;
  padding: 40px 0;
}
.auth-main {
  padding: 60px 0;
  background: #f8f9fb;
  min-height: calc(100vh - 200px);
}
.auth-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 6px 18px rgba(23, 24, 27, 0.06);
}
</style>
