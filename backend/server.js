const {v4:uuidv4} = require('uuid');
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const Room = require('./models/Room');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods:["GET","POST"]
    }
});
const PORT = process.env.PORT || 5001;

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully! ✅');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.get('/', (req, res) => {
    res.send('Kode.io Server is Running!');
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', async (data) => {
        const {roomId, username} = data;
        socket.join(roomId);
        
        try {
            let room = await Room.findOne({roomId: roomId});
            
            if (!room) {
                room = new Room({
                    roomId: roomId,
                    code: ''
                });
                await room.save();
                console.log(`New room ${roomId} created in database`);
            }
            
            if (!rooms.has(roomId)) {
                rooms.set(roomId, {
                    code: room.code,
                    users: new Set()
                });
            }
            
            const roomData = rooms.get(roomId);
            roomData.users.add(socket.id);

            console.log(`User ${username} joined room ${roomId}`);

            socket.emit('load-code', room.code);

            socket.to(roomId).emit('user-joined', {
                socketId: socket.id,
                username: username,
                message: `${username} joined the session`
            });
            
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', {message: 'Failed to join room'});
        }
    });

    socket.on('code-change', async (data) => {
        const {roomId, code} = data;

        try {
            if (rooms.has(roomId)) {
                rooms.get(roomId).code = code;
            }
            
            await Room.findOneAndUpdate(
                {roomId: roomId},
                {code: code, lastUpdated: Date.now()}
            );
            
            socket.to(roomId).emit('code-update', code);
        } catch (error) {
            console.error('Error saving code:', error);
        }
    });

    socket.on('cursor-move', (data) => {
        const {roomId, position, username} = data;
        
        socket.to(roomId).emit('cursor-update', {
            socketId: socket.id,
            position: position,
            username: username
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);

                socket.to(roomId).emit('user-left', {
                    socketId: socket.id,
                    message: 'A user left the session'
                });

                if (room.users.size === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted (empty)`);
                }
            }
        });
    });
});

app.get('/create-room', (req, res) => {
    const roomId = uuidv4();
    res.json({roomId: roomId});
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});