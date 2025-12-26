const Artists = require("../models/Artist.model");

// get all artist
const getArtists = async (req, res) => {
  try {
    const artists = await Artists.find({});
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single artist
const getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artists.findById(id);
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getArtists,
  getArtist,
};
