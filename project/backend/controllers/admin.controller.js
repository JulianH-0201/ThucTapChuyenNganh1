const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist.model");

const Admin = require("../models/Admin.model");
const bcrypt = require("bcrypt");

// GET /api/admin/songs - Get all songs from MongoDB
const getAllSongs = async (req, res) => {
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
      artistId: firstArtist._id,
      albumName: firstAlbum.name,
      albumId: firstAlbum._id,
      albumCover: firstAlbum.albumCover,
      releaseYear: firstAlbum.releaseYear,
      tracks: (firstAlbum.tracks || []).map((t) => ({
        trackId: t._id,
        name: t.name,
        path: t.path,
      })),
      totalTracks: firstAlbum.tracks ? firstAlbum.tracks.length : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching songs: " + err.message });
  }
};

// POST /api/admin/songs - Add a new song to specified artist's album
const addNewSong = async (req, res) => {
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

    // Create new track (let Mongoose assign _id)
    const newTrack = { name, path };

    album.tracks.push(newTrack);
    await artist.save();

    const savedTrack = album.tracks[album.tracks.length - 1];

    res.json({
      success: true,
      message: "Song added successfully",
      track: {
        trackId: savedTrack._id,
        name: savedTrack.name,
        path: savedTrack.path,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error adding song: " + err.message });
  }
};

//for admin Login
const checkLogin = (req, res) => {
  Admin.findOne({ email: req.body.email })
    .then((admin) => {
      if (admin) {
        bcrypt.compare(req.body.password, admin.password, (err, matched) => {
          if (err)
            return res.json({
              success: false,
              message: "Error comparing passwords",
              error: err.message,
            });
          if (matched) {
            res.json({
              success: true,
              message: "Login successful",
            });
          } else {
            res.json({ success: false, message: "Password incorrect" });
          }
        });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "Error finding user",
        error: err.message,
      });
    });
};

// DELETE /api/admin/songs/:trackId - Delete a song
const deleteSong = async (req, res) => {
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
      (t) => t._id.toString() === trackId
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
};

// PUT /api/admin/songs/:trackId - Update a song
const updateSong = async (req, res) => {
  try {
    const { trackId } = req.params;
    const { name, path } = req.body;
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

    let album;
    if (albumId) {
      album = artist.albums.find((a) => a._id.toString() === albumId);
    } else {
      album = artist.albums[0];
    }

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const track = album.tracks.find((t) => t._id.toString() === trackId);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    if (name !== undefined) track.name = name;
    if (path !== undefined) track.path = path;

    await artist.save();

    res.json({
      success: true,
      message: "Song updated successfully",
      track: { trackId: track._id, name: track.name, path: track.path },
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating song: " + err.message });
  }
};

// GET /api/admin/albums - Get all albums
const getAllAlbum = async (req, res) => {
  try {
    // Aggregation tells the DB to flatten the data for you
    const albums = await Artist.aggregate([
      { $unwind: "$albums" }, // Break the artist document into one doc per album
      {
        $project: {
          // Choose exactly which fields you want to see
          _id: "$albums._id",
          name: "$albums.name",
          artist: "$artistName",
          artistId: "$_id",
          releaseYear: "$albums.releaseYear",
          trackCount: { $size: { $ifNull: ["$albums.tracks", []] } },
        },
      },
    ]);

    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// POST /api/admin/albums - Add new album
const addNewAlbum = async (req, res) => {
  try {
    const { name, releaseYear, albumCover, price, artistId } = req.body;

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
};

// PUT /api/admin/albums/:albumId - Update album
const updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { name, releaseYear, albumCover, price } = req.body;
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

    const album = artist.albums.find((a) => a._id.toString() === albumId);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (name !== undefined) album.name = name;
    if (releaseYear !== undefined) album.releaseYear = releaseYear;
    if (albumCover !== undefined) album.albumCover = albumCover;
    if (price !== undefined) album.price = price;

    await artist.save();

    res.json({ success: true, message: "Album updated successfully", album });
  } catch (err) {
    res.status(500).json({ error: "Error updating album: " + err.message });
  }
};

// DELETE /api/admin/albums/:albumId - Delete album
const deleteAlbum = async (req, res) => {
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
};

// ===== ARTISTS API =====

// GET - list artists
const getAllArtist = async (req, res) => {
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
};

// POST - create an artist
const addNewArtist = async (req, res) => {
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
};

// PUT - update an artist
const updateArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { artistName } = req.body;

    const artist = await Artist.findByIdAndUpdate(
      artistId,
      { artistName },
      { new: true }
    );

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    res.json({ success: true, message: "Artist updated", artist });
  } catch (err) {
    res.status(500).json({ error: "Error updating artist: " + err.message });
  }
};

// DELETE - remove an artist
const deleteArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    await artist.deleteOne();
    res.json({ success: true, message: "Artist deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting artist: " + err.message });
  }
};

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
module.exports = {
  getAllAlbum,
  getAllArtist,
  getAllSongs,
  addNewAlbum,
  addNewArtist,
  addNewSong,
  updateAlbum,
  updateArtist,
  updateSong,
  deleteAlbum,
  deleteArtist,
  deleteSong,
  checkLogin,
};
