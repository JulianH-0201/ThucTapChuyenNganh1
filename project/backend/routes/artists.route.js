const express = require("express");
const router = express.Router();
const {
  getArtist,
  getArtists,
} = require("../controllers/artists.controller");

//testing artists
router.get("/", getArtists);

router.get("/:id", getArtist);
module.exports = router;
