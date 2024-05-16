// Import necessary modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID module for generating session tokens
const UserSession = require('./models/userSession'); // Import UserSession model

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameStarted = false; // Flag to track whether the game has started

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/game', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Event handler for setting user credentials
socket.on('setUserCredentials', async (credentials) => {
    const { username, password, sessionToken } = credentials;

    if (password === 'brokenTelephone') {
        let userId;
        let userSession;

        // Generate new session token for each user
        const newSessionToken = uuidv4();

        // Check if the session token exists
        if (sessionToken) {
            // Find existing user session by session token
            userSession = await UserSession.findOne({ sessionToken });
            if (userSession) {
                // Update existing user session with new socket ID and username
                userSession.socketId = socket.id;
                userSession.username = username;
                await userSession.save();
                userId = userSession.userId; // Retrieve user ID from existing session
            } else {
                // If session token is invalid, generate new user ID
                userId = socket.id;
            }
        } else {
            // Generate new user ID for the first login attempt
            userId = socket.id;
        }

        // Create or update user session in the database
        userSession = await UserSession.findOneAndUpdate(
            { userId },
            { username, sessionToken: newSessionToken, socketId: socket.id },
            { upsert: true, new: true }
        );

        // Fetch all users from the database
        const users = await UserSession.find({});
        console.log('Current users:', users);  // Debugging line to log current users
        // Emit userConnected event to all clients
        io.emit('userConnected', users);

        // Check if minimum required players are connected and the game hasn't started
        if (users.length >= 3 && !gameStarted) {
            // Emit waitingForStartGame event to all clients
            io.emit('waitingForStartGame');
        }
    } else {
        // Emit incorrectPassword event to the client and disconnect
        socket.emit('incorrectPassword');
        socket.disconnect(true);
    }
});

    // Event handler for starting the game
    socket.on('startGame', () => {
        if (!gameStarted) {
            // Set gameStarted flag to true and emit gameStarted event to all clients
            gameStarted = true;
            io.emit('gameStarted');
        }
    });

    // Event handler for browser closure
    socket.on('browserClosed', async () => {
        console.log('Browser closed by user');
        // Clear user sessions from the database
        await UserSession.deleteMany({});
        console.log('Database cleared');
        // Reset gameStarted flag to false
        gameStarted = false;
    });

    // Event handler for socket disconnection
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        // Delete user session from the database
        await UserSession.deleteOne({ socketId: socket.id });
        // Fetch updated user list from the database
        const users = await UserSession.find({});
        console.log('Updated users after disconnect:', users);  // Debugging line to log users after disconnect
        // Emit userDisconnected event to all clients
        io.emit('userDisconnected', socket.id);
    });
});

// Define port for the Express server
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'js']
}));

// Route for the game page
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
