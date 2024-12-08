
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (username, callback) => {
        if (users.includes(username)) {
            callback({ success: false, message: 'Username is already taken!' });
        } else {
            socket.username = username;
            users.push(username);
            io.emit('user-list', users);
            io.emit('message', { username: 'System', message: `${username} joined the chat` });
            callback({ success: true });
        }
    });

    socket.on('message', (message) => {
        io.emit('message', { username: socket.username, message });
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user !== socket.username);
        io.emit('user-list', users);
        io.emit('message', { username: 'System', message: `${socket.username} left the chat` });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
