const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(`${__dirname}/client`));
app.get('/', (req, res) => res.status(200).sendFile(`${__dirname}/client/index.html`));

let board = Array(100).fill().map(() => Array(100).fill(null));
io.on('connection', socket => {
    socket.emit('board', board);
    socket.on('fill', ({x, y, color}) => {
        board[y][x] = color;
        io.emit('fill', {x, y, color});
        io.emit('board', board);
    });
});

server.on('error', () => console.error(err));
server.listen(3000, () => console.log('Listening on *:3000'));