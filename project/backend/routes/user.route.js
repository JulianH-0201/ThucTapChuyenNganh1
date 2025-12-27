// routes/user.route.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model"); // Đảm bảo đường dẫn này đúng
//jwt
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
//joi validate
const Joi = require("joi");

// POST /register
router.post("/register", async (req, res, next) => {
  try {
    // 1. Định nghĩa Schema Validation
    const schema = Joi.object({
      username: Joi.string().required().messages({
        "any.required": "Username is required",
        "string.empty": "Username cannot be empty",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "E-mail is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),
      // --- THÊM PHẦN NÀY ---
      confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('password')) // Bắt buộc phải giống trường 'password'
        .messages({
          "any.only": "Passwords do not match", // Thông báo lỗi khi không khớp
          "any.required": "Confirm password is required",
        }),
    });

    // 2. Thực thi Validate
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    // 3. Logic xử lý đăng ký
    // Lưu ý: Chỉ lấy username, email, password để lưu vào DB (bỏ qua confirmPassword)
    const { username, email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hash,
      username: username,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "Successfully registered!" });
  } catch (err) {
    console.error("Registration Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    // 1. Validate Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email address",
        "any.required": "Email required",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password required.",
      }),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    // 2. Tìm User (Dùng await thay vì .then)
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email does not exist" });
    }

    // 3. So sánh mật khẩu (Dùng await nếu thư viện hỗ trợ, hoặc dùng promise wrapper)
    // bcrypt.compare mặc định dùng callback, ta dùng bcrypt.compareSync hoặc promisify nó.
    // Cách chuẩn với bcryptjs hiện đại hỗ trợ Promise:
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }

    // 4. Tạo token
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    // 5. Trả về kết quả
    res.json({
      success: true,
      message: "Login successful",
      token: "Bearer " + token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Lỗi Server: " + err.message });
  }
});

module.exports = router;
