const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
  },
  albumCover: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  // Quan hệ: Album thuộc về 1 Artist
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Album", AlbumSchema);