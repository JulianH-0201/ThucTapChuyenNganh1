// stores/music.js
import { defineStore } from "pinia";

// Base URL for backend assets and API
export const URL = "http://localhost:3000";

export const useMusicStore = defineStore("music", {
  state: () => ({
    artists: [],
    currentTrack: null,
    currentArtist: null,
    currentAlbum: null,
    loading: false,
    error: null,
    isPlaying: false,
  }),

  getters: {
    allTracks: (state) => {
      const tracks = [];
      state.artists.forEach((artist) => {
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
    },
  },

  actions: {
    async fetchArtists() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${URL}/api/artists`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.artists = data;
      } catch (err) {
        this.error = err.message;
        console.error("Failed to fetch artists:", err);
      } finally {
        this.loading = false;
      }
    },

    setCurrentTrack(track, artist, album) {
      this.currentTrack = track;
      this.currentArtist = artist;
      this.currentAlbum = album;
      this.isPlaying = true;
    },

    clearCurrentTrack() {
      this.currentTrack = null;
      this.currentArtist = null;
      this.currentAlbum = null;
      this.isPlaying = false;
    },

    togglePlayPause() {
      this.isPlaying = !this.isPlaying;
    },
  },
});
