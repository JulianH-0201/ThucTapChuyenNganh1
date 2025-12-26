<script setup>
import Hero from '@/components/Hero.vue';
</script>

<template>
  <!-- bradcam_area  -->
  <Hero />
  <!--/ bradcam_area  -->

  <!-- about_area  -->
  <div class="about_area">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-xl-5 col-md-6">
          <div class="about_thumb">
            <img class="img-fluid" src="/img/about/about_1.png" alt="" />
          </div>
        </div>
        <div class="col-xl-7 col-md-6">
          <div class="about_info">
            <h3>Musico</h3>
            <p>
              Welcome to Musico, your ultimate destination for music lovers! Our
              platform is dedicated to bringing you the best in music, from
              timeless classics to the latest hits. Whether you're an avid
              listener or a casual fan, Musico offers a seamless and immersive
              experience to explore, discover, and enjoy your favorite tunes.
            </p>
            <div class="signature">
              <img src="/img/about/signature.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--/ about_area  -->
  <div class="singer_video">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10">
          <div class="image">
            <img src="/img/about/singer.png" alt="" />
            <div class="video_btn">
              <a
                class="popup-video"
                href="https://www.youtube.com/watch?v=Hzmp3z6deF8"
                ><i class="fa fa-play"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- gallery -->
  <div class="gallery_area">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="section_title text-center mb-65">
            <h3>Image Galleries</h3>
          </div>
        </div>
      </div>
      <div class="row grid">
        <div class="col-xl-5 col-lg-5 grid-item cat1 col-md-6">
          <div class="single-gallery mb-30">
            <div class="portfolio-img">
              <img src="/img/gallery/1.png" alt="" />
            </div>
            <div class="gallery_hover">
              <a class="popup-image" href="img/gallery/1.png">
                <i class="ti-plus"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-7 col-lg-7 grid-item cat3 cat4 col-md-6">
          <div class="single-gallery mb-30">
            <div class="portfolio-img">
              <img src="/img/gallery/2.png" alt="" />
            </div>
            <div class="gallery_hover">
              <a class="popup-image" href="img/gallery/2.png">
                <i class="ti-plus"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-6 grid-item cat4 col-md-6">
          <div class="single-gallery mb-30">
            <div class="portfolio-img">
              <img src="/img/gallery/3.png" alt="" />
            </div>
            <div class="gallery_hover">
              <a class="popup-image" href="img/gallery/3.png">
                <i class="ti-plus"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-6 grid-item cat2 col-md-6">
          <div class="single-gallery mb-30">
            <div class="portfolio-img">
              <img src="/img/gallery/4.png" alt="" />
            </div>
            <div class="gallery_hover">
              <a class="popup-image" href="img/gallery/4.png">
                <i class="ti-plus"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-6 grid-item cat2 col-md-6">
          <div class="single-gallery mb-30">
            <div class="portfolio-img">
              <img src="/img/gallery/5.png" alt="" />
            </div>
            <div class="gallery_hover">
              <a class="popup-image" href="img/gallery/5.png">
                <i class="ti-plus"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--/ gallery -->

  <!-- contact_rsvp -->

  <!--/ contact_rsvp -->
</template>
