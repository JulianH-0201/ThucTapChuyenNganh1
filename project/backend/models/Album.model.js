const mongoose = require('mongoose');
const TrackSchema = require('./Track.model');

const AlbumSchema = new mongoose.Schema({
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
  tracks: [TrackSchema],
});

module.exports = AlbumSchema;
