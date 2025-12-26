const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist.model");
const {
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
} = require("../controllers/admin.controller");

// GET /api/admin/songs - Get all songs from MongoDB
router.get("/songs", getAllSongs);

// POST /api/admin/songs - Add a new song to specified artist's album
router.post("/songs", addNewSong);

// PUT /api/admin/songs/:trackId - Update a song
router.put("/songs/:trackId", updateSong);

//for admin Login
router.post("/login", checkLogin);

// DELETE /api/admin/songs/:trackId - Delete a song
router.delete("/songs/:trackId", deleteSong);

// GET /api/admin/albums - Get all albums
router.get("/albums", getAllAlbum);

// POST /api/admin/albums - Add new album
router.post("/albums", addNewAlbum);
// PUT /api/admin/albums/:albumId - Update album
router.put("/albums/:albumId", updateAlbum);
// DELETE /api/admin/albums/:albumId - Delete album
router.delete("/albums/:albumId", deleteAlbum);
// ===== ARTISTS API =====

// GET - list artists
router.get("/artists", getAllArtist);
// POST - create an artist
router.post("/artists", addNewArtist);
// PUT - update an artist
router.put("/artists/:artistId", updateArtist);
// DELETE - remove an artist
router.delete("/artists/:artistId", deleteArtist);
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
// const User = require("../models/User");
// const { getArtist } = require("../controllers/artists.controller");
// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find().select("_id name email");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users: " + err.message });
//   }
// });

module.exports = router;
