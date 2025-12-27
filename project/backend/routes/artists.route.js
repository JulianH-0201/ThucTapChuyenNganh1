const express = require("express");
const router = express.Router();
const {
  getArtist,
  getArtists,
  getAlbums,
  getSongsInAlbums,
} = require("../controllers/artists.controller");

//testing artists
router.get("/artists", getArtists);
router.get("/artists/:id", getArtist);

router.get("/albums", getAlbums);
router.get("/albums/:id", getSongsInAlbums);
module.exports = router;
