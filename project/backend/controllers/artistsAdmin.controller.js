const Artist = require("../models/Artist.model");
const Album = require("../models/Album.model");
// GET /artists - Lấy danh sách ca sĩ
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find(); // Bước 1: Lấy artist

    // Bước 2: Với mỗi artist, chạy sang bảng Album đếm (hoặc lấy dữ liệu)
    // Cách này hơi chậm nếu data lớn, nhưng dễ hiểu.
    // (Để tối ưu thì người ta dùng Aggregation $lookup, nhưng ở đây mình viết JS thuần cho dễ hiểu)

    const result = await Promise.all(
      artists.map(async (artist) => {
        const albums = await Album.find({ artist: artist._id }); // Tìm album thuộc artist này
        return {
          ...artist.toObject(),
          albums: albums, // Tự ghép mảng albums vào kết quả trả về
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /artists - Tạo ca sĩ mới
const createArtist = async (req, res) => {
  try {
    const { artistName, artistBio } = req.body;
    if (!artistName)
      return res.status(400).json({ error: "artistName is required" });

    const newArtist = new Artist({ artistName, artistBio, albums: [] });
    await newArtist.save();

    res.json({
      success: true,
      message: "Artist created successfully",
      artist: newArtist,
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating artist: " + err.message });
  }
};

// PUT /artists/:artistId - Sửa ca sĩ
const updateArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { artistName, artistBio } = req.body;

    // Build update object only with provided fields
    const update = {};
    if (artistName !== undefined) update.artistName = artistName;
    if (artistBio !== undefined) update.artistBio = artistBio;

    const artist = await Artist.findByIdAndUpdate(artistId, update, {
      new: true,
    });

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    res.json({ success: true, message: "Artist updated", artist });
  } catch (err) {
    res.status(500).json({ error: "Error updating artist: " + err.message });
  }
};

// DELETE /artists/:artistId - Xóa ca sĩ
const deleteArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    // 1. Xóa Artist
    await Artist.findByIdAndDelete(artistId);

    // 2. Vì không có liên kết mảng, ta phải tìm các Album có artistId này để xóa
    // (Thậm chí phải xóa cả Track thuộc các Album đó - Logic này khá phức tạp nếu làm kỹ)
    await Album.deleteMany({ artist: artistId });

    res.json({ success: true, message: "Artist and related Albums deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
};
