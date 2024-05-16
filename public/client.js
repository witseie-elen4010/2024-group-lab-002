document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    const loginButton = document.getElementById('login-button');
    const credentialsForm = document.getElementById('credentials-form');
    const userListDiv = document.getElementById('users-list');
    const startGameButton = document.getElementById('start-game-button');
    const waitingMessage = document.getElementById('waiting-message');

    userListDiv.style.display = 'none';

    let loggedIn = false;
    let sessionToken = localStorage.getItem('sessionToken');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const username = document.getElementById('username-input').value.trim();
        const password = document.getElementById('password-input').value.trim();

        if (username !== '' && password !== '') {
            socket.emit('setUserCredentials', { username, password, sessionToken });
            credentialsForm.style.display = 'none';
            loggedIn = true;
        }
    });

    socket.on('sessionToken', function (token) {
        sessionToken = token;
        localStorage.setItem('sessionToken', sessionToken);
    });

    socket.on('userConnected', function (users) {
        if (loggedIn) {
            updateUserList(users);
            userListDiv.style.display = 'block';
        }
    });

    socket.on('waitingForStartGame', function () {
        startGameButton.style.display = 'block';
        waitingMessage.style.display = 'none';
    });

    socket.on('gameStarted', function () {
        startGame();
    });

    socket.on('gameAlreadyStarted', function () {
        startGame();
    });

    window.addEventListener('beforeunload', function (event) {
        // Emit an event to the server to indicate that the browser is being closed
        socket.emit('browserClosed');
    });

    function updateUserList(users) {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        users.forEach(function (user) {
            const li = document.createElement('li');
            li.textContent = user.username;
            userList.appendChild(li);
        });
    }

    startGameButton.addEventListener('click', function () {
        socket.emit('startGame');
        startGame();
    });

    function startGame() {
        window.location.href = '/game';
    }
});
