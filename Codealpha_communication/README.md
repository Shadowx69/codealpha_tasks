# RealConnect 🎥

A real-time video communication platform built with WebRTC and Socket.io. Users can create or join rooms for multi-party video calls, chat, file sharing, and collaborative whiteboarding.

---

## Features

- 🔐 **Authentication** — Register & login with JWT-based auth (7-day token)
- 📹 **Video & Audio Calls** — Multi-user WebRTC peer-to-peer video conferencing
- 🖥️ **Screen Sharing** — Share your screen with everyone in the room
- 🎙️ **Mic & Camera Controls** — Toggle audio/video on the fly
- 💬 **Real-time Chat** — In-room messaging with full chat history (persisted in MongoDB)
- 📎 **File Sharing** — Share files up to 2MB via base64 encoding over Socket.io
- 🎨 **Collaborative Whiteboard** — Draw together in real-time with pen, brush, spray, and eraser tools
- 📨 **User Invitations** — Invite registered users directly to your room by name
- 📱 **Responsive UI** — Fully responsive layout with mobile overlays and desktop sidebars

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Socket.io Client | Real-time communication |
| Simple-Peer | WebRTC peer connections |
| Framer Motion | Animated sidebars & overlays |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| Socket.io | WebSocket signaling server |
| MongoDB + Mongoose | Database (users, rooms, chat history) |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| .env | Environment variable management |

---

## Project Structure

```
Codealpha_communication/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Chat.jsx          # In-room chat & file sharing
│       │   ├── Whiteboard.jsx    # Collaborative canvas
│       │   ├── VideoGrid.jsx     # Peer video streams grid
│       │   ├── InviteModal.jsx   # Invite users to room
│       │   └── IncomingInvite.jsx# Incoming invite notification
│       ├── context/
│       │   ├── SocketContext.jsx # Global Socket.io connection
│       │   └── WebRTCContext.jsx # WebRTC peer management
│       └── pages/
│           ├── Auth.jsx          # Login / Register page
│           └── Room.jsx          # Main room page
└── server/                   # Node.js backend
    ├── server.js             # Express + Socket.io entry point
    └── models/
        ├── User.js           # User schema (username, email, password)
        └── Room.js           # Room schema (participants, chat history)
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone <repo-url>
cd Codealpha_communication
```

### 2. Setup the Server
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/realconnect
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start the server:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Setup the Client
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the client:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/users` | ✅ | Get all users (except self) |

---

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `register-user` | Client → Server | Map userId to socket for invitations |
| `join-room` | Client → Server | Join a room and receive peers + chat history |
| `invite-user` | Client → Server | Send a room invite to another user |
| `sending-signal` | Client → Server | WebRTC offer/signal to a peer |
| `returning-signal` | Client → Server | WebRTC answer back to caller |
| `send-message` | Client → Server | Send a chat message or file |
| `draw-action` | Client → Server | Broadcast a whiteboard stroke |
| `clear-canvas` | Client → Server | Clear the whiteboard for all peers |
| `room-invite` | Server → Client | Receive an incoming room invitation |
| `all-users` | Server → Client | List of existing peers in the room |
| `user-joined` | Server → Client | New peer joined with their signal |
| `receiving-returned-signal` | Server → Client | Peer's WebRTC answer signal |
| `receive-message` | Server → Client | Incoming chat message or file |
| `room-history` | Server → Client | Full chat history on room join |
| `user-disconnected` | Server → Client | A peer has left the room |

---

## Production Deployment

The server is configured for single-deployment (e.g. Railway). It serves the compiled frontend static files from `client/dist`:

```bash
# Build the frontend first
cd client && npm run build

# Then start the server — it serves both API and frontend
cd ../server && npm start
```

Set `VITE_BACKEND_URL` to your production domain before building the client.
