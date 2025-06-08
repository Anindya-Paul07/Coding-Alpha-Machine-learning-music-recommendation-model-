const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();

// Spotify API configuration
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/api/spotify/callback'
});

// Get authorization URL
router.get('/auth', (req, res) => {
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-top-read',
        'user-read-recently-played',
        'playlist-modify-public',
        'playlist-modify-private'
    ];
    
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.json({ authUrl: authorizeURL });
});

// Handle callback
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        
        res.redirect('/?auth=success');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.redirect('/?auth=error');
    }
});

// Get user's top tracks
router.get('/top-tracks', async (req, res) => {
    try {
        const data = await spotifyApi.getMyTopTracks({ limit: 50, time_range: 'medium_term' });
        res.json(data.body);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
});

// Get recently played tracks
router.get('/recent-tracks', async (req, res) => {
    try {
        const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
        res.json(data.body);
    } catch (error) {
        console.error('Error fetching recent tracks:', error);
        res.status(500).json({ error: 'Failed to fetch recent tracks' });
    }
});

// Get audio features for tracks
router.post('/audio-features', async (req, res) => {
    const { trackIds } = req.body;
    
    try {
        const data = await spotifyApi.getAudioFeaturesForTracks(trackIds);
        res.json(data.body);
    } catch (error) {
        console.error('Error fetching audio features:', error);
        res.status(500).json({ error: 'Failed to fetch audio features' });
    }
});

// Search for tracks
router.get('/search', async (req, res) => {
    const { q, limit = 20 } = req.query;
    
    try {
        const data = await spotifyApi.searchTracks(q, { limit });
        res.json(data.body);
    } catch (error) {
        console.error('Error searching tracks:', error);
        res.status(500).json({ error: 'Failed to search tracks' });
    }
});

module.exports = router;