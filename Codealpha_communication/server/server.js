require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Room = require('./models/Room');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const app = express();
const server = http.createServer(app);

// Keep Socket.io origin open since it's an API
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('WebRTC Communication Server is running');
});

// Get all users (except current)
app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.userId } }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// --- Socket.io Signaling & Real-Time Events ---
// Manage rooms: { roomId: [socketId1, socketId2...] }
const rooms = {};
// Map userId -> socketId for invitations
const userSockets = {};

io.on('connection', (socket) => {
    // Register user for invitations
    socket.on('register-user', (userId) => {
        if (userId) {
            userSockets[userId] = socket.id;
        }
    });

    // 1. Join Room
    socket.on('join-room', async (roomId, userDetails) => {
        socket.join(roomId);

        // Database logic
        let room = await Room.findOne({ roomId });
        if (!room) {
            room = new Room({ roomId, participants: [] });
            await room.save();
        }

        // Add user object ID to participants if provided and not already present
        if (userDetails && userDetails.id && !room.participants.includes(userDetails.id)) {
            room.participants.push(userDetails.id);
            await room.save();
        }

        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }

        // Give the joining user the list of all other users in this room
        const otherUsers = rooms[roomId].filter(id => id !== socket.id);
        socket.emit('all-users', otherUsers);

        // Send existing room chat history to the newly joined user
        socket.emit('room-history', room.history);

        // Add this user to the array
        if (!rooms[roomId].includes(socket.id)) {
            rooms[roomId].push(socket.id);
        }

        // Tell everyone else that this new user joined
        socket.to(roomId).emit('user-joined', { callerID: socket.id, userDetails });
    });

    // Invite User Logic
    socket.on('invite-user', (payload) => {
        // payload: { targetUserId, roomId, inviterName }
        const targetSocketId = userSockets[payload.targetUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit('room-invite', {
                roomId: payload.roomId,
                inviterName: payload.inviterName
            });
        }
    });

    // 2. WebRTC Signaling (Offers, Answers, ICE Candidates)
    socket.on('sending-signal', payload => {
        io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning-signal', payload => {
        io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
    });

    // 3. Chat and File Sharing
    socket.on('send-message', async (payload) => {
        // payload: { roomId, message, senderName, senderId, isFile, fileData }
        const timestamp = new Date().toISOString();

        const messageData = {
            ...payload,
            timestamp
        };

        io.to(payload.roomId).emit('receive-message', messageData);

        // Save to DB
        try {
            await Room.findOneAndUpdate(
                { roomId: payload.roomId },
                { $push: { history: { senderId: payload.senderId, message: payload.message, timestamp } } }
            );
        } catch (err) {
            console.error('Failed to save message to DB', err);
        }
    });

    // 4. Whiteboard Collaborative Canvas
    socket.on('draw-action', (payload) => {
        // payload: { roomId, x0, y0, x1, y1, color, isEraser }
        socket.to(payload.roomId).emit('draw-action', payload);
    });

    socket.on('clear-canvas', (roomId) => {
        socket.to(roomId).emit('clear-canvas');
    });

    // 5. User Disconnection
    socket.on('disconnect', () => {
        // Remove from userSockets tracking
        for (const [userId, sId] of Object.entries(userSockets)) {
            if (sId === socket.id) {
                delete userSockets[userId];
                break;
            }
        }

        // Find rooms user was in and remove them
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            } else {
                socket.to(roomId).emit('user-disconnected', socket.id);
            }
        }
    });
});

// Serve frontend in production (Railway single-deployment support)
const path = require('path');
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
