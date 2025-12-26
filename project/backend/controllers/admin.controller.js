const User = require("../models/User.model");
// const Admin = require("../models/Admin.model"); 

// GET /admin/users - Lấy danh sách users (Ví dụ)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Không trả về password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// API lấy thống kê tổng quan (Dashboard)
const getDashboardStats = async (req, res) => {
   // Logic đếm tổng số bài hát, ca sĩ, album...
   res.json({ message: "Dashboard stats here" });
};

module.exports = {
  getAllUsers,
  getDashboardStats
};