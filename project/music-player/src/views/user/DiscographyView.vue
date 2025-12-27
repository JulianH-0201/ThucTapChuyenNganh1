<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import Hero from "@/components/Hero.vue";
import { useMusicStore, URL } from "@/stores/song";
import { slugify } from "@/utils/slugify";

const router = useRouter();
const musicStore = useMusicStore();
const { albums, loading, error } = storeToRefs(musicStore);

onMounted(() => {
  if (!albums.value.length && !loading.value) {
    musicStore.fetchAlbums();
  }
});

const albumsList = computed(() =>
  albums.value.map((album, idx) => ({
    ...album,
    artistName: album.artist?.artistName || "—",
    key: album._id || idx,
    cover: album.albumCover?.startsWith("http")
      ? album.albumCover
      : `${URL}${album.albumCover}`,
    artistSlug: slugify(album.artist?.artistName || `artist-${idx}`),
    albumSlug: slugify(album.name || `album-${idx}`),
  }))
);

const statusMessage = computed(() => {
  if (loading.value) {
    return { type: "info", text: "Loading albums…" };
  }
  if (error.value) {
    return { type: "error", text: error.value };
  }
  if (!albums.value.length) {
    return { type: "info", text: "No albums available yet." };
  }
  return null;
});

const openAlbum = (album) => {
  router.push({
    name: "album-detail",
    params: {
      artistSlug: album.artistSlug,
      albumSlug: album.albumSlug,
    },
  });
};
</script>

<template>
  <Hero />

  <section class="music_area music_gallery inc_padding discography-list">
    <div class="container">
      <div v-if="statusMessage" :class="['state-message', statusMessage.type]">
        {{ statusMessage.text }}
      </div>
      <template v-else>
        <div
          v-for="album in albumsList"
          :key="album.key"
          class="row align-items-center justify-content-center mb-20"
        >
          <div class="col-xl-10">
            <div class="row align-items-center album-row shadow-sm">
              <div class="col-xl-9 col-md-9">
                <div
                  class="music_field album-field"
                  role="button"
                  tabindex="0"
                  @click="openAlbum(album)"
                  @keyup.enter="openAlbum(album)"
                >
                  <div class="thumb">
                    <img :src="album.cover" :alt="album.name" loading="lazy" />
                  </div>
                  <div class="audio_name">
                    <div class="name">
                      <h4>{{ album.name }}</h4>
                      <p>
                        {{ album.artistName }} • {{ album.releaseYear || "—" }}
                      </p>
                      <p>${{ album.price }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-3">
                <div class="music_btn">
                  <a href="#" class="boxed-btn">buy album</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.discography-list {
  background: #fff;
  padding-top: 80px;
  padding-bottom: 100px;
}

.section_title p {
  color: #111;
  margin-top: 12px;
}

.state-message {
  text-align: center;
  color: #111;
  padding: 60px 0;
}

.state-message.error {
  color: #dc2626;
}

.album-row {
  background: #fff;
  border-radius: 16px;
  padding: 20px 10px;
}

.album-field {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.album-field:focus-visible {
  outline: 2px solid #2563eb;
  border-radius: 12px;
  padding: 10px;
}

.album-field .thumb {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
}

.album-field .thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-field .name h4 {
  margin-bottom: 4px;
}

.album-field .name p {
  margin: 0;
  color: #6b7280;
}

.music_btn .boxed-btn {
  width: 100%;
  text-align: center;
}
</style>
