const express = require("express");
const router = express.Router();
const artists = require("../data/artistsData");

// GET /api/admin/stats - Dashboard statistics
/*router.get("/stats", (req, res) => {
  if (!artists || artists.length === 0) {
    res.status(404).json({ error: "No artists found" });
  }

  const firstArtist = artists[0];
  const firstAlbum = firstArtist.albums[0];

  if (!firstAlbum) {
    return res.status(404).json({ error: "No albums found" });
  }

  const stats = {
    //the number of artist
    totalArtists: artists.length, 
    //the number of album that the artist has 
    totalAlbums: artists.reduce(
      (sum, a) => sum + (a.albums ? a.albums.length : 0),
      0
    ),
    totalSongs: firstAlbum.tracks ? firstAlbum.tracks.length : 0,
    releaseYear: firstAlbum.releaseYear || "",
    albumName: firstAlbum.name || "",
    albumCover: firstAlbum.albumCover || "/albumCovers/DiariesOfAHero.png",
    monthlyPlays: [
      { month: "January", plays: 1200 },
      { month: "February", plays: 1800 },
      { month: "March", plays: 2100 },
      { month: "April", plays: 2500 },
      { month: "May", plays: 2800 },
      { month: "June", plays: 3200 },
    ],
    topSongs: (firstAlbum.tracks || []).slice(0, 5).map((track, i) => ({
      ...track,
      plays: Math.floor(Math.random() * 10000) + 1000,
      rank: i + 1,
    })),
  };

  res.json(stats);
});*/

// GET /api/admin/songs - Get all songs from first album
router.get("/songs", (req, res) => {
  if (!artists || artists.length === 0) {
    return res.status(404).json({ error: "No artists found" });
  }
  //1st artist in the artistData
  const firstArtist = artists[0];
  //1st album in
  const firstAlbum = firstArtist.albums && firstArtist.albums[0];

  if (!firstAlbum) {
    return res.status(404).json({ error: "No albums found" });
  }

  res.json({
    artist: firstArtist.artistName,
    albumName: firstAlbum.name,
    albumCover: firstAlbum.albumCover,
    releaseYear: firstAlbum.releaseYear,
    tracks: firstAlbum.tracks || [],
    //all of the tracks in the album. It means if the album have any track it will return the track length. If not, it will return 0
    totalTracks: firstAlbum.tracks ? firstAlbum.tracks.length : 0,
  });
});

module.exports = router;
