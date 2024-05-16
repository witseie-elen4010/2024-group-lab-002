const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
    sessionToken: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);
