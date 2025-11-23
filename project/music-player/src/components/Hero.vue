<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const heroTitle = ref("");

onMounted(() => {
  const route = useRoute();
  if (route.path === "/about") {
    heroTitle.value = "About Me";
  } else if (route.path === "/discography") {
    heroTitle.value = "Discography";
  } else if (route.path === "/contact") {
    heroTitle.value = "Contact Us";
  } else if (route.path === "/contact") {
    heroTitle.value = "Contact Us";
  }
});
</script>

<template>
  <div class="bradcam_area breadcam_bg_2">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="bradcam_text text-center">
            <h3>{{ heroTitle }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
