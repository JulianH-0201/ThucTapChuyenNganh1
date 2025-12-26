const mongoose = require("mongoose");

// Hàm kết nối CSDL
const connectDB = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect("mongodb://127.0.0.1/node");
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    // Tùy chọn: Dừng server nếu không kết nối được DB
    // process.exit(1); 
  }
};

module.exports = connectDB;