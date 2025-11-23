const express = require("express");
const path = require("path");
const cors = require("cors");
const artists = require("./artists");
const admin = require("./admin");
const app = express();
const port = 3000;

// Enable CORS so frontend (vite) can access this API
app.use(cors());

// Parse JSON bodies (for future POST/PUT endpoints)
app.use(express.json());

// api routes
app.use("/api/artists", artists);

// admin API
app.use("/api/admin", admin);

// access songs
app.use(express.static(path.join(__dirname, "..", "public")));

// just port
app.listen(port, () => console.log(`Server is running at port ${port}`));

