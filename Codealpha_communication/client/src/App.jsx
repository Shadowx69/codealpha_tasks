import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { SocketProvider, useSocket } from './context/SocketContext';
import { WebRTCProvider } from './context/WebRTCContext';
import { Room } from './pages/Room';
import { Auth } from './pages/Auth';
import { IncomingInvite } from './components/IncomingInvite';
import { Video, LogOut } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [roomId, setRoomId] = useState('');
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!socket) return;

    const handleInvite = (payload) => {
      setIncomingInvite(payload);
    };

    socket.on('room-invite', handleInvite);
    return () => socket.off('room-invite', handleInvite);
  }, [socket]);

  const acceptInvite = () => {
    if (incomingInvite) {
      navigate(`/room/${incomingInvite.roomId}`);
      setIncomingInvite(null);
    }
  };

  const declineInvite = () => {
    setIncomingInvite(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      navigate(`/room/${Math.random().toString(36).substring(2, 9)}`);
    }
  };

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen p-5 bg-cream">

      <IncomingInvite
        invite={incomingInvite}
        onAccept={acceptInvite}
        onDecline={declineInvite}
      />

      <div className="absolute top-5 right-5 flex items-center gap-4 text-bottle-dark">
        <span>Welcome, <strong>{user.username}</strong></span>
        <button className="btn btn-danger" onClick={handleLogout}><LogOut size={16} /> Logout</button>
      </div>

      <div className="absolute top-5 left-5 flex items-center gap-3">
        <Video size={36} className="text-emerald" />
        <h1 className="m-0 text-2xl font-bold tracking-tight text-bottle-dark">RealConnect</h1>
      </div>

      <div style={{ background: '#0f381c', padding: 32, borderRadius: 12, width: '100%', maxWidth: 400, boxShadow: '0 8px 16px rgba(2, 44, 34, 0.5)', display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid #134e4a' }}>

        <div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={() => navigate(`/room/${Math.random().toString(36).substring(2, 9)}`)}>
            Create New Room
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', color: '#8aa18c' }}>
          <div style={{ flex: 1, height: 1, background: '#134e4a' }}></div>
          <span style={{ padding: '0 12px', fontSize: 14 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#134e4a' }}></div>
        </div>

        <form onSubmit={joinRoom} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, color: '#8aa18c' }}>Join Existing Room</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID..."
              style={{ marginBottom: 0 }}
              required
            />
          </div>
          <button className="btn" type="submit" style={{ justifyContent: 'center', width: '100%' }}>
            Join Room
          </button>
        </form>

      </div>
    </div>
  );
};

function App() {
  return (
    <SocketProvider>
      <WebRTCProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Room />} />
          </Routes>
        </BrowserRouter>
      </WebRTCProvider>
    </SocketProvider>
  );
}

export default App;
