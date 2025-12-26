<script setup>
import { computed, ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useMusicStore, URL } from "@/stores/song";

const musicStore = useMusicStore();
const { currentTrack, isPlaying, currentAlbum } = storeToRefs(musicStore);
const audioRef = ref(null);
const currentTime = ref(0);
const duration = ref(0);

const displayTime = computed(() => formatTime(currentTime.value));
const displayDuration = computed(() => formatTime(duration.value));
const progress = computed(
  () => (currentTime.value / duration.value) * 100 || 0
);

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const togglePlayPause = () => {
  musicStore.isPlaying = !musicStore.isPlaying;
};

const updateTime = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
};

const updateDuration = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
};

const seek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const newTime = percent * duration.value;
  if (audioRef.value) {
    audioRef.value.currentTime = newTime;
  }
};

defineExpose({
  audioRef,
  currentTime,
  duration,
});
</script>

<template>
  <div v-if="currentTrack" class="music-player">
    <div class="player-wrapper">
      <!-- Album Art & Track Info -->
      <div class="player-left">
        <div v-if="currentAlbum" class="player-cover">
          <img
            :src="
              currentAlbum.cover?.startsWith('http')
                ? currentAlbum.cover
                : `${URL}${currentAlbum.cover}`
            "
            :alt="currentAlbum.name"
            class="cover-img"
          />
        </div>
        <div class="player-info">
          <h4 class="track-name">{{ currentTrack.name }}</h4>
          <p class="artist-name">
            {{ currentAlbum?.artistName || "Unknown Artist" }}
          </p>
          <p class="album-name">{{ currentAlbum?.name || "Unknown Album" }}</p>
        </div>
      </div>

      <!-- Player Controls & Progress -->
      <div class="player-center">
        <!-- Controls -->
        <div class="player-controls">
          <button class="control-btn" title="Previous">
            <i class="fa fa-step-backward"></i>
          </button>
          <button
            class="control-btn play-btn"
            @click="togglePlayPause"
            :title="isPlaying ? 'Pause' : 'Play'"
          >
            <i :class="isPlaying ? 'fa fa-pause' : 'fa fa-play'"></i>
          </button>
          <button class="control-btn" title="Next">
            <i class="fa fa-step-forward"></i>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <span class="time">{{ displayTime }}</span>
          <div class="progress-bar" @click="seek">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            <div
              class="progress-handle"
              :style="{ left: progress + '%' }"
            ></div>
          </div>
          <span class="time">{{ displayDuration }}</span>
        </div>
      </div>

      <!-- Volume & Extra -->
      <div class="player-right">
        <button class="control-btn volume-btn" title="Mute">
          <i class="fa fa-volume-up"></i>
        </button>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioRef"
      :src="currentTrack ? `${URL}${currentTrack.path}` : ''"
      @timeupdate="updateTime"
      @loadedmetadata="updateDuration"
      @play="musicStore.isPlaying = true"
      @pause="musicStore.isPlaying = false"
    />
  </div>
</template>

<style scoped>
.music-player {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 3px solid #fba100;
  padding: 20px 10vw;
  position: sticky;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.player-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 150px;
  gap: 24px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

/* Left: Album Art & Info */
.player-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.player-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-info {
  min-width: 0;
  flex: 1;
}

.track-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name {
  margin: 2px 0 0;
  font-size: 13px;
  color: #fba100;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-name {
  margin: 2px 0 0;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Center: Controls & Progress */
.player-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  background: transparent;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 6px;
}

.control-btn:hover {
  color: #fba100;
  transform: scale(1.1);
}

.play-btn {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fba100, #ff9500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.play-btn:hover {
  background: linear-gradient(135deg, #ffb300, #ffb300);
  transform: scale(1.05);
}

/* Progress Bar */
.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.time {
  color: #999;
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #333;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fba100, #ff9500);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #fba100;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(251, 161, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

/* Right: Volume */
.player-right {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.volume-btn {
  font-size: 16px;
  color: #999;
}

/* Responsive */
@media (max-width: 1024px) {
  .player-wrapper {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .player-left {
    order: 1;
    width: 100%;
  }

  .player-center {
    order: 2;
    width: 100%;
  }

  .player-right {
    order: 3;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .music-player {
    padding: 16px 5vw;
  }

  .player-cover {
    width: 50px;
    height: 50px;
  }

  .track-name {
    font-size: 14px;
  }

  .artist-name {
    font-size: 12px;
  }

  .album-name {
    font-size: 11px;
  }

  .control-btn {
    font-size: 16px;
  }

  .play-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .music-player {
    padding: 12px 3vw;
  }

  .player-cover {
    display: none;
  }

  .track-name {
    font-size: 13px;
  }

  .player-controls {
    gap: 12px;
  }

  .control-btn {
    font-size: 14px;
  }

  .play-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .time {
    font-size: 10px;
    min-width: 32px;
  }
}
</style>
