const mongoose = require("mongoose");
const AlbumSchema = require("./Album.model");

// const TrackSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   path: {
//     type: String,
//     required: true,
//   },
// });

// const AlbumSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   releaseYear: {
//     type: Number,
//   },
//   albumCover: {
//     type: String,
//   },
//   price: {
//     type: Number,
//     default: 0,
//   },
//   tracks: [TrackSchema],
// });

const ArtistSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: true,
  },
  albums: [AlbumSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Artist", ArtistSchema);
