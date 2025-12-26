const express = require("express");
const router = express.Router();
const tracksController = require("../controllers/tracks.controller");

// GET /api/tracks - Lấy tất cả
router.get("/", tracksController.getAllTracks);

// POST /api/tracks - Tạo mới (Body cần có albumId)
router.post("/", tracksController.createTrack);

// PUT /api/tracks/:trackId - Cập nhật
router.put("/:trackId", tracksController.updateTrack);

// DELETE /api/tracks/:trackId - Xóa
router.delete("/:trackId", tracksController.deleteTrack);

module.exports = router;