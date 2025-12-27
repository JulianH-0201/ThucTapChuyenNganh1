const express = require("express");
const router = express.Router();
const albumsController = require("../controllers/albums.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
// GET /api/albums - Lấy tất cả
router.get("/", [verifyToken, isAdmin], albumsController.getAllAlbums);

// GET /api/albums/artist/:artistId - Lấy album của một ca sĩ
router.get(
  "/artists/:artistId/albums",
  [verifyToken, isAdmin],
  albumsController.getAlbumsByArtist
);

// POST /api/albums - Tạo mới (Body cần có artistId)
router.post("/", [verifyToken, isAdmin], albumsController.createAlbum);

// PUT /api/albums/:albumId - Cập nhật
router.put("/:albumId", [verifyToken, isAdmin], albumsController.updateAlbum);

// DELETE /api/albums/:albumId - Xóa
router.delete(
  "/:albumId",
  [verifyToken, isAdmin],
  albumsController.deleteAlbum
);

module.exports = router;
