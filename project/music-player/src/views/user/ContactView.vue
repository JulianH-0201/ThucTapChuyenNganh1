<script setup>
import Hero from "@/components/Hero.vue";
import { ref } from "vue";

// Reactive form data
const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  // Here you would typically:
  // 1. Validate form data
  // 2. Send to your backend API
  // 3. Handle response
  console.log("Form submitted:", formData.value);

  // Example with fetch API instead of PHP
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      alert("Message sent successfully!");
      // Reset form
      Object.keys(formData.value).forEach((key) => {
        formData.value[key] = "";
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Placeholder functions for focus/blur
const handleFocus = (field) => {
  // You can implement custom focus logic here
};

const handleBlur = (field) => {
  // You can implement custom blur logic here
};
</script>

<template>
    <Hero />

  <section class="contact-section section_padding">
    <div class="container">
      <div class="d-none d-sm-block mb-5 pb-4">
        <div id="map" style="height: 480px">
          <!-- Consider using a Vue map component like vue3-google-map -->
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h2 class="contact-title">Get in Touch</h2>
        </div>
        <div class="col-lg-8">
          <form
            class="form-contact contact_form"
            @submit="handleSubmit"
            novalidate
          >
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <textarea
                    class="form-control w-100"
                    v-model="formData.message"
                    cols="30"
                    rows="9"
                    placeholder="Enter Message"
                    @focus="handleFocus('message')"
                    @blur="handleBlur('message')"
                  ></textarea>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input
                    class="form-control"
                    v-model="formData.name"
                    type="text"
                    placeholder="Enter your name"
                    @focus="handleFocus('name')"
                    @blur="handleBlur('name')"
                  />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input
                    class="form-control"
                    v-model="formData.email"
                    type="email"
                    placeholder="Enter email address"
                    @focus="handleFocus('email')"
                    @blur="handleBlur('email')"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <input
                    class="form-control"
                    v-model="formData.subject"
                    type="text"
                    placeholder="Enter Subject"
                    @focus="handleFocus('subject')"
                    @blur="handleBlur('subject')"
                  />
                </div>
              </div>
            </div>
            <div class="form-group mt-3">
              <button
                type="submit"
                class="button button-contactForm btn_4 boxed-btn"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
        <div class="col-lg-4">
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-home"></i></span>
            <div class="media-body">
              <h3>Buttonwood, California.</h3>
              <p>Rosemead, CA 91770</p>
            </div>
          </div>
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-tablet"></i></span>
            <div class="media-body">
              <h3>00 (440) 9865 562</h3>
              <p>Mon to Fri 9am to 6pm</p>
            </div>
          </div>
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-email"></i></span>
            <div class="media-body">
              <h3>support@colorlib.com</h3>
              <p>Send us your query anytime!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
