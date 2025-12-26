const Track = require("../models/Track.model");
const Album = require("../models/Album.model");

// GET /songs - Lấy tất cả bài hát
const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find().populate("album", "name");
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching songs: " + err.message });
  }
};

// POST /songs - Thêm bài hát
const createTrack = async (req, res) => {
  try {
    const { name, path, albumId } = req.body;

    if (!name || !path || !albumId) {
      return res.status(400).json({ error: "Name, path, and albumId are required" });
    }

    // 1. Tạo Track
    const newTrack = new Track({
      name,
      path,
      album: albumId
    });
    await newTrack.save();

    // 2. Cập nhật Album (Push track id vào mảng tracks của Album)
    await Album.findByIdAndUpdate(albumId, {
      $push: { tracks: newTrack._id }
    });

    res.json({
      success: true,
      message: "Song added successfully",
      track: newTrack,
    });
  } catch (err) {
    res.status(500).json({ error: "Error adding song: " + err.message });
  }
};

// PUT /songs/:trackId - Sửa bài hát
const updateTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    
    const updatedTrack = await Track.findByIdAndUpdate(
      trackId, 
      req.body, 
      { new: true }
    );

    if (!updatedTrack) return res.status(404).json({ error: "Track not found" });

    res.json({
      success: true,
      message: "Song updated successfully",
      track: updatedTrack,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating song: " + err.message });
  }
};

// DELETE /songs/:trackId - Xóa bài hát
const deleteTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    const deletedTrack = await Track.findByIdAndDelete(trackId);
    if (!deletedTrack) return res.status(404).json({ error: "Track not found" });

    // Xóa tham chiếu track này khỏi Album
    // await Album.findByIdAndUpdate(deletedTrack.album, {
    //   $pull: { tracks: trackId }
    // });

    res.json({ success: true, message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting song: " + err.message });
  }
};

module.exports = {
  getAllTracks,
  createTrack,
  updateTrack,
  deleteTrack
};