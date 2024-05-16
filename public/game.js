document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    const gameArea = document.getElementById('game-area');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const gameMessages = document.getElementById('game-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    gameArea.style.display = 'block';

    socket.on('gameMessage', handleMessage);
    socket.on('playerTyping', handlePlayerTyping);
    socket.on('yourTurn', handleYourTurn);
    socket.on('notYourTurn', handleNotYourTurn);

    // Error handling events
    socket.on('connect_error', function(err) {
        console.log('Connection failed', err);
    });

    socket.on('connect_timeout', function() {
        console.log('Connection timeout');
    });

    socket.on('reconnect', function(number) {
        console.log('Successfully reconnected after', number, 'attempts');
    });

    socket.on('reconnect_attempt', function() {
        console.log('Attempting to reconnect');
    });

    socket.on('reconnecting', function(number) {
        console.log('Reconnecting attempt number', number);
    });

    socket.on('reconnect_error', function(err) {
        console.log('Reconnection failed', err);
    });

    socket.on('reconnect_failed', function() {
        console.log('Failed to reconnect');
    });

    sendButton.addEventListener('click', sendMessage);

    function handleMessage(data) {
        const li = document.createElement('li');
        li.textContent = data.message;
        gameMessages.appendChild(li);
    }

    function handlePlayerTyping(username) {
        typingIndicator.textContent = `${username} is typing...`;
    }

    function handleYourTurn() {
        enableMessageInput();
    }

    function handleNotYourTurn() {
        alert("It's not your turn!");
    }

    function enableMessageInput() {
        messageInput.disabled = false;
        sendButton.disabled = false;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('submitTurn', { message });
            messageInput.value = '';
            messageInput.disabled = true;
            sendButton.disabled = true;
        }
    }
});
