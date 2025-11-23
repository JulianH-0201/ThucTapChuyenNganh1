const express = require("express");
const router = express.Router();
const artists = require("../data/artistsData");

router.get("/", (req, res) => {
  res.json(artists);
});

// get artist that have that id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1 || id > artists.length) {
    return res
      .status(404)
      .json({ msg: `Artist with id ${req.params.id} not found` });
  }
  // return the artist (arr = id-1)
  const artist = artists[id - 1];
  res.json(artist);
});

// get albums that have the id
router.get("/:id/:idAlbum", (req, res) => {
  const id = parseInt(req.params.id);
  const idAlbum = parseInt(req.params.idAlbum);

  if (isNaN(id) || id < 1 || id > artists.length) {
    res.status(404).json({ msg: `Artist with id ${id} not found` });
  } else if (isNaN(id) || id < 1 || id > artists.length) {
    res.status(404).json({ msg: `Album with id ${idAlbum} is not found!` });
  }
  const artist = artists[id - 1].albums[idAlbum - 1];
  res.json(artist);
});

module.exports = router;
