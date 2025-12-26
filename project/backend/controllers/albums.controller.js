const Album = require("../models/Album.model");
const Artist = require("../models/Artist.model");

// GET /albums - Lấy tất cả album
const getAllAlbums = async (req, res) => {
  try {
    // populate artist để biết album của ai
    const albums = await Album.find().populate("artist", "artistName");
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /artists/:artistId/albums - Lấy album của 1 ca sĩ cụ thể
const getAlbumsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const albums = await Album.find({ artist: artistId });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /albums - Tạo album mới
const createAlbum = async (req, res) => {
  try {
    const { name, releaseYear, albumCover, price, artistId } = req.body;

    if (!name || !artistId) {
      return res.status(400).json({ error: "Name and ArtistId are required" });
    }

    // 1. Tạo Album
    const newAlbum = new Album({
      name,
      releaseYear,
      albumCover,
      price,
      artist: artistId,
      tracks: []
    });
    await newAlbum.save();

    // 2. Cập nhật Artist (Push album id vào mảng albums của Artist)
    await Artist.findByIdAndUpdate(artistId, {
      $push: { albums: newAlbum._id }
    });

    res.json({
      success: true,
      message: "Album added successfully",
      album: newAlbum,
    });
  } catch (err) {
    res.status(500).json({ error: "Error adding album: " + err.message });
  }
};

// PUT /albums/:albumId - Update album
const updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    // Với 3 collection, ta chỉ cần tìm theo albumId, không cần artistId nữa
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId, 
      req.body, 
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /albums/:albumId - Xóa album
const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    
    // Tìm và xóa album
    const deletedAlbum = await Album.findByIdAndDelete(albumId);
    if (!deletedAlbum) return res.status(404).json({ error: "Album not found" });

    // Xóa tham chiếu album này khỏi mảng albums của Artist
    await Artist.findByIdAndUpdate(deletedAlbum.artist, {
      $pull: { albums: albumId }
    });

    res.json({ success: true, message: "Album deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting album: " + err.message });
  }
};



module.exports = {
  getAllAlbums,
  getAlbumsByArtist,
  createAlbum,
  updateAlbum,
  deleteAlbum
};