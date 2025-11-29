const mongoose = require("mongoose");
const Artist = require("./models/Artist");
const artistsData = require("./data/artistsData");

// Kết nối MongoDB
mongoose
  .connect("mongodb://127.0.0.1/node")
  .then(async () => {
    console.log("✓ MongoDB kết nối thành công");

    try {
      // Xóa dữ liệu cũ
      await Artist.deleteMany({});
      console.log("✓ Xóa dữ liệu cũ");

      // Import dữ liệu mới
      const result = await Artist.insertMany(artistsData);
      console.log(`✓ Import ${result.length} nghệ sĩ thành công`);

      // Kiểm tra dữ liệu
      const artists = await Artist.find();
      console.log("\nDữ liệu hiện tại:");
      artists.forEach((artist) => {
        console.log(`  - ${artist.artistName}: ${artist.albums.length} album`);
        artist.albums.forEach((album) => {
          console.log(`    • ${album.name}: ${album.tracks.length} bài`);
        });
      });

      process.exit(0);
    } catch (err) {
      console.error("✗ Lỗi import:", err.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("✗ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });
