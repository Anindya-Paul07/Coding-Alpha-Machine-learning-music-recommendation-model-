const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const sentiment = require('sentiment');
const router = express.Router();

// Initialize sentiment analyzer
const Sentiment = new sentiment();

// Mood detection based on listening patterns and text input
router.post('/detect-mood', async (req, res) => {
    try {
        const { recentTracks, userInput, audioFeatures } = req.body;
        
        // Analyze text sentiment if provided
        let textMood = null;
        if (userInput) {
            const sentimentResult = Sentiment.analyze(userInput);
            textMood = sentimentResult.score > 0 ? 'positive' : sentimentResult.score < 0 ? 'negative' : 'neutral';
        }
        
        // Analyze audio features for mood detection
        const moodFromAudio = analyzeMoodFromAudio(audioFeatures);
        
        // Combine mood indicators
        const detectedMood = combineMoodIndicators(textMood, moodFromAudio, recentTracks);
        
        res.json({
            mood: detectedMood,
            confidence: calculateConfidence(textMood, moodFromAudio),
            details: {
                textMood,
                audioMood: moodFromAudio,
                recommendation: generateMoodBasedRecommendation(detectedMood)
            }
        });
    } catch (error) {
        console.error('Error detecting mood:', error);
        res.status(500).json({ error: 'Failed to detect mood' });
    }
});

// Generate recommendations based on mood and listening history
router.post('/recommend', async (req, res) => {
    try {
        const { mood, topTracks, audioFeatures, recentTracks } = req.body;
        
        // Create user profile from listening history
        const userProfile = createUserProfile(topTracks, audioFeatures);
        
        // Generate recommendations based on mood and profile
        const recommendations = generateRecommendations(mood, userProfile, recentTracks);
        
        res.json({
            recommendations,
            userProfile,
            mood,
            explanation: explainRecommendations(mood, userProfile)
        });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Train simple ML model for mood classification
router.post('/train-model', async (req, res) => {
    try {
        const { trainingData } = req.body;
        
        // Simple neural network for mood classification
        const model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [9], units: 16, activation: 'relu' }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({ units: 8, activation: 'relu' }),
                tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 mood categories
            ]
        });
        
        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        
        // Convert training data to tensors
        const xs = tf.tensor2d(trainingData.features);
        const ys = tf.tensor2d(trainingData.labels);
        
        // Train the model
        await model.fit(xs, ys, {
            epochs: 50,
            batchSize: 32,
            validationSplit: 0.2,
            verbose: 0
        });
        
        // Save model for later use
        await model.save('file://./models/mood-classifier');
        
        res.json({ message: 'Model trained successfully', accuracy: 'Training completed' });
    } catch (error) {
        console.error('Error training model:', error);
        res.status(500).json({ error: 'Failed to train model' });
    }
});

// Helper functions
function analyzeMoodFromAudio(audioFeatures) {
    if (!audioFeatures || audioFeatures.length === 0) return 'neutral';
    
    const avgFeatures = audioFeatures.reduce((acc, track) => {
        acc.energy += track.energy || 0;
        acc.valence += track.valence || 0;
        acc.danceability += track.danceability || 0;
        acc.tempo += track.tempo || 0;
        return acc;
    }, { energy: 0, valence: 0, danceability: 0, tempo: 0 });
    
    const count = audioFeatures.length;
    avgFeatures.energy /= count;
    avgFeatures.valence /= count;
    avgFeatures.danceability /= count;
    avgFeatures.tempo /= count;
    
    // Simple mood classification based on audio features
    if (avgFeatures.valence > 0.7 && avgFeatures.energy > 0.7) return 'happy';
    if (avgFeatures.valence < 0.3 && avgFeatures.energy < 0.4) return 'sad';
    if (avgFeatures.energy > 0.8 && avgFeatures.danceability > 0.7) return 'energetic';
    return 'calm';
}

function combineMoodIndicators(textMood, audioMood, recentTracks) {
    // Priority: text mood > audio mood > default
    if (textMood && textMood !== 'neutral') {
        return textMood === 'positive' ? 'happy' : 'sad';
    }
    return audioMood;
}

function calculateConfidence(textMood, audioMood) {
    if (textMood && audioMood && textMood !== 'neutral') return 0.85;
    if (audioMood !== 'neutral') return 0.7;
    return 0.5;
}

function generateMoodBasedRecommendation(mood) {
    const recommendations = {
        happy: 'Upbeat and positive tracks to maintain your good mood!',
        sad: 'Comforting tracks that understand your feelings or uplifting songs to boost your spirits.',
        energetic: 'High-energy tracks to keep you pumped up!',
        calm: 'Relaxing and peaceful tracks for a serene experience.',
        neutral: 'A balanced mix of your favorite genres and new discoveries.'
    };
    return recommendations[mood] || recommendations.neutral;
}

function createUserProfile(topTracks, audioFeatures) {
    if (!audioFeatures || audioFeatures.length === 0) {
        return { genres: [], avgFeatures: {}, preferences: 'balanced' };
    }
    
    const avgFeatures = audioFeatures.reduce((acc, track) => {
        Object.keys(track).forEach(key => {
            if (typeof track[key] === 'number') {
                acc[key] = (acc[key] || 0) + track[key];
            }
        });
        return acc;
    }, {});
    
    Object.keys(avgFeatures).forEach(key => {
        avgFeatures[key] /= audioFeatures.length;
    });
    
    return {
        avgFeatures,
        preferences: determinePreferences(avgFeatures),
        trackCount: audioFeatures.length
    };
}

function determinePreferences(avgFeatures) {
    if (avgFeatures.energy > 0.7) return 'energetic';
    if (avgFeatures.valence > 0.7) return 'positive';
    if (avgFeatures.acousticness > 0.6) return 'acoustic';
    if (avgFeatures.danceability > 0.7) return 'danceable';
    return 'balanced';
}

function generateRecommendations(mood, userProfile, recentTracks) {
    return {
        moodBased: generateMoodRecommendations(mood),
        profileBased: generateProfileRecommendations(userProfile),
        discovery: generateDiscoveryRecommendations(userProfile, recentTracks)
    };
}

function generateMoodRecommendations(mood) {
    const moodSeeds = {
        happy: ['pop', 'dance', 'indie-pop'],
        sad: ['acoustic', 'indie', 'singer-songwriter'],
        energetic: ['electronic', 'rock', 'hip-hop'],
        calm: ['ambient', 'classical', 'chill']
    };
    return moodSeeds[mood] || moodSeeds.calm;
}

function generateProfileRecommendations(userProfile) {
    const preferences = userProfile.preferences;
    const genreMap = {
        energetic: ['rock', 'electronic', 'metal'],
        positive: ['pop', 'reggae', 'funk'],
        acoustic: ['folk', 'acoustic', 'country'],
        danceable: ['dance', 'disco', 'house'],
        balanced: ['indie', 'alternative', 'pop']
    };
    return genreMap[preferences] || genreMap.balanced;
}

function generateDiscoveryRecommendations(userProfile, recentTracks) {
    // Generate discovery recommendations based on user's listening patterns
    return ['new-releases', 'indie-discovery', 'world-music'];
}

function explainRecommendations(mood, userProfile) {
    return `Based on your ${mood} mood and ${userProfile.preferences} listening preferences, 
            we've curated a mix of tracks that match your current state and musical taste.`;
}

module.exports = router;