// game.js

document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    const connectedUsersList = document.getElementById('user-list');
    const usernameDisplay = document.getElementById('username-display');

    socket.on('connect', function () {
        // Upon connection, inform the server to assign a user ID
        socket.emit('assignUserId');
    });

    socket.on('userIdAssigned', function (userId) {
        // Display the user's ID
        usernameDisplay.textContent = `Your User ID: ${userId}`;
    });

    socket.on('userConnected', function (users) {
        updateUserList(users);
    });

    socket.on('userDisconnected', function (userId) {
        // Update user list when a user disconnects
        deleteDisconnectedUser(userId);
    });

    function updateUserList(users) {
        connectedUsersList.innerHTML = ''; // Clear the list first

        users.forEach(function (user) {
            const li = document.createElement('li');
            li.textContent = user.username;
            connectedUsersList.appendChild(li);
        });
    }

    function deleteDisconnectedUser(userId) {
        const userItem = document.querySelector(`#connected-users-list li[data-user-id="${userId}"]`);
        if (userItem) {
            userItem.remove();
        }
    }
});
