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

//post Artist
const postArtist = async (req, res) => {
  try {
    const artist = await Artists.create(req.body);
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update artist information
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params; // Uses req.params to find the item
    const artist = await Artists.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Uses req.body for the new data

    if (!artist) {
      return res.status(404).json({ message: "Artist not found!" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete artist
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params; // Uses req.params to find the item
    const artist = await Artists.findByIdAndDelete(id, req.body, {
      new: true,
    }); // Uses req.body for the new data

    if (!artist) {
      return res.status(404).json({ message: "Artist not found!" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArtists,
  getArtist,
  postArtist,
  updateArtist,
  deleteArtist,
};
