const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_secret_key";

// Middleware xác thực Token (Phải đăng nhập mới được qua)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ chuỗi "Bearer <token>"

  if (!token) return res.status(403).json({ message: "Không tìm thấy Token" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    
    req.user = decoded; // Lưu thông tin user vào request để dùng sau này
    next();
  });
};

// Middleware phân quyền (Chỉ Admin)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập (Yêu cầu quyền Admin)" });
  }
};

module.exports = { verifyToken, isAdmin };