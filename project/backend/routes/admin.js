const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist");

// GET /api/admin/songs - Get all songs from MongoDB
router.get("/songs", async (req, res) => {
  try {
    const artists = await Artist.find();
    if (!artists || artists.length === 0) {
      return res.status(404).json({ error: "No artists found" });
    }

    // Get first artist and first album
    const firstArtist = artists[0];
    const firstAlbum = firstArtist.albums && firstArtist.albums[0];

    if (!firstAlbum) {
      return res.status(404).json({ error: "No albums found" });
    }

    res.json({
      artist: firstArtist.artistName,
      albumName: firstAlbum.name,
      albumCover: firstAlbum.albumCover,
      releaseYear: firstAlbum.releaseYear,
      tracks: firstAlbum.tracks || [],
      totalTracks: firstAlbum.tracks ? firstAlbum.tracks.length : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching songs: " + err.message });
  }
});

// POST /api/admin/songs - Add a new song to specified artist's album
router.post("/songs", async (req, res) => {
  try {
    const { name, path, artistId, albumId } = req.body;

    if (!name || !path) {
      return res.status(400).json({ error: "Song name and path are required" });
    }

    // Find artist
    let artist;
    if (artistId) {
      artist = await Artist.findById(artistId);
    } else {
      artist = await Artist.findOne();
    }

    if (!artist) {
      return res.status(404).json({ error: "No artists found" });
    }

    // Find album
    let album;
    if (albumId) {
      album = artist.albums.find((a) => a._id.toString() === albumId);
    } else {
      album = artist.albums[0];
    }

    if (!album) {
      return res.status(404).json({ error: "No albums found" });
    }

    // Create new track
    const newTrack = {
      id: (album.tracks.length || 0) + 1,
      name,
      path,
    };

    album.tracks.push(newTrack);
    await artist.save();

    res.json({
      success: true,
      message: "Song added successfully",
      track: newTrack,
    });
  } catch (err) {
    res.status(500).json({ error: "Error adding song: " + err.message });
  }
});

// DELETE /api/admin/songs/:trackId - Delete a song
router.delete("/songs/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;
    const { artistId, albumId } = req.query;

    let artist;
    if (artistId) {
      artist = await Artist.findById(artistId);
    } else {
      artist = await Artist.findOne();
    }

    if (!artist) {
      return res.status(404).json({ error: "No artists found" });
    }

    if (!artist.albums || artist.albums.length === 0) {
      return res.status(404).json({ error: "No albums found" });
    }

    let album;
    if (albumId) {
      album = artist.albums.find((a) => a._id.toString() === albumId);
    } else {
      album = artist.albums[0];
    }

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const trackIndex = album.tracks.findIndex(
      (t) => t.id === parseInt(trackId)
    );

    if (trackIndex === -1) {
      return res.status(404).json({ error: "Track not found" });
    }

    album.tracks.splice(trackIndex, 1);
    await artist.save();

    res.json({ success: true, message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting song: " + err.message });
  }
});

// GET /api/admin/albums - Get all albums
router.get("/albums", async (req, res) => {
  try {
    const artists = await Artist.find();
    const albums = [];

    artists.forEach((artist) => {
      artist.albums.forEach((album) => {
        albums.push({
          _id: album._id,
          name: album.name,
          releaseYear: album.releaseYear,
          albumCover: album.albumCover,
          price: album.price,
          artist: artist.artistName,
          artistId: artist._id,
          trackCount: album.tracks ? album.tracks.length : 0,
        });
      });
    });

    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Error fetching albums: " + err.message });
  }
});

// POST /api/admin/albums - Add new album
router.post("/albums", async (req, res) => {
  try {
    const { name, releaseYear, albumCover, price, artistId } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: "Album name is required" });
    }

    let artist;
    if (artistId) {
      artist = await Artist.findById(artistId);
    } else {
      artist = await Artist.findOne();
    }

    if (!artist) {
      return res.status(404).json({ error: "No artists found" });
    }

    const newAlbum = {
      name,
      releaseYear: releaseYear || new Date().getFullYear().toString(),
      albumCover: albumCover || "/albumCovers/default.png",
      price: price || 0,
      tracks: [],
    };

    artist.albums.push(newAlbum);
    await artist.save();

    res.json({
      success: true,
      message: "Album added successfully",
      album: newAlbum,
    });
  } catch (err) {
    res.status(500).json({ error: "Error adding album: " + err.message });
  }
});

// DELETE /api/admin/albums/:albumId - Delete album
router.delete("/albums/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    const { artistId } = req.query;

    let artist;
    if (artistId) {
      artist = await Artist.findById(artistId);
    } else {
      artist = await Artist.findOne();
    }

    if (!artist) {
      return res.status(404).json({ error: "No artists found" });
    }

    const albumIndex = artist.albums.findIndex(
      (a) => a._id.toString() === albumId
    );

    if (albumIndex === -1) {
      return res.status(404).json({ error: "Album not found" });
    }

    artist.albums.splice(albumIndex, 1);
    await artist.save();

    res.json({ success: true, message: "Album deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting album: " + err.message });
  }
});

// ===== ARTISTS API =====

// GET - list artists
router.get("/artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    const list = artists.map((a) => ({
      _id: a._id,
      artistName: a.artistName,
      albumCount: a.albums?.length || 0,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Error fetching artists: " + err.message });
  }
});

// POST - create an artist
router.post("/artists", async (req, res) => {
  try {
    const { artistName } = req.body;
    if (!artistName)
      return res.status(400).json({ error: "artistName is required" });

    const newArtist = new Artist({ artistName, albums: [] });
    await newArtist.save();
    res.json({
      success: true,
      message: "Artist created",
      artist: { _id: newArtist._id, artistName: newArtist.artistName },
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating artist: " + err.message });
  }
});

// DELETE - remove an artist
router.delete("/artists/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    await artist.deleteOne();
    res.json({ success: true, message: "Artist deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting artist: " + err.message });
  }
});

// GET - artist albums
router.get("/artists/:artistId/albums", async (req, res) => {
  try {
    const { artistId } = req.params;
    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist.albums || []);
  } catch (err) {
    res.status(500).json({ error: "Error fetching albums: " + err.message });
  }
});

// ===== USERS API =====
const User = require("../models/User");
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users: " + err.message });
  }
});

module.exports = router;
