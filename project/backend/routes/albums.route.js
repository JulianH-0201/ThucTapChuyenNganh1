const express = require("express");
const router = express.Router();
const albumsController = require("../controllers/albums.controller");

// GET /api/albums - Lấy tất cả
router.get("/", albumsController.getAllAlbums);

// GET /api/albums/artist/:artistId - Lấy album của một ca sĩ
router.get("/artists/:artistId/albums", albumsController.getAlbumsByArtist);

// POST /api/albums - Tạo mới (Body cần có artistId)
router.post("/", albumsController.createAlbum);

// PUT /api/albums/:albumId - Cập nhật
router.put("/:albumId", albumsController.updateAlbum);

// DELETE /api/albums/:albumId - Xóa
router.delete("/:albumId", albumsController.deleteAlbum);

module.exports = router;