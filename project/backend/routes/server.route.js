// routes/server.route.js
const express = require("express");
const router = express.Router();

// Import các route con
const userRoute = require("./user.route"); // <--- Mới thêm file này
const artistsRoute = require("./artists.route");
const adminRoute = require("./admin.route");
const artistsAdminRoute = require("./artistsAdmin.route");
const albumsRoute = require("./albums.route");
const tracksRoute = require("./tracks.route");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
// --- GẮN CÁC ROUTE CON ---

// Route cho User (Login/Register)
// Nếu bạn gắn ở root "/", đường dẫn sẽ là: /register, /login
// Nếu muốn gom nhóm, bạn có thể để router.use("/api/auth", userRoute);
router.use("/", userRoute);

// Route Artist Client
router.use("/api", artistsRoute);

// Route Admin Dashboard
router.use("/api/admin", [verifyToken, isAdmin], adminRoute);
router.use("/api/admin/artists", [verifyToken, isAdmin], artistsAdminRoute);
router.use("/api/admin/albums", [verifyToken, isAdmin], albumsRoute);
router.use("/api/admin/tracks", [verifyToken, isAdmin], tracksRoute);

module.exports = router;
