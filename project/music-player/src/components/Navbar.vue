<script setup>
import { RouterLink } from "vue-router";

RouterLink;
</script>

<template>
  <header>
    <div class="header-area">
      <div id="sticky-header" class="main-header-area">
        <div class="container-fluid">
          <div class="header_bottom_border">
            <div class="row align-items-center">
              <div class="col-xl-3 col-lg-2">
                <div class="logo">
                  <RouterLink to="/">
                    <img src="/img/logo.png" alt="" />
                  </RouterLink>
                </div>
              </div>
              <div class="col-xl-6 col-lg-7">
                <div class="main-menu d-none d-lg-block">
                  <nav>
                    <ul id="navigation">
                      <li>
                        <RouterLink to="/" class="active text-decoration-none"
                          >home</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="/about" class="text-decoration-none"
                          >About</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink
                          to="/discography"
                          class="text-decoration-none"
                          >Discography</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink to="#" class="text-decoration-none"
                          >blog <i class="ti-angle-down"></i
                        ></RouterLink>
                        <ul class="submenu">
                          <li>
                            <RouterLink to="/blog" class="text-decoration-none"
                              >blog</RouterLink
                            >
                          </li>
                          <li>
                            <RouterLink
                              to="/single-blog"
                              class="text-decoration-none"
                              >single-blog
                            </RouterLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <RouterLink to="/contact" class="text-decoration-none"
                          >Contact</RouterLink
                        >
                      </li>
                      <!-- Login/Register for small screens: shown only when menu is collapsed -->
                      <li class="d-block d-lg-none mt-2">
                        <RouterLink
                          to="/auth/login"
                          class="text-decoration-none text-white me-2"
                          >Login</RouterLink
                        >
                        <span class="text-white mx-1">|</span>
                        <RouterLink
                          to="/auth/register"
                          class="text-decoration-none text-white ms-2"
                          >Register</RouterLink
                        >
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 d-none d-lg-block">
                <div class="main-menu d-none d-lg-block">
                  <nav>
                    <ul class="d-flex justify-content-end align-items-center mb-0 list-unstyled">
                      <li>
                        <RouterLink
                          to="/auth/login"
                          class="text-decoration-none text-white me-3"
                        >
                          Login
                        </RouterLink>
                      </li>
                      <li>
                        <span class="text-white">|</span>
                      </li>
                      <li>
                        <RouterLink
                          to="/auth/register"
                          class="text-decoration-none text-white ms-3"
                        >
                          Register
                        </RouterLink>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="col-12">
                <div class="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
