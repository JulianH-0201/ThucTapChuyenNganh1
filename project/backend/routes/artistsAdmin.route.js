const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsAdmin.controller");
const {verifyToken, isAdmin} = require("../middlewares/auth.middleware")
// GET /api/artists - Lấy danh sách
router.get("/", [verifyToken, isAdmin], artistsController.getAllArtists);

// POST /api/artists - Tạo mới
router.post("/", [verifyToken, isAdmin], artistsController.createArtist);

// PUT /api/artists/:artistId - Cập nhật
router.put(
  "/:artistId",
  [verifyToken, isAdmin],
  artistsController.updateArtist
);

// DELETE /api/artists/:artistId - Xóa
router.delete(
  "/:artistId",
  [verifyToken, isAdmin],
  artistsController.deleteArtist
);

module.exports = router;
