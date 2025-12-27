const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { corsOptions } = require("./configs/cors.config");
// 1. Import hàm kết nối database từ folder configs
const connectDB = require("./configs/database.config");

// Import routes
const serverRoutes = require("./routes/server.route");

const app = express();
const port = 3000;

// --- MIDDLEWARES ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// --- DATABASE CONNECTION ---
// 2. Gọi hàm kết nối database
connectDB();

// --- ROUTES CONFIGURATION ---
app.use("/", serverRoutes);

// --- STATIC FILES ---
app.use(express.static(path.join(__dirname, "public")));

// --- START SERVER ---
app.listen(port, () => console.log(`Server is running at port ${port}`));
