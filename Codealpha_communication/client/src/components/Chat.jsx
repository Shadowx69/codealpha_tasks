import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../context/WebRTCContext';
import { Send, Paperclip } from 'lucide-react';

export const Chat = () => {
    const socket = useSocket();
    const { roomId } = useWebRTC();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (payload) => {
            setMessages((prev) => [...prev, payload]);
        };

        const handleRoomHistory = (history) => {
            setMessages(history);
        };

        socket.on('receive-message', handleReceiveMessage);
        socket.on('room-history', handleRoomHistory);
        return () => {
            socket.off('receive-message', handleReceiveMessage);
            socket.off('room-history', handleRoomHistory);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const payload = {
            roomId,
            message,
            senderName: 'Me', // Ideally from Auth context
            senderId: socket.id,
            isFile: false
        };

        socket.emit('send-message', payload);
        setMessage('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large (max 2MB for base64 sharing)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;

            const payload = {
                roomId,
                message: file.name,
                senderName: 'Me',
                senderId: socket.id,
                isFile: true,
                fileData: base64Data,
                mimeType: file.type
            };

            socket.emit('send-message', payload);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f381c', borderRadius: 8 }}>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className="message" style={{ alignSelf: msg.senderId === socket?.id ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <span style={{ fontSize: 12, color: '#8aa18c', display: 'block', marginBottom: 4 }}>
                            {msg.senderId === socket?.id ? 'Me' : 'User'}
                        </span>
                        {msg.isFile ? (
                            <div>
                                <a href={msg.fileData} download={msg.message} style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Paperclip size={16} /> {msg.message}
                                </a>
                            </div>
                        ) : (
                            <span style={{ color: '#f8f4e6' }}>{msg.message}</span>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', padding: 12, gap: 8, borderTop: '1px solid #134e4a' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ marginBottom: 0 }}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button type="button" className="btn" onClick={() => fileInputRef.current.click()}>
                    <Paperclip size={18} />
                </button>
                <button type="submit" className="btn btn-primary">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
