<script setup>
import { computed, onMounted, watch, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useMusicStore, URL } from "@/stores/song";
import { slugify } from "@/utils/slugify";
import Hero from "@/components/Hero.vue";

const route = useRoute();
const router = useRouter();
const musicStore = useMusicStore();
const { artists, loading, error, currentTrack, isPlaying } =
  storeToRefs(musicStore);
const audioElement = ref(null);

const flattenAlbums = computed(() =>
  artists.value.flatMap((artist, artistIdx) =>
    (artist.albums || []).map((album, albumIdx) => {
      const cover = album.albumCover?.startsWith("http")
        ? album.albumCover
        : `${URL}${album.albumCover}`;
      return {
        ...album,
        artistName: artist.artistName,
        artistSlug: slugify(artist.artistName || `artist-${artistIdx}`),
        albumSlug: slugify(album.name || `album-${albumIdx}`),
        cover,
      };
    })
  )
);

const currentAlbum = computed(() =>
  flattenAlbums.value.find(
    (album) =>
      album.artistSlug === route.params.artistSlug &&
      album.albumSlug === route.params.albumSlug
  )
);

const tracks = computed(() => currentAlbum.value?.tracks || []);

const totalDuration = computed(() => {
  const totalMinutes = tracks.value.length * 3; // Rough estimate until durations exist
  return `${totalMinutes} min`;
});

const coverImage = computed(() => currentAlbum.value?.cover);

onMounted(async () => {
  if (!artists.value.length && !loading.value) {
    await musicStore.fetchArtists();
  }
  if (!loading.value && !currentAlbum.value) {
    router.replace({ name: "discography" });
  }
});

watch(
  () => ({
    loading: loading.value,
    album: currentAlbum.value,
  }),
  ({ loading, album }) => {
    if (!loading && !album) {
      router.replace({ name: "discography" });
    }
  },
  { immediate: true }
);

const goBack = () => router.push({ name: "discography" });

const playTrack = async (track) => {
  musicStore.setCurrentTrack(
    track,
    currentAlbum.value?.artistName,
    currentAlbum.value
  );
  await nextTick();
  if (audioElement.value) {
    audioElement.value.play().catch((err) => console.error("Play error:", err));
  }
};

watch(isPlaying, (playing) => {
  if (!audioElement.value) return;
  if (playing) {
    audioElement.value.play().catch((err) => console.error("Play error:", err));
  } else {
    audioElement.value.pause();
  }
});

watch(currentTrack, () => {
  if (audioElement.value && currentTrack.value) {
    audioElement.value.src = `${URL}${currentTrack.value.path}`;
    if (isPlaying.value) {
      nextTick(() => {
        audioElement.value
          ?.play()
          .catch((err) => console.error("Play error:", err));
      });
    }
  }
});
</script>

<template>
  <Hero :title="currentAlbum ? currentAlbum.name : ''" />
  <div class="album-detail">
    <div class="album-hero" :class="{ skeleton: !currentAlbum && loading }">
      <button class="back-btn" type="button" @click="goBack">
        ← Discography
      </button>

      <div v-if="currentAlbum" class="hero-content">
        <div class="hero-cover">
          <img :src="coverImage" :alt="currentAlbum.name" />
        </div>
        <div class="hero-meta">
          <p class="eyebrow">Playlist</p>
          <h1>{{ currentAlbum.name }}</h1>
          <p class="description">
            {{ currentAlbum.artistName }} · Released
            {{ currentAlbum.releaseYear || "—" }}
          </p>
          <div class="stats">
            <span>{{ currentAlbum.artistName }}</span>
            <span>•</span>
            <span>{{ tracks.length }} songs</span>
            <span>•</span>
            <span>{{ totalDuration }}</span>
          </div>
        </div>
      </div>
      <div v-else class="hero-content">
        <p v-if="loading" class="state">Loading album…</p>
        <p v-else-if="error" class="state error">{{ error }}</p>
        <p v-else class="state error">Album not found.</p>
      </div>
    </div>

    <div class="tracklist" v-if="currentAlbum">
      <div class="tracklist-header">
        <div>#</div>
        <div>Title</div>
        <div>Artist</div>
        <div class="duration">
          <i class="ti-time" aria-hidden="true"></i>
        </div>
      </div>

      <div
        v-for="(track, index) in tracks"
        :key="track.id || index"
        class="track-row"
        :class="{ active: currentTrack?.id === track.id }"
        @click="playTrack(track)"
      >
        <div class="track-number">{{ index + 1 }}</div>
        <div class="track-title">{{ track.name }}</div>
        <div>{{ currentAlbum.artistName }}</div>
        <div class="duration">
          {{ isPlaying && currentTrack?.id === track.id ? "▶" : "" }}
        </div>
      </div>

      <!-- Hidden audio element -->
      <audio
        ref="audioElement"
        @play="musicStore.isPlaying = true"
        @pause="musicStore.isPlaying = false"
        @ended="
          () => {
            const currentIndex = tracks.findIndex(
              (t) => t.id === currentTrack.id
            );
            if (currentIndex < tracks.length - 1) {
              playTrack(tracks[currentIndex + 1]);
            }
          }
        "
      />
    </div>
  </div>
</template>

<style scoped>
.album-detail {
  min-height: 100vh;
  background: #fff;
  color: #0f172a;
}

.album-hero {
  background: linear-gradient(135deg, #f5f7fa, #ffffff);
  padding: 60px 10vw 40px;
  position: relative;
}

.back-btn {
  background: transparent;
  border: none;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
}

.back-btn:hover {
  text-decoration: underline;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-cover {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
}

.hero-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-meta h1 {
  font-size: clamp(36px, 4vw, 64px);
  margin-bottom: 16px;
}

.hero-meta .eyebrow {
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 1.4px;
  color: #6b7280;
  margin: 0 0 6px;
}

.hero-meta .description {
  font-size: 16px;
  color: #4b5563;
}

.stats {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  font-weight: 500;
}

.tracklist {
  padding: 40px 10vw 100px;
}

.tracklist-header,
.track-row {
  display: grid;
  grid-template-columns: 40px 1fr 1fr 60px;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}

.tracklist-header {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #94a3b8;
}

.track-row .track-title {
  font-weight: 600;
  color: #111827;
}

.track-row:hover {
  background: #f9fafb;
  cursor: pointer;
}

.track-row.active {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding-left: 12px;
}

.track-row.active .track-title {
  color: #2563eb;
  font-weight: 700;
}

.duration {
  text-align: right;
}

.state {
  color: #334155;
}

.state.error {
  color: #dc2626;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-cover {
    width: 180px;
    height: 180px;
  }

  .tracklist-header,
  .track-row {
    grid-template-columns: 30px 1fr 100px 40px;
    font-size: 14px;
  }
}
</style>
