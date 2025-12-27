const express = require("express");
const router = express.Router();
const tracksController = require("../controllers/tracks.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/tracks - Lấy tất cả
router.get("/", [verifyToken, isAdmin], tracksController.getAllTracks);

// POST /api/tracks - Tạo mới (Body cần có albumId)
router.post("/", [verifyToken, isAdmin], tracksController.createTrack);

// PUT /api/tracks/:trackId - Cập nhật
router.put("/:trackId", [verifyToken, isAdmin], tracksController.updateTrack);

// DELETE /api/tracks/:trackId - Xóa
router.delete(
  "/:trackId",
  [verifyToken, isAdmin],
  tracksController.deleteTrack
);

module.exports = router;
