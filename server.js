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

io.on('connection', (socket) => {

    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
    });

    socket.on('leave-room', (roomCode) => {
        socket.leave(roomCode);
    });

    socket.on('create-room', (respond) => {
        const roomCode = shortid.generate();
        socket.join(roomCode);
        return respond(roomCode);
    });

    socket.on('start-game', (roomCode, board) => {
        io.to(roomCode).emit('start-game', board);
    });
});

const port = process.env.PORT || 5000;

http.listen(
    port, 
    () => console.log(`game server listening at post:${port}`)
);