import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebRTC } from '../context/WebRTCContext';
import { VideoGrid } from '../components/VideoGrid';
import { Whiteboard } from '../components/Whiteboard';
import { Chat } from '../components/Chat';
import { InviteModal } from '../components/InviteModal';
import { MonitorUp, PhoneOff, Users, UserPlus, Mic, MicOff, Video as VideoIcon, VideoOff, MessageSquare, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Room = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const { joinRoom, shareScreen, isAudioMuted, isVideoMuted, toggleAudio, toggleVideo } = useWebRTC();

    // UI state for mobile overlays & desktop sidebars
    const [showChat, setShowChat] = useState(false);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        joinRoom(roomId, user || {});
    }, [roomId]);

    return (
        <div className="flex flex-col h-dvh bg-cream overflow-hidden relative">

            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-bottle-light bg-bottle z-40">
                <h2 className="m-0 flex items-center gap-2 text-cream font-semibold">
                    <Users size={24} className="text-emerald" />
                    <span className="hidden sm:inline">Room:</span> {roomId}

                    <button
                        className="ml-4 px-3 py-1.5 bg-bottle border border-bottle-light hover:bg-bottle-light text-cream text-sm rounded-lg flex items-center gap-2 transition"
                        onClick={() => setIsInviteOpen(true)}
                    >
                        <UserPlus size={16} /> <span className="hidden sm:inline">Invite</span>
                    </button>
                </h2>

                {/* Desktop/Tablet explicit toggles for side panels */}
                <div className="hidden lg:flex items-center gap-3">
                    <button
                        className={`btn ${showWhiteboard ? 'btn-primary' : ''}`}
                        onClick={() => setShowWhiteboard(!showWhiteboard)}
                    >
                        <PenTool size={18} /> Whiteboard
                    </button>
                    <button
                        className={`btn ${showChat ? 'btn-primary' : ''}`}
                        onClick={() => setShowChat(!showChat)}
                    >
                        <MessageSquare size={18} /> Chat
                    </button>
                </div>
            </header>

            {/* Main Content Area: Video Grid + Optional Sidebars (Desktop) */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 1. Core Video Grid Area */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <VideoGrid />
                </main>

                {/* 2. Desktop Sidebars - Hidden on mobile, forced overlay below instead */}
                <AnimatePresence>
                    {showWhiteboard && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 500, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden lg:block border-l border-bottle-light bg-bottle overflow-hidden"
                        >
                            <div className="p-4 h-full"><Whiteboard /></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden lg:flex flex-col border-l border-bottle-light bg-bottle"
                        >
                            <div className="p-4 border-b border-bottle-light flex justify-between items-center">
                                <h3 className="text-cream font-medium m-0">Chat</h3>
                            </div>
                            <div className="flex-1 p-4 overflow-hidden"><Chat /></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Overlays: Slide up from bottom when toggled on small screens */}
            <AnimatePresence>
                {showWhiteboard && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="lg:hidden fixed inset-0 z-50 bg-bottle-dark flex flex-col pt-16"
                    >
                        <button className="absolute top-4 right-4 bg-bottle-light p-2 rounded-full" onClick={() => setShowWhiteboard(false)}>✕</button>
                        <div className="flex-1 p-4"><Whiteboard /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="lg:hidden fixed inset-0 z-50 bg-bottle flex flex-col pt-16"
                    >
                        <button className="absolute top-4 right-4 bg-bottle-light p-2 text-cream rounded-full z-10" onClick={() => setShowChat(false)}>✕</button>
                        <div className="flex-1 p-4 h-full"><Chat /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glassmorphism Floating Control Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-bottle border border-bottle-light p-2 rounded-2xl shadow-2xl flex items-center justify-center gap-2 sm:gap-4 transition-all">

                {/* Mobile Toggles */}
                <button
                    className={`lg:hidden p-3 rounded-xl transition ${showChat ? 'bg-emerald' : 'bg-bottle-light hover:bg-sage'}`}
                    onClick={() => setShowChat(!showChat)}
                >
                    <MessageSquare size={20} className="text-cream" />
                </button>
                <button
                    className={`lg:hidden p-3 rounded-xl transition ${showWhiteboard ? 'bg-emerald' : 'bg-bottle-light hover:bg-sage'}`}
                    onClick={() => setShowWhiteboard(!showWhiteboard)}
                >
                    <PenTool size={20} className="text-cream" />
                </button>

                <div className="w-px h-8 bg-sage-dark hidden sm:block"></div>

                {/* Core AV Controls */}
                <button
                    className={`p-3 sm:px-4 sm:py-2 flex items-center gap-2 rounded-xl transition ${isAudioMuted ? 'bg-sage hover:bg-sage-dark' : 'bg-bottle-light hover:bg-sage'}`}
                    onClick={toggleAudio}
                >
                    {isAudioMuted ? <MicOff size={20} className="text-cream" /> : <Mic size={20} className="text-cream" />}
                    <span className="hidden sm:inline text-cream font-medium">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                    className={`p-3 sm:px-4 sm:py-2 flex items-center gap-2 rounded-xl transition ${isVideoMuted ? 'bg-sage hover:bg-sage-dark' : 'bg-bottle-light hover:bg-sage'}`}
                    onClick={toggleVideo}
                >
                    {isVideoMuted ? <VideoOff size={20} className="text-cream" /> : <VideoIcon size={20} className="text-cream" />}
                    <span className="hidden sm:inline text-cream font-medium">{isVideoMuted ? 'Start Video' : 'Stop Video'}</span>
                </button>

                <button
                    className="p-3 sm:px-4 sm:py-2 flex items-center gap-2 bg-bottle-light hover:bg-sage rounded-xl transition"
                    onClick={shareScreen}
                >
                    <MonitorUp size={20} className="text-cream" />
                    <span className="hidden sm:inline text-cream font-medium">Share</span>
                </button>

                <div className="w-px h-8 bg-sage-dark mx-1"></div>

                <button
                    className="p-3 sm:px-4 sm:py-2 flex items-center gap-2 bg-sage hover:bg-sage-dark rounded-xl transition"
                    onClick={() => navigate('/')}
                >
                    <PhoneOff size={20} className="text-cream" />
                    <span className="hidden sm:inline text-cream font-medium">Leave</span>
                </button>
            </div>

            <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </div>
    );
};
