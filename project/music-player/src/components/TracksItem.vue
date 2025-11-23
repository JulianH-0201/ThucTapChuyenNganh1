<script setup>
import { defineProps } from "vue";

const props = defineProps({
  track: {
    type: Object,
    default: () => ({
      title: "Unknown",
      artist: "",
      src: "",
      img: "/img/music_man/1.png",
    }),
  },
});

</script>

<template>
  <div class="col-xl-9 col-md-9">
    <div class="music_field">
      <div class="thumb">
        <img :src="props.track.img" alt="" />
      </div>
      <div class="audio_name">
        <div class="name">
          <h4>{{ props.track.title }}</h4>
          <p>{{ props.track.artist }}</p>
        </div>
        <audio preload="auto" controls>
          <source :src="props.track.src" />
        </audio>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-md-3">
    <div class="music_btn">
      <a href="#" class="boxed-btn">buy album</a>
    </div>
  </div>
</template>
