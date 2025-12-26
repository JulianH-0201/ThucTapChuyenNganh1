const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsAdmin.controller");

// GET /api/artists - Lấy danh sách
router.get("/", artistsController.getAllArtists);

// POST /api/artists - Tạo mới
router.post("/", artistsController.createArtist);

// PUT /api/artists/:artistId - Cập nhật
router.put("/:artistId", artistsController.updateArtist);

// DELETE /api/artists/:artistId - Xóa
router.delete("/:artistId", artistsController.deleteArtist);

module.exports = router;