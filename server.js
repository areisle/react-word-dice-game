const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const shortid = require('shortid');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (_, res) => {
    const filePath = path.join(__dirname, 'build/index.html');
    res.sendFile(filePath);
});

const getUsersToUsernames = (roomCode) => {
    const room = io.sockets.adapter.rooms[roomCode];
    const roomUsers = {};

    if (room && room.sockets) {
        for (const clientId of Object.keys(room.sockets)) {
            const {
                userCode,
                username,
            } = io.sockets.connected[clientId];
            roomUsers[userCode] = username || null;
        }
    }
    return roomUsers;
}

io.on('connection', (socket) => {
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        io.to(roomCode).emit('users-changed', getUsersToUsernames(roomCode));
    });

    socket.on('leave-room', (roomCode) => {
        socket.leave(roomCode);
        io.to(roomCode).emit('users-changed', getUsersToUsernames(roomCode));
    });

    socket.on('create-room', (respond) => {
        const roomCode = shortid.generate();
        return respond(roomCode);
    });

    socket.on('set-user-code', (userCode) => {
        socket.userCode = userCode;
    });

    socket.on('update-username', (roomCode, username) => {
        socket.username = username;
        io.to(roomCode).emit('users-changed', getUsersToUsernames(roomCode));
    });

    socket.on('start-game', (roomCode, board) => {
        io.to(roomCode).emit('start-game', board);
    });

    socket.on('update-mouse-position', (roomCode, position) => {
        io.to(roomCode).emit(
            'mouse-position-updated',
            socket.userCode,
            position,
        );
    });
});

const port = process.env.PORT || 5000;

http.listen(
    port, 
    () => console.log(`game server listening at post:${port}`)
);