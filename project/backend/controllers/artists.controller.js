const Artists = require("../models/Artist.model");
const Albums = require("../models/Album.model");
const Track = require("../models/Track.model");
// get all artist
const getArtists = async (req, res) => {
  try {
    const artists = await Artists.find({});

    // For each artist, fetch their albums and attach to the response (with tracks)
    const artistsWithAlbums = await Promise.all(
      artists.map(async (artist) => {
        const albums = await Albums.find({ artist: artist._id }).populate(
          "artist",
          "artistName"
        );
        const albumsWithTracks = await Promise.all(
          albums.map(async (album) => {
            const tracks = await Track.find({ album: album._id }).select(
              "name path _id"
            );
            return { ...album.toObject(), tracks };
          })
        );
        return { ...artist.toObject(), albums: albumsWithTracks };
      })
    );

    res.status(200).json(artistsWithAlbums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single artist
const getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artists.findById(id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const albums = await Albums.find({ artist: artist._id }).populate(
      "artist",
      "artistName"
    );
    const albumsWithTracks = await Promise.all(
      albums.map(async (album) => {
        const tracks = await Track.find({ album: album._id }).select(
          "name path _id"
        );
        return { ...album.toObject(), tracks };
      })
    );
    res.status(200).json({ ...artist.toObject(), albums: albumsWithTracks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlbums = async (req, res) => {
  try {
    const albums = await Albums.find().populate("artist", "artistName");
    const albumsWithTracks = await Promise.all(
      albums.map(async (album) => {
        const tracks = await Track.find({ album: album._id }).select(
          "name path _id"
        );
        return { ...album.toObject(), tracks };
      })
    );
    res.status(200).json(albumsWithTracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSongsInAlbums = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Albums.findById(id).populate("artist", "artistName");
    if (!album) return res.status(404).json({ message: "Album not found" });

    const tracks = await Track.find({ album: album._id }).select(
      "name path _id"
    );
    res.status(200).json({ ...album.toObject(), tracks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArtists,
  getArtist,
  getAlbums,
  getSongsInAlbums,
};
