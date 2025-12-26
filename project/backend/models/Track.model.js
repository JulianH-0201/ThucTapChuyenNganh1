const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  // Quan hệ: Track thuộc về 1 Album
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Track", TrackSchema);