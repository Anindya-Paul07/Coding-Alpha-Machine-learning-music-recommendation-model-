# 🎵 AI Music Recommendation System

An intelligent music recommendation system that uses machine learning to analyze your mood and Spotify listening history to provide personalized song recommendations.

## 🌟 Features

- **🎭 Mood Detection**: AI analyzes text input and audio features to understand your emotional state
- **📊 Audio Analysis**: Machine learning processes Spotify's audio features (energy, valence, tempo, etc.)
- **🎵 Smart Recommendations**: Personalized suggestions based on mood and listening history
- **🤖 ML Model Training**: Neural network that learns from user preferences and improves over time
- **🔐 Spotify Integration**: Seamless connection with Spotify Web API

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Machine Learning**: TensorFlow.js
- **Natural Language Processing**: Natural, Sentiment
- **Music API**: Spotify Web API
- **Frontend**: Vanilla HTML/CSS/JavaScript

## 🚀 Getting Started

### Prerequisites

1. **Spotify Developer Account**: Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. **Node.js**: Version 18 or higher

### Installation

1. **Clone the repository** (or fork this Repl)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
   PORT=5000
   ```

4. **Configure Spotify App**:
   - In your Spotify app settings, add the redirect URI: `http://localhost:5000/api/spotify/callback`

5. **Start the server**:
   ```bash
   npm start
   ```
   Or click the **Run** button in Replit

6. **Access the application**:
   - Open `http://localhost:5000` in your browser
   - In Replit, the app will be available at the provided URL

## 📱 Usage

### Step 1: Connect Spotify Account
- Click "Connect Spotify Account" to authorize the application
- Grant necessary permissions for reading your music data

### Step 2: Mood Detection
- Optionally describe how you're feeling in the text area
- Click "Analyze My Mood" to detect your current emotional state
- The AI combines text sentiment analysis with your recent listening patterns

### Step 3: Get Recommendations
- Click "Get My Recommendations" to receive personalized suggestions
- View mood-based, profile-based, and discovery recommendations

### Step 4: Train ML Model (Demo)
- Click "Train ML Model" to see the neural network training process
- The model learns to classify moods based on audio features

## 🧠 How It Works

### Mood Detection Algorithm
1. **Text Analysis**: Uses sentiment analysis to understand emotional context from user input
2. **Audio Feature Analysis**: Analyzes Spotify's audio features:
   - **Valence**: Musical positivity (0.0 - 1.0)
   - **Energy**: Intensity and power (0.0 - 1.0)
   - **Danceability**: How suitable for dancing (0.0 - 1.0)
   - **Tempo**: Speed in BPM
   - **Acousticness**: Acoustic vs. electronic (0.0 - 1.0)

### Machine Learning Model
- **Architecture**: Sequential neural network with TensorFlow.js
- **Input Features**: 9 audio features from Spotify API
- **Output**: 4 mood categories (Happy, Sad, Energetic, Calm)
- **Training**: 50 epochs with dropout for regularization

### Recommendation Engine
- **Mood-Based**: Genres that match detected emotional state
- **Profile-Based**: Recommendations based on listening history analysis
- **Discovery**: New genres and artists for exploration

## 📂 Project Structure

```
├── index.js                 # Main server file
├── routes/
│   ├── spotify.js           # Spotify API endpoints
│   └── ml.js               # Machine learning endpoints
├── public/
│   └── index.html          # Frontend interface
├── models/
│   └── mood-classifier/    # Trained ML model files
├── .env.example           # Environment variables template
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Spotify Routes (`/api/spotify/`)
- `GET /auth` - Get Spotify authorization URL
- `GET /callback` - Handle OAuth callback
- `GET /top-tracks` - Get user's top tracks
- `GET /recent-tracks` - Get recently played tracks
- `POST /audio-features` - Get audio features for tracks
- `GET /search` - Search for tracks

### ML Routes (`/api/ml/`)
- `POST /detect-mood` - Analyze mood from text and audio features
- `POST /recommend` - Generate personalized recommendations
- `POST /train-model` - Train the neural network model

## 🎯 Mood Categories

| Mood | Characteristics | Recommended Genres |
|------|----------------|-------------------|
| **Happy** | High valence, high energy | Pop, Dance, Indie-pop |
| **Sad** | Low valence, low energy | Acoustic, Indie, Singer-songwriter |
| **Energetic** | High energy, high danceability | Electronic, Rock, Hip-hop |
| **Calm** | Moderate features, relaxing | Ambient, Classical, Chill |

## 🔧 Configuration

### Spotify API Scopes
The application requests these permissions:
- `user-read-private` - Access to user profile
- `user-read-email` - Access to user email
- `user-read-playback-state` - Current playback information
- `user-top-read` - Top artists and tracks
- `user-read-recently-played` - Recently played tracks
- `playlist-modify-public` - Create public playlists
- `playlist-modify-private` - Create private playlists

## 🚀 Deployment

### Deploy on Replit
1. Click the **Deploy** button in Replit
2. Configure your environment variables in the Secrets tab
3. Your app will be live at the provided URL

### Environment Variables for Production
```env
SPOTIFY_CLIENT_ID=your_production_client_id
SPOTIFY_CLIENT_SECRET=your_production_client_secret
SPOTIFY_REDIRECT_URI=https://your-app-url.replit.app/api/spotify/callback
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning capabilities
- [Natural](https://github.com/NaturalNode/natural) for NLP processing
- [Sentiment](https://github.com/thisandagain/sentiment) for sentiment analysis

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Contact the maintainer

---

**Made for codeAlpha Machine Learning internship**