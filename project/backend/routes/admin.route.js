const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// GET /api/admin/users - Lấy danh sách người dùng
router.get("/users", adminController.getAllUsers);

// GET /api/admin/dashboard - Lấy thống kê (nếu có)
router.get("/dashboard", adminController.getDashboardStats);

module.exports = router;