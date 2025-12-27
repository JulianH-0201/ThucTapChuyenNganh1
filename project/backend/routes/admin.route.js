const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// GET /api/admin/users - Lấy danh sách người dùng
//
router.get("/users", [verifyToken, isAdmin], adminController.getAllUsers);
//
router.put(
  "/users/:id/role",
  [verifyToken, isAdmin],
  adminController.changeRoleUser
);
// GET /api/admin/dashboard - Lấy thống kê (nếu có)
router.get(
  "/dashboard",
  [verifyToken, isAdmin],
  adminController.getDashboardStats
);

module.exports = router;
