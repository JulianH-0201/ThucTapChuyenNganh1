const express = require("express");
const router = express.Router();
const {
  getArtist,
  getArtists,
  postArtist,
  updateArtist,
  deleteArtist,
} = require("../controllers/artists.controller");

// const artistsData = require("../data/artistsData");
// const Artist = require("../models/Artist");

// GET /api/artists - prefer DB-backed artists; fall back to static data
// router.get("/", async (req, res) => {
//   try {
//     const dbArtists = await Artist.find();
//     if (dbArtists && dbArtists.length > 0) {
//       // map Mongoose documents to the same shape expected by frontend
//       const mapped = dbArtists.map((a) => ({
//         artistName: a.artistName,
//         albums: (a.albums || []).map((al) => ({
//           name: al.name,
//           albumCover: al.albumCover,
//           releaseYear: al.releaseYear,
//           price: al.price,
//           tracks: al.tracks || [],
//         })),
//       }));
//       return res.json(mapped);
//     }
//     // fallback to static data
//     res.json(artistsData);
//   } catch (err) {
//     console.error(
//       "Error fetching artists from DB, falling back to static data:",
//       err
//     );
//     res.json(artistsData);
//   }
// });

// // get artist that have that id
// router.get("/:id", (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id) || id < 1 || id > artists.length) {
//     return res
//       .status(404)
//       .json({ msg: `Artist with id ${req.params.id} no found` });
//   }
//   // return the artist (arr = id-1)
//   const artist = artists[id - 1];
//   res.json(artist);
// });

// // get albums that have the id
// router.get("/:id/:idAlbum", (req, res) => {
//   const id = parseInt(req.params.id);
//   const idAlbum = parseInt(req.params.idAlbum);

//   if (isNaN(id) || id < 1 || id > artists.length) {
//     res.status(404).json({ msg: `Artist with id ${id} not found` });
//   } else if (isNaN(id) || id < 1 || id > artists.length) {
//     res.status(404).json({ msg: `Album with id ${idAlbum} is not found!` });
//   }
//   const artist = artists[id - 1].albums[idAlbum - 1];
//   res.json(artist);
// });

//testing artists
router.get("/", getArtists);

router.get("/:id", getArtist);

router.put("/:id", updateArtist);

router.post("/", postArtist);

router.delete("/:id", deleteArtist);

module.exports = router;
