import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../context/WebRTCContext';
import { UserPlus, Search, X } from 'lucide-react';

export const InviteModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const socket = useSocket();
    const { roomId } = useWebRTC();

    useEffect(() => {
        if (!isOpen) return;

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setUsers(data);
                }
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };

        fetchUsers();
    }, [isOpen]);

    const handleInvite = (targetUserId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));

        socket.emit('invite-user', {
            targetUserId,
            roomId,
            inviterName: currentUser?.username || 'Someone'
        });

        alert('Invitation Sent!');
        onClose();
    };

    if (!isOpen) return null;

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(2, 44, 34, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#0f381c', padding: 24, borderRadius: 12, width: '100%', maxWidth: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><UserPlus size={20} /> Invite Users</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X /></button>
                </div>

                <div style={{ position: 'relative', marginBottom: 16 }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: 14, color: '#8aa18c' }} />
                    <input
                        type="text"
                        placeholder="Search username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 40, width: '100%', marginBottom: 0 }}
                    />
                </div>

                <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filteredUsers.length === 0 ? (
                        <p style={{ color: '#8aa18c', textAlign: 'center' }}>No users found.</p>
                    ) : (
                        filteredUsers.map(user => (
                            <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#134e4a', padding: 12, borderRadius: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                                    <div style={{ fontSize: 12, color: '#8aa18c' }}>{user.email}</div>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 14 }} onClick={() => handleInvite(user._id)}>Invite</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
