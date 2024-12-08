
const socket = io();
let username = '';

function joinChat() {
    username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter a valid name!');
        return;
    }
    socket.emit('join', username, (response) => {
        if (response.success) {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('chat-container').style.display = 'flex';
        } else {
            alert(response.message);
        }
    });
}

function sendMessage() {
    const message = document.getElementById('message').value.trim();
    if (message) {
        socket.emit('message', message);
        document.getElementById('message').value = '';
    }
}

socket.on('user-list', (users) => {
    const usersList = document.getElementById('users');
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});

socket.on('message', ({ username, message }) => {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${username}: ${message}`;
    messageDiv.className = username === 'You' ? 'self' : 'other';
    messagesDiv.appendChild(messageDiv);
});
