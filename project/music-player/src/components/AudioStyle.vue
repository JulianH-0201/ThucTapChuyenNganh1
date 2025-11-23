<script>
import { ref } from "vue";
defineProps: ({
  imgSource: ref(""),
  songName: ref(""),
  audioSource: ref(""),
  
});
</script>

<template>
  <div class="row align-items-center justify-content-center mb-20 shadow p-3 bg-white rounded">
    <div class="col-xl-10">
      <div class="row align-items-center">
        <div class="col-xl-9 col-md-9">
          <div class="music_field">
            <div class="thumb">
              <img src="/img/music_man/1.png" alt="Song_picture" />
            </div>
            <div class="audio_name">
              <div class="name">
                <h4>Frando Kally</h4>
                <p>10 November, 2019</p>
              </div>
              <audio preload="auto" controls>
                <source src="https://www.w3schools.com/html/horse.mp3" />
              </audio>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-3">
          <div class="music_btn">
            <a href="#" class="boxed-btn">buy albam</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
