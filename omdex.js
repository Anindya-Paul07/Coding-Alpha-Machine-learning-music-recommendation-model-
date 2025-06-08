const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import route modules
const spotifyRoutes = require('./routes/spotify');
const mlRoutes = require('./routes/ml');

// Routes
app.use('/api/spotify', spotifyRoutes);
app.use('/api/ml', mlRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Music Recommendation Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the demo`);
});