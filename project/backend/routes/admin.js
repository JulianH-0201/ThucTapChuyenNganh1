import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to artist.json (adjust based on your project structure)
const ARTIST_JSON_PATH = path.join(__dirname, '../../music-player/src/artist.json');

// Helper function to read artist data
async function getArtistData() {
  try {
    console.log('Attempting to read artist.json from:', ARTIST_JSON_PATH);
    const data = await fs.readFile(ARTIST_JSON_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading artist.json:', error);
    console.error('Error details:', error.message);
    console.error('File path:', ARTIST_JSON_PATH);
    return null;
  }
}

// Helper function to write artist data
async function saveArtistData(data) {
  try {
    await fs.writeFile(ARTIST_JSON_PATH, JSON.stringify(data, null, 4), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing artist.json:', error);
    return false;
  }
}

// GET /api/admin/test - Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Admin API is working!',
    filePath: ARTIST_JSON_PATH,
    timestamp: new Date().toISOString()
  });
});

// GET /api/admin/artists - Get all artists/albums
router.get('/artists', async (req, res) => {
  try {
    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artist data' });
  }
});

// GET /api/admin/songs - Get all songs
router.get('/songs', async (req, res) => {
  try {
    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ 
        error: 'Artist data not found',
        message: 'Could not read artist.json file. Please check the file path.'
      });
    }
    res.json({
      artist: artist.name,
      albumCover: artist.albumCover,
      releaseYear: artist.releaseYear,
      tracks: artist.tracks,
      totalTracks: artist.tracks.length
    });
  } catch (error) {
    console.error('Error in /songs route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch songs',
      message: error.message 
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }

    // Calculate statistics
    const stats = {
      totalArtists: 1, // Currently one artist
      totalAlbums: 1,
      totalSongs: artist.tracks.length,
      releaseYear: artist.releaseYear,
      albumName: artist.name,
      // Monthly play data (mock data - you can replace with real analytics)
      monthlyPlays: [
        { month: 'January', plays: 1200 },
        { month: 'February', plays: 1800 },
        { month: 'March', plays: 2100 },
        { month: 'April', plays: 2500 },
        { month: 'May', plays: 2800 },
        { month: 'June', plays: 3200 },
      ],
      // Top songs (mock data)
      topSongs: artist.tracks.slice(0, 5).map((track, index) => ({
        ...track,
        plays: Math.floor(Math.random() * 10000) + 1000,
        rank: index + 1
      }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST /api/admin/songs - Add a new song
router.post('/songs', async (req, res) => {
  try {
    const { name, path } = req.body;
    if (!name || !path) {
      return res.status(400).json({ error: 'Name and path are required' });
    }

    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }

    // Get the next ID
    const nextId = Math.max(...artist.tracks.map(t => t.id), 0) + 1;
    
    const newTrack = {
      id: nextId,
      name,
      path
    };

    artist.tracks.push(newTrack);
    const saved = await saveArtistData(artist);

    if (saved) {
      res.status(201).json(newTrack);
    } else {
      res.status(500).json({ error: 'Failed to save song' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song' });
  }
});

// PUT /api/admin/songs/:id - Update a song
router.put('/songs/:id', async (req, res) => {
  try {
    const songId = parseInt(req.params.id);
    const { name, path } = req.body;

    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }

    const trackIndex = artist.tracks.findIndex(t => t.id === songId);
    if (trackIndex === -1) {
      return res.status(404).json({ error: 'Song not found' });
    }

    if (name) artist.tracks[trackIndex].name = name;
    if (path) artist.tracks[trackIndex].path = path;

    const saved = await saveArtistData(artist);

    if (saved) {
      res.json(artist.tracks[trackIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update song' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// DELETE /api/admin/songs/:id - Delete a song
router.delete('/songs/:id', async (req, res) => {
  try {
    const songId = parseInt(req.params.id);

    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }

    const trackIndex = artist.tracks.findIndex(t => t.id === songId);
    if (trackIndex === -1) {
      return res.status(404).json({ error: 'Song not found' });
    }

    artist.tracks.splice(trackIndex, 1);
    const saved = await saveArtistData(artist);

    if (saved) {
      res.json({ message: 'Song deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete song' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// PUT /api/admin/artist - Update artist/album info
router.put('/artist', async (req, res) => {
  try {
    const { name, albumCover, releaseYear } = req.body;

    const artist = await getArtistData();
    if (!artist) {
      return res.status(404).json({ error: 'Artist data not found' });
    }

    if (name) artist.name = name;
    if (albumCover) artist.albumCover = albumCover;
    if (releaseYear) artist.releaseYear = releaseYear;

    const saved = await saveArtistData(artist);

    if (saved) {
      res.json(artist);
    } else {
      res.status(500).json({ error: 'Failed to update artist' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artist' });
  }
});

export default router;

