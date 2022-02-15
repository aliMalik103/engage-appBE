const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const morgan = require('morgan');


const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.createServer(app)
const io = socketio(server).sockets;
app.use(express.json());
const customGenerationFunction = () => {
    (Math.random().toString(36) + "0000000000000000000000").substr(2, 16);
}


const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    generateClientId: customGenerationFunction,
    // allow_discovery: true


});
app.use('/peerjs', peerServer);


peerServer.on('connection', function(id) {
    console.log(id)
    console.log(server._clients)
});

server.on('disconnect', function(id) {
    console.log(id + "deconnected")
});


io.on('connection', function(socket) {
    socket.on('join-room', ({ roomID, userId }) => {


        socket.join(roomID);
        socket.to(roomID).broadcast.emit("user-connected", userId);


    })
    console.log('comnnected');

})
const port = process.env.PORT || 8000;
server.listen(port, () => console.log("Server is up and running on Port 8000"));