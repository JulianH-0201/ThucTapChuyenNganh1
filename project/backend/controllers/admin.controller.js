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

const changeRoleUser = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL: /api/admin/users/:id/role
    const { role } = req.body; // Lấy role mới từ body

    // 1. Kiểm tra role hợp lệ (Tùy chọn nhưng nên có)
    const validRoles = ["USER", "ADMIN"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ error: "Role không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN." });
    }

    // 2. Tìm và cập nhật user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true } // new: true để trả về dữ liệu sau khi đã update
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }

    res.json({
      success: true,
      message: `Đã thay đổi quyền của ${updatedUser.username} thành ${updatedUser.role}`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi thay đổi quyền: " + err.message });
  }
};
// API lấy thống kê tổng quan (Dashboard)
const getDashboardStats = async (req, res) => {
  // Logic đếm tổng số bài hát, ca sĩ, album...
  res.json({ message: "Dashboard stats here" });
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  changeRoleUser
};
