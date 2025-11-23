// stores/music.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMusicStore = defineStore("music", () => {
  // State
  const artists = ref([]);
  const currentTrack = ref(null);
  const currentArtist = ref(null);
  const currentAlbum = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const allTracks = () => {
    const tracks = [];
    artists.value.forEach((artist) => {
      artist.albums?.forEach((album) => {
        album.tracks?.forEach((track) => {
          tracks.push({
            ...track,
            artistName: artist.artistName,
            albumName: album.name,
            albumCover: album.albumCover,
          });
        });
      });
    });
    return tracks;
  };

  // Actions
  const fetchArtists = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("http://localhost:3000/api/artists");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      artists.value = data;
    } catch (err) {
      error.value = err.message;
      console.error("Failed to fetch artists:", err);
    } finally {
      loading.value = false;
    }
  };

  const setCurrentTrack = (track, artist, album) => {
    currentTrack.value = track;
    currentArtist.value = artist;
    currentAlbum.value = album;
  };

  const clearCurrentTrack = () => {
    currentTrack.value = null;
    currentArtist.value = null;
    currentAlbum.value = null;
  };

  return {
    artists,
    currentTrack,
    currentArtist,
    currentAlbum,
    loading,
    error,
    allTracks,
    fetchArtists,
    setCurrentTrack,
    clearCurrentTrack,
  };
});
